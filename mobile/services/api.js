import axios from "axios";

const API_URL = "http://192.168.0.111:5000/api"; //the local ip to the localhost machine

const api = axios.create({
  baseURL: API_URL,
});

// the function is calling products from the database to display on the mobile App
export const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export default api;
