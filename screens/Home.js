import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import Categories from "../components/Categories";
import HeroBanner from "../components/HeroBanner";
import useDebounce from "../hooks/useDebounce";

import {
  initializeDB,
  createTable,
  saveMenuItems,
  getMenuItems,
  getMenuItemsBySearchAndCategories,
} from "../database/db";

const MENU_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

export default function HomeScreen({ navigation }) {
  const [menu, setMenu] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [dbReady, setDbReady] = useState(false);

  const debouncedSearchText = useDebounce(searchText, 500);

  const DEFAULT_IMG = "https://cdn-icons-png.flaticon.com/512/3075/3075977.png";

  useEffect(() => {
    async function loadData() {
      try {
        // Initialize DB and ensure table exists
        await initializeDB();
        await createTable();

        // Fetch menu JSON
        const response = await fetch(MENU_URL);
        const json = await response.json();

        const items = json.menu.map((item) => ({
          title: item.name,
          description: item.description,
          price: item.price,
          image: item.image
            ? `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`
            : DEFAULT_IMG,
          category: item.category,
        }));

        // Save to SQLite
        await saveMenuItems(items);

        // Set categories
        setCategories([...new Set(items.map((i) => i.category))]);

        // Load saved menu
        const savedMenu = await getMenuItems();
        setMenu(savedMenu);
        setDbReady(true);
      } catch (err) {
        console.error("Critical error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter menu on search or category change
  useEffect(() => {
    if (!dbReady) return;

    async function filterMenu() {
      setLoading(true);
      try {
        const filteredMenu = await getMenuItemsBySearchAndCategories(
          debouncedSearchText,
          selectedCategories
        );
        setMenu(filteredMenu);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    filterMenu();
  }, [debouncedSearchText, selectedCategories, dbReady]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.image} />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#495E57" />
        <Text style={{ marginTop: 10 }}>Loading menu data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header profile={true} />

      <HeroBanner
        value={searchText}
        onSearchChange={setSearchText}
        showSearch={true}
      />

      <Text style={styles.header}>ORDER FOR DELIVERY!</Text>

      <Categories
        categories={categories}
        selectedCategories={selectedCategories}
        onSelectionChange={setSelectedCategories}
      />

      <FlatList
        data={menu}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "lightgrey",
  },
  textContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});
