import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OnboardingScreen from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";
import SplashScreen from "./screens/SplashScreen";
import HomeScreen from "./screens/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] =
    React.useState(false);

  React.useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("hasOnboarded");
        setIsOnboardingCompleted(value === "true");
      } catch (e) {
        console.error("Failed to load onboarding status", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  const handleOnboardingComplete = async (firstName) => {
    try {
      await AsyncStorage.setItem("hasOnboarded", "true");
      await AsyncStorage.setItem("firstName", firstName);
      setIsOnboardingCompleted(true); // Update state
    } catch (e) {
      console.error("Failed to save onboarding data", e);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setIsOnboardingCompleted(false);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboardingCompleted ? (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <OnboardingScreen
                {...props}
                onComplete={handleOnboardingComplete}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
