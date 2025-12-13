import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function Header({ profile }) {
  const [avatar, setAvatar] = useState(null);
  const [initials, setInitials] = useState("");

  const navigation = useNavigation();

  const loadAvatar = async () => {
    try {
      const storedAvatar = await AsyncStorage.getItem("avatar");
      const storedFirstName = await AsyncStorage.getItem("firstName");
      const storedLastName = await AsyncStorage.getItem("lastName");

      if (storedAvatar) {
        setAvatar(storedAvatar);
      } else {
        const first = storedFirstName?.charAt(0) ?? "";
        const last = storedLastName?.charAt(0) ?? "";
        setInitials((first + last).toUpperCase());
      }
    } catch (e) {
      console.error("Failed to load avatar", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAvatar();
    }, [])
  );

  const renderAvatar = () => {
    if (!profile) return null;

    if (avatar) {
      return (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.initialCircle}
      >
        <Text style={styles.initialsText}>{initials}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.side} />
      <Image source={require("../assets/Logo.png")} style={styles.logo} />
      <View style={styles.side}>{renderAvatar()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  side: {
    width: 40,
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 50,
    resizeMode: "contain",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});
