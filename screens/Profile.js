import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import MaskInput, { Masks } from "react-native-mask-input";

export default function Profile({ navigation, onLogout }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [emailNews, setEmailNews] = useState(false);
  const [emailOffers, setEmailOffers] = useState(false);
  const [emailPassword, setEmailPassword] = useState(false);
  const [emailOrders, setEmailOrders] = useState(false);

  const [backup, setBackup] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = {
          firstName: (await AsyncStorage.getItem("firstName")) || "",
          lastName: (await AsyncStorage.getItem("lastName")) || "",
          email: (await AsyncStorage.getItem("email")) || "",
          phone: (await AsyncStorage.getItem("phone")) || "",
          avatar: (await AsyncStorage.getItem("avatar")) || null,
          emailNews: (await AsyncStorage.getItem("emailNews")) === "true",
          emailOffers: (await AsyncStorage.getItem("emailOffers")) === "true",
          emailPassword:
            (await AsyncStorage.getItem("emailPassword")) === "true",
          emailOrders: (await AsyncStorage.getItem("emailOrders")) === "true",
        };

        setFirstName(storedData.firstName);
        setLastName(storedData.lastName);
        setEmail(storedData.email);
        setPhone(storedData.phone);
        setAvatar(storedData.avatar);
        setEmailNews(storedData.emailNews);
        setEmailOffers(storedData.emailOffers);
        setEmailPassword(storedData.emailPassword);
        setEmailOrders(storedData.emailOrders);

        setBackup(storedData);
      } catch (e) {
        console.error("Failed to load profile data", e);
      }
    };

    loadData();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (e) {
      console.error("Image pick failed", e);
    }
  };

  const saveChanges = async () => {
    try {
      await AsyncStorage.setItem("firstName", firstName);
      await AsyncStorage.setItem("lastName", lastName);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("phone", phone);
      if (avatar) {
        await AsyncStorage.setItem("avatar", avatar);
      } else {
        await AsyncStorage.removeItem("avatar");
      }
      await AsyncStorage.setItem("emailNews", emailNews.toString());
      await AsyncStorage.setItem("emailOffers", emailOffers.toString());
      await AsyncStorage.setItem("emailPassword", emailPassword.toString());
      await AsyncStorage.setItem("emailOrders", emailOrders.toString());

      Alert.alert("Success", "Profile saved successfully!");

      setBackup({
        firstName,
        lastName,
        email,
        phone,
        avatar,
        emailNews,
        emailOffers,
        emailPassword,
        emailOrders,
      });
    } catch (e) {
      console.error("Failed to save profile", e);
      Alert.alert("Error", "Failed to save changes.");
    }
  };

  const discardChanges = () => {
    setFirstName(backup.firstName);
    setLastName(backup.lastName);
    setEmail(backup.email);
    setPhone(backup.phone);
    setAvatar(backup.avatar);
    setEmailNews(backup.emailNews);
    setEmailOffers(backup.emailOffers);
    setEmailPassword(backup.emailPassword);
    setEmailOrders(backup.emailOrders);
  };

  const logout = async () => {
    try {
      const keys = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "avatar",
        "emailNews",
        "emailOffers",
        "emailPassword",
        "emailOrders",
      ];
      await AsyncStorage.multiRemove(keys);

      if (onLogout) await onLogout();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const renderAvatar = () => {
    if (avatar) {
      return <Image source={{ uri: avatar }} style={styles.avatar} />;
    } else {
      const initials = `${firstName[0] || ""}${
        lastName[0] || ""
      }`.toUpperCase();
      return (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.backText}>← Home</Text>
      </TouchableOpacity>

      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={pickImage}>
          {renderAvatar()}
        </TouchableOpacity>
        {avatar && (
          <TouchableOpacity
            style={styles.removeAvatarButton}
            onPress={() => setAvatar(null)}
          >
            <Text style={styles.removeAvatarText}>Remove Avatar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <MaskInput
          style={styles.input}
          placeholder="Enter phone number"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
          mask={Masks.USA_PHONE}
        />
      </View>

      <View style={styles.checkboxContainer}>
        <Text style={styles.sectionTitle}>Email Notifications</Text>
        <TouchableOpacity
          onPress={() => setEmailNews(!emailNews)}
          style={styles.checkbox}
        >
          <Text>{emailNews ? "[x]" : "[ ]"} Newsletters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEmailOffers(!emailOffers)}
          style={styles.checkbox}
        >
          <Text>{emailOffers ? "[x]" : "[ ]"} Special Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEmailPassword(!emailPassword)}
          style={styles.checkbox}
        >
          <Text>{emailPassword ? "[x]" : "[ ]"} Password Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setEmailOrders(!emailOrders)}
          style={styles.checkbox}
        >
          <Text>{emailOrders ? "[x]" : "[ ]"} Order Statuses</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.discard]}
          onPress={discardChanges}
        >
          <Text style={styles.buttonText}>Discard Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.save]}
          onPress={saveChanges}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.button, styles.logout]} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 30,
    marginBottom: 20,
  },
  backText: {
    color: "#495E57",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    color: "#7c7c7cff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
  },
  removeAvatarButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f44336",
    borderRadius: 6,
  },
  removeAvatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  checkboxContainer: {
    width: "100%",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    padding: 12,
    borderRadius: 6,
    marginVertical: 10,
    flex: 1,
    alignItems: "center",
  },
  discard: {
    backgroundColor: "#f0ad4e",
    marginRight: 5,
  },
  save: {
    backgroundColor: "#4CAF50",
    marginLeft: 5,
  },
  logout: {
    backgroundColor: "#f44336",
    width: "100%",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
