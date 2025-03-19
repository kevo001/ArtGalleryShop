import React, { useEffect, useState } from "react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
      {/* NAVIGATION */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#282828] to-[#3E3E3E] drop-shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F5F5]">galleri edwin</h1>
          <p className="text-[#CCCCCC] text-sm">Discover the exceptional living with art</p>
        </div>
        <ul className="flex space-x-6">
          <li>
            <a href="/admin" className="text-[#F5F5F5] hover:text-[#FFD700]">Home</a>
          </li>
          <li>
            <a href="#" className="text-[#F5F5F5] hover:text-[#FFD700]">Orders</a>
          </li>
          <li>
            <a href="/admin/products" className="text-[#FFD700] border-b-2 border-[#FFD700] pb-1">Products</a>
          </li>
          <li>
            <a href="#" className="text-[#F5F5F5] hover:text-[#FFD700]">Artists</a>
          </li>
          <li>
            <a href="#" className="text-[#F5F5F5] hover:text-[#FFD700]">Log Out</a>
          </li>
        </ul>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#444] to-[#2F2F2F] text-center py-10 shadow-lg">
        <h1 className="text-4xl font-bold text-white">Produkter</h1>
        <p className="text-gray-300 mt-2">Administrer, opprett og rediger produktene i galleriet</p>
      </header>

      {/* FILTERS & ACTION BUTTONS */}
      <section className="flex flex-col md:flex-row justify-between items-center mt-6 max-w-5xl mx-auto w-full px-4">
        <div className="space-x-4">
          <button className="text-[#FFD700] hover:underline">Malerier</button>
          <button className="text-[#FFD700] hover:underline">Skulpturer</button>
          <button className="text-[#FFD700] hover:underline">Fotografi</button>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <select className="bg-[#2A2A2A] text-white px-3 py-2 rounded-lg">
            <option>Sorter: Nyeste</option>
            <option>Sorter: Eldste</option>
          </select>
          <button className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold">
            Create New
          </button>
        </div>
      </section>

      {/* PRODUCT LIST */}
      <section className="mt-8 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-[#2A2A2A] p-4 rounded-lg shadow-lg">
              <img src={product.imageUrl} alt={product.title} className="w-full h-32 object-cover rounded" />
              <h3 className="mt-4 text-lg font-bold text-[#FFD700]">{product.title}</h3>
              <p className="text-sm text-gray-400">{product.description}</p>
              <div className="flex justify-between mt-4">
                <button className="text-blue-400 hover:underline">Edit</button>
                <button className="text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto text-center py-6 text-[#888] bg-[#1A1A1A] border-t border-[#333]">
        <p>&copy; 2025 galleri edwin – Adminpanel</p>
      </footer>
    </div>
  );
};

export default AdminProducts;