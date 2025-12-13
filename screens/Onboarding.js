import React, { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import HeroBanner from "../components/HeroBanner";

export default function Onboarding({ onComplete }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  const isNameValid = /^[A-Za-z]+$/.test(firstName.trim());
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid = isNameValid && isEmailValid;

  const handleNext = async () => {
    if (!isFormValid) {
      Alert.alert("Invalid Input", "Please enter a valid name and email.");
      return;
    }

    try {
      await AsyncStorage.setItem("firstName", firstName.trim());
      await AsyncStorage.setItem("email", email.trim());

      const optionalFields = {
        phone: "",
        avatar: "",
        emailNews: "false",
        emailOffers: "false",
        emailPassword: "false",
        emailOrders: "false",
      };

      for (const [key, value] of Object.entries(optionalFields)) {
        await AsyncStorage.setItem(key, value);
      }

      if (onComplete) onComplete(firstName.trim());
    } catch (e) {
      console.error("Failed to save onboarding data", e);
      Alert.alert("Error", "Failed to save data. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <HeroBanner showSearch={false} />

      <Text style={styles.label}>First Name*</Text>
      <Input
        placeholder="Enter your first name"
        value={firstName}
        onChangeText={setFirstName}
        error={!isNameValid && firstName ? "Invalid first name" : ""}
      />

      <Text style={styles.label}>Email*</Text>
      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        error={!isEmailValid && email ? "Invalid email" : ""}
      />

      <Button title="Next" disabled={!isFormValid} onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    color: "#7c7c7cff",
  },
});
