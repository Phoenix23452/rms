
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category?: {
    name: string;
    slug: string;
  };
  description: string;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_popular: boolean;
  is_special_deal: boolean;
  discount_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface ProductOption {
  id: string;
  product_id: string;
  name: string;
  price_adjustment: number;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:category_id(name, slug)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return data || [];
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:category_id(name, slug)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
};

export const fetchProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (categoryError || !category) {
    console.error('Error fetching category:', categoryError);
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, category:category_id(name, slug)')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data || [];
};

export const fetchProductOptions = async (productId: string): Promise<ProductOption[]> => {
  const { data, error } = await supabase
    .from('product_options')
    .select('*')
    .eq('product_id', productId);

  if (error) {
    console.error('Error fetching product options:', error);
    return [];
  }

  return data || [];
};

export const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  // Ensure all required fields are present
  const completeProductData = {
    ...productData,
    is_special_deal: productData.is_special_deal !== undefined ? productData.is_special_deal : false,
    discount_percentage: productData.discount_percentage !== undefined ? productData.discount_percentage : 0
  };

  const { data, error } = await supabase
    .from('products')
    .insert([completeProductData])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return data;
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }

  return true;
};

export const addProductOption = async (option: Omit<ProductOption, 'id'>): Promise<ProductOption | null> => {
  const { data, error } = await supabase
    .from('product_options')
    .insert([option])
    .select()
    .single();

  if (error) {
    console.error('Error adding product option:', error);
    throw error;
  }

  return data;
};
