"use client";
import { useEffect, useState } from "react";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "@/utils/supabase/utils";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Define fetchProducts function to fetch and update the product list
  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
      });
      setNewProduct({ id: "", name: "", description: "", price: 0 });
      fetchProducts(); // Call fetchProducts after adding a new product
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProduct = async (id: string) => {
    const product = products.find((product) => product.id === id);
    if (product) {
      setEditingProduct(product);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      try {
        await updateProduct(editingProduct.id, {
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
        });
        setEditingProduct(null);
        fetchProducts(); // Call fetchProducts after updating a product
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      fetchProducts(); // Call fetchProducts after deleting a product
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Products
      </h1>

      {/* Add New Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Add New Product
        </h2>
        <form className="space-y-4" onSubmit={handleAddProduct}>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="description"
            placeholder="Product Description"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          />
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            name="price"
            placeholder="Product Price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
          <button
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Products List
        </h2>
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center p-4 border-b border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-lg font-semibold text-gray-800">
                  ${product.price}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                  onClick={() => handleEditProduct(product.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Edit Product
          </h2>
          <form className="space-y-4" onSubmit={handleUpdateProduct}>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="name"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              required
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="description"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
              required
            />
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              name="price"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: Number(e.target.value),
                })
              }
              required
            />
            <button
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              type="submit"
            >
              Update Product
            </button>
            <button
              className="w-full p-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
              type="button"
              onClick={() => setEditingProduct(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
