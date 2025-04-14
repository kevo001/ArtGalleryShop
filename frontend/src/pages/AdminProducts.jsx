import React, { useEffect, useState } from "react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [artists, setArtists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newProduct, setNewProduct] = useState({
    title: "", description: "", price: "", size: "", category: "", artistId: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/items")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/artists")
      .then(res => res.json())
      .then(data => setArtists(data))
      .catch(err => console.error("Error fetching artists:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { title, description, price, size, category, artistId } = newProduct;
    if (!title || !description || !price || !size || !category || !artistId || !selectedFile) {
      alert("Alle felt må fylles ut, inkludert bilde.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("size", size);
      formData.append("category", category);
      formData.append("artistId", artistId);
      formData.append("image", selectedFile);

      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const updated = await fetch("http://localhost:5000/api/items");
        const data = await updated.json();
        setProducts(data);
        setIsModalOpen(false);
        setNewProduct({ title: "", description: "", price: "", size: "", category: "", artistId: "" });
        setSelectedFile(null);
      } else {
        const err = await res.json();
        console.error("Error:", err);
        alert("Noe gikk galt under opplasting.");
      }
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (res.ok) {
        const updated = await fetch("http://localhost:5000/api/categories");
        const data = await updated.json();
        setCategories(data);
        setNewCategoryName("");
        setIsCategoryModalOpen(false);
      }
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Er du sikker på at du vil slette dette produktet?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/items/${selectedProduct._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== selectedProduct._id));
        setSelectedProduct(null);
      } else {
        alert("Feil ved sletting av produktet.");
      }
    } catch (err) {
      console.error("Feil ved sletting:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
      {/* NAVIGATION */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#282828] to-[#3E3E3E] drop-shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F5F5]">galleri edwin</h1>
          <p className="text-[#CCCCCC] text-sm">Discover the exceptional living with art</p>
        </div>
        <ul className="flex space-x-6">
          <li><a href="/admin" className="text-white hover:text-[#FFD700]">Home</a></li>
          <li><a href="/admin/order-history" className="text-white hover:text-[#FFD700]">Orders</a></li>
          <li><a href="/admin/products" className="text-[#FFD700]">Products</a></li>
          <li><a href="/admin/artists" className="text-white hover:text-[#FFD700]">Artists</a></li>
          <li><a href="#" className="text-white hover:text-[#FFD700]">Log Out</a></li>
        </ul>
      </nav>

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-80 relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-white mb-4 text-center">Ny kategori</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Kategorinavn"
              className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
            />
            <button
              className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold w-full hover:bg-[#ffbb00]"
              onClick={handleCreateCategory}
            >
              Opprett
            </button>
          </div>
        </div>
      )}

      {/* FILTERS & CREATE */}
      <section className="mt-8 max-w-7xl mx-auto px-4">
        <section className="mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <select
                className="bg-[#2A2A2A] text-white px-3 py-2 rounded-lg border border-[#444] cursor-pointer hover:border-[#FFD700] transition duration-300"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option value="">Alle kategorier</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="bg-[#2A2A2A] text-white px-3 py-2 rounded-lg border border-[#444] hover:border-[#FFD700] transition"
              >
                +
              </button>
            </div>
            <button
              className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold"
              onClick={() => setIsModalOpen(true)}
            >
              Create New
            </button>
          </div>
        </section>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products
            .filter(product => !activeCategory || product.category === activeCategory)
            .map((product) => (
              <div
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="cursor-pointer w-[230px] rounded-2xl bg-[#2A2A2A] overflow-hidden shadow-md border-2 border-[#2A2A2A] hover:border-[#FFD700] transition"
              >
                <div className="h-[160px] bg-[#2A2A2A] flex items-center justify-center overflow-hidden p-2">
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:5000${product.imageUrl}`}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">Bilde kommer</p>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#FFD700]">{product.title}</h3>
                  <p className="text-sm text-gray-300">{product.price} kr</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-[400px] relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">{selectedProduct.title}</h2>
            {selectedProduct.imageUrl && (
              <div className="mb-4">
                <img
                  src={`http://localhost:5000${selectedProduct.imageUrl}`}
                  alt={selectedProduct.title}
                  className="w-full max-h-[300px] object-contain rounded"
                />
              </div>
            )}
            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Pris:</span> {selectedProduct.price} kr</p>
            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Beskrivelse:</span> {selectedProduct.description}</p>
            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Størrelse:</span> {selectedProduct.size}</p>
            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Kategori:</span> {selectedProduct.category}</p>
            {selectedProduct.artist?.name && (
              <p className="text-sm text-gray-300 mb-3"><span className="font-semibold text-white">Kunstner:</span> {selectedProduct.artist.name}</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Slett
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Legg til nytt produkt</h2>

            {["title", "description", "price", "size"].map((field) => (
              <div key={field}>
                <label className="block text-[#F5F5F5] mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "price" ? "number" : "text"}
                  name={field}
                  className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
                  value={newProduct[field]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <label className="block text-[#F5F5F5] mb-1">Bilde</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full p-2 mb-2 bg-[#1A1A1A] text-white rounded border border-gray-600"
            />
            {selectedFile && (
              <div className="mb-4">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full max-h-[200px] object-contain rounded"
                />
              </div>
            )}

            <label className="block text-[#F5F5F5] mb-1">Kategori</label>
            <select
              name="category"
              className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600"
              value={newProduct.category}
              onChange={handleChange}
            >
              <option value="">Velg en kategori</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <label className="block text-[#F5F5F5] mb-1">Kunstner</label>
            <select
              name="artistId"
              className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600"
              value={newProduct.artistId}
              onChange={handleChange}
            >
              <option value="">Velg en kunstner</option>
              {artists.map((artist) => (
                <option key={artist._id} value={artist._id}>{artist.name}</option>
              ))}
            </select>

            <div className="flex justify-between mt-6">
              <button
                className="bg-[#FFD700] hover:bg-[#ffbb00] text-black px-4 py-2 rounded-lg font-semibold w-1/2 mr-2"
                onClick={handleSubmit}
              >
                Legg til
              </button>
              <button
                className="bg-[#FFD700] hover:bg-[#ffbb00] text-black px-4 py-2 rounded-lg font-semibold w-1/2 ml-2"
                onClick={() => setIsModalOpen(false)}
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto text-center py-6 text-[#888] bg-[#1A1A1A] border-t border-[#333]">
        <p>&copy; 2025 galleri edwin – Adminpanel</p>
      </footer>
    </div>
  );
};

export default AdminProducts;
