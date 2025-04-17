import React, { useEffect, useState } from "react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [artists, setArtists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [formDataState, setFormDataState] = useState({
    title: "",
    description: "",
    price: "",
    size: "",
    year: "",
    dimension: "",
    category: "",
    artistId: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchArtists();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/items");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchArtists = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/artists");
      const data = await res.json();
      setArtists(data);
    } catch (err) {
      console.error("Error fetching artists:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormDataState({ title: "", description: "", price: "", size: "", year: "", dimension: "", category: "", artistId: "" });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setSelectedProduct(product);
    setFormDataState({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      size: product.size || "",
      year: product.year || "",
      dimension: product.dimension || "",
      category: product.category || "",
      artistId: product.artist?._id || "",
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormDataState({ ...formDataState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { title, description, price, size, year, dimension, category, artistId } = formDataState;
    if (!title || !description || !price || !size || !year || !dimension || !category || !artistId) {
      alert("Alle felt må fylles ut, inkludert bilde hvis nytt.");
      return;
    }
    try {
      const formPayload = new FormData();
      Object.entries({ title, description, price, size, year, dimension, category, artistId }).forEach(([key, value]) => {
        formPayload.append(key, value);
      });
      if (selectedFile) formPayload.append("image", selectedFile);

      const url = isEditMode
        ? `http://localhost:5000/api/items/${selectedProduct._id}`
        : "http://localhost:5000/api/items";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formPayload });
      if (res.ok) {
        await fetchItems();
        setIsModalOpen(false);
        setSelectedProduct(null);
      } else {
        console.error("Error:", await res.json());
        alert("Noe gikk galt under lagring.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    if (!window.confirm("Er du sikker på at du vil slette dette produktet?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/items/${selectedProduct._id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== selectedProduct._id));
        setSelectedProduct(null);
      } else {
        alert("Feil ved sletting.");
      }
    } catch (err) {
      console.error(err);
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
        await fetchCategories();
        setNewCategoryName("");
        setIsCategoryModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
      <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#282828] to-[#3E3E3E] drop-shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">galleri edwin</h1>
          <p className="text-sm text-[#CCCCCC]">Discover the exceptional living with art</p>
        </div>
        <ul className="flex space-x-6">
          <li><a href="/admin" className="hover:text-[#FFD700]">Home</a></li>
          <li><a href="/admin/order-history" className="hover:text-[#FFD700]">Orders</a></li>
          <li><a href="/admin/products" className="text-[#FFD700]">Products</a></li>
          <li><a href="/admin/artists" className="hover:text-[#FFD700]">Artists</a></li>
          <li><a href="#" className="hover:text-[#FFD700]">Log Out</a></li>
        </ul>
      </nav>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-80 relative">
            <button className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl" onClick={() => setIsCategoryModalOpen(false)}>&times;</button>
            <h2 className="text-xl font-semibold text-white mb-4 text-center">Ny kategori</h2>
            <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Kategorinavn" className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none" />
            <button onClick={handleCreateCategory} className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold w-full hover:bg-[#ffbb00]">Opprett</button>
          </div>
        </div>
      )}

      <section className="mt-8 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <select className="bg-[#2A2A2A] text-white px-3 py-2 rounded-lg border border-[#444] cursor-pointer hover:border-[#FFD700] transition" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)}>
              <option value="">Alle kategorier</option>
              {categories.map((cat) => (<option key={cat._id} value={cat.name}>{cat.name}</option>))}
            </select>
            <button onClick={() => setIsCategoryModalOpen(true)} className="bg-[#2A2A2A] text-white px-3 py-2 rounded-lg border border-[#444] hover:border-[#FFD700] transition">+</button>
          </div>
          <button onClick={openCreateModal} className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold">Legg til nytt produkt</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.filter((p) => !activeCategory || p.category === activeCategory).map((product) => (
            <div key={product._id} onClick={() => setSelectedProduct(product)} className="cursor-pointer rounded-2xl bg-[#2A2A2A] overflow-hidden shadow-md border-2 border-[#2A2A2A] hover:border-[#FFD700] transition">
              <div className="h-40 flex items-center justify-center overflow-hidden p-2 bg-[#2A2A2A]">
                {product.imageUrl ? (<img src={`http://localhost:5000${product.imageUrl}`} alt={product.title} className="h-full w-full object-cover"/>) : (<p className="text-sm text-gray-500">Bilde kommer</p>)}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#FFD700]">{product.title}</h3>
                <p className="text-sm text-gray-300">{product.price} kr</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedProduct && !isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-[400px] relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl" onClick={() => setSelectedProduct(null)}>&times;</button>
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">{selectedProduct.title}</h2>
            {selectedProduct.imageUrl && (<div className="mb-4"><img src={`http://localhost:5000${selectedProduct.imageUrl}`} alt={selectedProduct.title} className="w-full max-h-[300px] object-contain rounded"/></div>)}
            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Dimension:</span> {selectedProduct.dimension}</p>
            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Pris:</span> {selectedProduct.price} kr</p>
            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Beskrivelse:</span> {selectedProduct.description}</p>
            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Størrelse:</span> {selectedProduct.size}</p>
            {selectedProduct.year && (<p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">År:</span> {selectedProduct.year}</p>)}
            <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-white">Kategori:</span> {selectedProduct.category}</p>
            {selectedProduct.artist?.name && (<p className="text-sm text-gray-300 mb-3"><span className="font-semibold text-white">Kunstner:</span> {selectedProduct.artist.name}</p>)}
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => openEditModal(selectedProduct)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">Rediger</button>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold">Slett</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl" onClick={() => { setIsModalOpen(false); setSelectedProduct(null); }}>&times;</button>
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">{isEditMode ? "Rediger produkt" : "Legg til nytt produkt"}</h2>
            {['title','description','price','year','dimension'].map(field => (
              <React.Fragment key={field}>
                <label className="block text-[#F5F5F5] mb-1 capitalize">{field}</label>
                <input type={field==='price'||field==='year' ? 'number':'text'} name={field} value={formDataState[field]} onChange={handleChange} className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"/>
              </React.Fragment>
            ))}
            <label className="block text-[#F5F5F5] mb-1">Størrelse</label>
            <select name="size" value={formDataState.size} onChange={handleChange} className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600">
              <option value="">Velg størrelse</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
            <label className="block text-[#F5F5F5] mb-1">Bilde</label>
            <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files[0])} className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600"/>
            {selectedFile && <div className="mb-4"><img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full max-h-[200px] object-contain rounded"/></div>}
            <label className="block text-[#F5F5F5] mb-1">Kategori</label>
            <select name="category" value={formDataState.category} onChange={handleChange} className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600">
              <option value="">Velg en kategori</option>
              {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
            </select>
            <label className="block text-[#F5F5F5] mb-1">Kunstner</label>
            <select name="artistId" value={formDataState.artistId} onChange={handleChange} className="w-full p-2 mb-6 bg-[#1A1A1A] text-white rounded border border-gray-600">
              <option value="">Velg en kunstner</option>
              {artists.map(art => <option key={art._id} value={art._id}>{art.name}</option>)}
            </select>
            <div className="flex justify-between">
              <button onClick={handleSubmit} className="px-4 py-2 bg-[#FFD700] text-black rounded-lg">{isEditMode ? "Lagre endringer" : "Legg til"}</button>
              <button onClick={() => { setIsModalOpen(false); setSelectedProduct(null); }} className="px-4 py-2 bg-[#FFD700] text-black rounded-lg">Avbryt</button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto py-6 text-center text-[#888] border-t border-[#333] bg-[#1A1A1A]">
        <p>&copy; 2025 galleri edwin – Adminpanel</p>
      </footer>
    </div>
  );
};

export default AdminProducts;
