import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

// Get products with filters
export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};

// Get featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productService.getFeaturedProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search products
export const useSearchProducts = (query, filters = {}) => {
  return useQuery({
    queryKey: ['products', 'search', query, filters],
    queryFn: () => productService.searchProducts(query, filters),
    enabled: !!query,
  });
};

// Add product review
export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, reviewData }) => 
      productService.addReview(productId, reviewData),
    onSuccess: (data, variables) => {
      toast.success('Review added successfully!');
      queryClient.invalidateQueries(['product', variables.productId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add review');
    },
  });
};

// Admin: Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productData) => productService.createProduct(productData),
    onSuccess: () => {
      toast.success('Product created successfully!');
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

// Admin: Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, productData }) => productService.updateProduct(id, productData),
    onSuccess: () => {
      toast.success('Product updated successfully!');
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });
};

// Admin: Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};