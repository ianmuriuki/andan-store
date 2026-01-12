import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Plus } from "lucide-react-native";
import { useCart } from "../contexts/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigation = useNavigation();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleCardPress = () => {
    navigation.navigate("ProductDetails", { product });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: product.images?.[0] || "https://via.placeholder.com/150",
          }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.productTitle}>{product.name || "Product"}</Text>
        <Text style={styles.productWeight}>{product.weight || 0}g</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.productPrice}>${product.price || 0}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
            onPressIn={(e) => e.stopPropagation()}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 30, // rounded-[30px]
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, // very subtle shadow (shadow-sm)
    shadowRadius: 2,
    elevation: 2,
    padding: 12, // small p-3
    marginBottom: 16,
    width: "48%", // approximately 48% width for two-column layout
  },
  imageContainer: {
    backgroundColor: "#F5F4F7", // light gray background
    height: 140, // fixed height for image area
    width: "100%", // stretches across the card
    borderTopLeftRadius: 30, // match card's border radius
    borderTopRightRadius: 30,
    overflow: "hidden", // prevent image from bleeding outside rounded corners
    marginBottom: 12,
  },
  productImage: {
    width: "100%", // fill entire container width
    height: "100%", // fill entire container height
  },
  content: {
    paddingHorizontal: 4,
  },
  productTitle: {
    fontSize: 16, // text-base
    fontWeight: "bold",
    color: "#1A1A1A", // dark text
    marginBottom: 4,
  },
  productWeight: {
    fontSize: 12, // text-xs
    color: "#A7AAA7", // muted gray
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#51950A", // green text
  },
  addButton: {
    backgroundColor: "#51950A",
    borderRadius: 50, // rounded-full (perfect circle)
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -8,
    right: -8,
  },
});

export default ProductCard;
