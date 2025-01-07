import { supabase } from "./client";

export const addProduct = async (product: {
  name: string;
  description: string;
  price: number;
}) => {
  const { data, error } = await supabase.from("products").insert([product]);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateProduct = async (
  id: string,
  updates: Partial<{ name: string; description: string; price: number }>
) => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteProduct = async (id: string) => {
  const { data, error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signUp = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      throw error;
    }
    return user;
  };