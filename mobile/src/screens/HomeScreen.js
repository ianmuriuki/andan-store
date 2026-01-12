import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { fetchProducts } from "../../services/api";
import ProductCard from "../components/ProductCard";

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Vegetable", "Fruits", "Juices"];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.categoryTextActive,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => {
    if (!item) return null;
    return <ProductCard product={item} />;
  };

  const ListHeaderComponent = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.headerSubtext}>Good morning</Text>
            <Text style={styles.headerName}>John William</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.locationText}>📍 New York, USA</Text>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search for products..."
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <Text style={styles.promoTitle}>Up to 50% Off</Text>
        <Text style={styles.promoSubtitle}>
          Enjoy our big offer of every day
        </Text>
        <TouchableOpacity style={styles.promoButton}>
          <Text style={styles.promoButtonText}>Grab Now</Text>
        </TouchableOpacity>
      </View>

      {/* Category List */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <Text style={styles.chevronIcon}>›</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Product Section Header */}
      <View style={styles.productHeader}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
      </View>
    </>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) =>
          item?.id?.toString() || Math.random().toString()
        }
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.productListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "white",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerSubtext: {
    fontSize: 14,
    color: "#A7AAA7",
  },
  headerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#A7AAA7",
    marginLeft: 4,
  },
  filterIcon: {
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  promoBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#51950A",
    borderRadius: 16,
    padding: 24,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 14,
    color: "white",
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#51950A",
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 14,
    color: "#51950A",
    marginRight: 4,
  },
  chevronIcon: {
    fontSize: 16,
    color: "#51950A",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#A7AAA7",
  },
  categoryButtonActive: {
    backgroundColor: "#51950A",
    borderColor: "#51950A",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  categoryTextActive: {
    color: "white",
  },
  productHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  productListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "#A7AAA7",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#A7AAA7",
    textAlign: "center",
  },
});

export default HomeScreen;
