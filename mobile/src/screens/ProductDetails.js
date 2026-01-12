import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useCart } from "../contexts/CartContext";

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
      //TODO -  we will add a toast notification here
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images?.[0] }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productWeight}>{product.weight}g</Text>
        <Text style={styles.productPrice}>${product.price}</Text>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.productDescription}>
          {product.description ||
            "Fresh and high-quality product from Andan Stores."}
        </Text>

        {/* Category */}
        <Text style={styles.sectionTitle}>Category</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
      </View>

      {/* Add to Cart Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F4F7",
  },
  imageContainer: {
    backgroundColor: "white",
    padding: 16,
  },
  productImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
  },
  productInfo: {
    backgroundColor: "white",
    marginTop: 16,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  productWeight: {
    fontSize: 16,
    color: "#A7AAA7",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#51950A",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  productCategory: {
    fontSize: 16,
    color: "#51950A",
    fontWeight: "500",
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "white",
  },
  addToCartButton: {
    backgroundColor: "#51950A",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductDetails;
