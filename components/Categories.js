import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

export default function Categories({
  categories,
  selectedCategories,
  onSelectionChange,
}) {
  const toggleCategory = (category) => {
    const updatedSelection = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    onSelectionChange?.(updatedSelection);
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedCategories.includes(item);
    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.selectedCategory]}
        onPress={() => toggleCategory(item)}
      >
        <Text style={[styles.categoryText, isSelected && styles.selectedText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ height: 50 }}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 5,
    alignItems: "center",
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: "#495E57",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
