import React from "react";
import { View, Text, Image, TextInput, StyleSheet } from "react-native";

export default function HeroBanner({ value, onSearchChange, showSearch }) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Little Lemon</Text>
          <Text style={styles.subtitle}>Chicago</Text>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {showSearch && showSearch == true ? (
        <TextInput
          style={styles.searchInput}
          placeholder="Search dishes..."
          value={value}
          onChangeText={onSearchChange}
        />
      ) : (
        ""
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4CE14",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    color: "#333",
    marginVertical: 4,
  },
  description: {
    fontSize: 14,
    color: "#222",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginTop: 8,
  },
});
