import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
