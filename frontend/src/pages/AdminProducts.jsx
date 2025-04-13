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
    const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState('');

    const [newProduct, setNewProduct] = useState({
        title: "", description: "", price: "", imageUrl: "", size: "", category: "", artistId: ""
    });

    // Fetch products on mount
    useEffect(() => {
        fetch("http://localhost:5000/api/items")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    // Fetch artists for dropdown
    useEffect(() => {
        fetch("http://localhost:5000/api/artists")
            .then(res => res.json())
            .then(data => setArtists(data))
            .catch(err => console.error("Error fetching artists:", err));
    }, []);

    // Fetch categories for dropdown and filtering
    useEffect(() => {
        fetch("http://localhost:5000/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

    // Handle form input change
    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    // Handle product creation
    const handleSubmit = async () => {
        const { title, description, price, imageUrl, size, category, artistId } = newProduct;
        if (!title || !description || !price || !imageUrl || !size || !category || !artistId) {
            alert("Alle felt må fylles ut.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (res.ok) {
                const updated = await fetch("http://localhost:5000/api/items");
                const data = await updated.json();
                setProducts(data);
                setIsModalOpen(false);
                setNewProduct({ title: "", description: "", price: "", imageUrl: "", size: "", category: "", artistId: "" });
            }
        } catch (err) {
            console.error("Error creating product:", err);
        }
    };

    // Handle category creation
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

    // Handle product deletion
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

    // Handle category deletion
    const handleDeleteCategory = async () => {
        if (!selectedCategoryToDelete) return;

        const confirmDelete = window.confirm("Er du sikker på at du vil slette denne kategorien?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:5000/api/categories/${selectedCategoryToDelete}`, {
                method: "DELETE",
            });

            if (res.ok) {
                // Refresh category list
                const updated = await fetch("http://localhost:5000/api/categories");
                const data = await updated.json();
                setCategories(data);

                // Clear and close modal
                setSelectedCategoryToDelete("");
                setIsDeleteCategoryModalOpen(false);
            } else {
                alert("Noe gikk galt under sletting av kategorien.");
            }
        } catch (err) {
            console.error("Feil ved sletting av kategori:", err);
        }
    };

    // Handle product update
const handleUpdateProduct = async () => {
    const { title, description, price, imageUrl, size, category, artistId, ...rest } = newProduct;

    if (!title || !description || !price || !imageUrl || !size || !category || !artistId) {
        alert("Alle felt må fylles ut.");
        return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/items/${selectedProduct._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...rest,
                title,
                description,
                price,
                imageUrl,
                size,
                category,
                artist: artistId, // ✅ Correctly assign artistId to the backend 'artist' field
            }),
        });

        if (res.ok) {
            const updated = await fetch("http://localhost:5000/api/items");
            const data = await updated.json();
            setProducts(data);

            // ✅ Clear modal and selection
            setIsModalOpen(false);
            setSelectedProduct(null);
            setNewProduct({
                title: "",
                description: "",
                price: "",
                imageUrl: "",
                size: "",
                category: "",
                artistId: ""
            });
        } else {
            alert("Noe gikk galt under oppdatering av produktet.");
        }
    } catch (err) {
        console.error("Feil ved oppdatering:", err);
    }
};


    return (
        <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
            {/* NAVIGATION */}
            <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#282828] to-[#3E3E3E] drop-shadow-lg">
                {/* Logo Section */}
                <div>
                    <h1 className="text-2xl font-bold text-[#F5F5F5]">galleri edwin</h1>
                    <p className="text-[#CCCCCC] text-sm">Discover the exceptional living with art</p>
                </div>

                {/* Navigation Links */}
                <ul className="flex space-x-6">
                    <li className="relative group">
                        <a href="/admin" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
                            Home
                            <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>
                    <li className="relative group">
                        <a href="/admin/order-history" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
                            Orders
                            <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>
                    <li className="relative group">
                        <a href="/admin/products" className="text-[#FFD700] hover:text-[#FFD700] transition duration-300">
                            Products
                            <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>
                    <li className="relative group">
                        <a href="/admin/artists" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
                            Artists
                            <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>
                    <li className="relative group">
                        <a href="#" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
                            Log Out
                            <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>
                </ul>
            </nav>

            {/* HEADER */}
            <header className="bg-gradient-to-r from-[#444] to-[#2F2F2F] text-center py-10 shadow-lg">
                <h1 className="text-4xl font-bold">Produkter</h1>
                <p className="text-gray-300 mt-2">Administrer, opprett og rediger produktene i galleriet</p>
            </header>



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
                        <div className="flex justify-between">
                            <button
                                className="cursor-pointer bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold w-full hover:bg-[#ffbb00]"
                                onClick={handleCreateCategory}
                            >
                                Opprett
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <section className="mt-8 max-w-7xl mx-auto px-4 pb-4">
                {/* FILTERS & CREATE */}
                <section className="mb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <select
                                className="bg-[#2A2A2A] text-white px-3 py-2 h-[40px] rounded-lg border border-[#444] cursor-pointer hover:border-[#FFD700] transition duration-300"
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
                                className="bg-[#2A2A2A] text-white w-[40px] h-[40px] text-lg flex items-center justify-center rounded-lg border border-[#444] cursor-pointer hover:border-[#FFD700] transition duration-300"
                                title="Ny kategori"
                            >
                                +
                            </button>
                            <button
                                onClick={() => setIsDeleteCategoryModalOpen(true)}
                                className="bg-[#2A2A2A] text-white w-[40px] h-[40px] text-lg flex items-center justify-center rounded-lg border border-[#444] cursor-pointer hover:border-[#FFD700] transition duration-300"
                                title="Slett kategori"
                            >
                                -
                            </button>

                        </div>
                        <div className="flex space-x-4">

                            <button
                                className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold cursor-pointer"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Create New
                            </button>
                        </div>
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
                                className="cursor-pointer w-[230px] rounded-2xl bg-[#2A2A2A] overflow-hidden shadow-md border-2 border-[#2A2A2A] hover:border-[#FFD700] transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="bg-[#2A2A2A] flex items-center justify-center overflow-hidden">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-[250px] h-[250px] object-cover rounded px-2 py-2"
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

            {/* DELETE CATEGORY MODAL */}
            {isDeleteCategoryModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-80 relative">
                        <button
                            className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
                            onClick={() => setIsDeleteCategoryModalOpen(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold text-white mb-4 text-center">Slett kategori</h2>
                        <select
                            className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
                            value={selectedCategoryToDelete}
                            onChange={(e) => setSelectedCategoryToDelete(e.target.value)}
                        >
                            <option value="">Velg kategori</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        <div className="flex justify-between">
                            <button
                                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold w-full disabled:opacity-50"
                                onClick={handleDeleteCategory}
                                disabled={!selectedCategoryToDelete}
                            >
                                Slett
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                    src={selectedProduct.imageUrl}
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
                                onClick={() => {
                                    setNewProduct({
                                        title: selectedProduct.title,
                                        description: selectedProduct.description,
                                        price: selectedProduct.price,
                                        imageUrl: selectedProduct.imageUrl,
                                        size: selectedProduct.size,
                                        category: selectedProduct.category,
                                        artistId:
                                            typeof selectedProduct.artist === "string"
                                                ? selectedProduct.artist
                                                : selectedProduct.artist?._id || selectedProduct.artistId || "",
                                    });
                                    setIsModalOpen(true);
                                }}
                                className="bg-[#FFD700] hover:bg-[#ffbb00] text-black px-4 py-2 rounded-lg font-semibold cursor-pointer mr-2"
                            >
                                Rediger
                            </button>

                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
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

                        {/* FORM FIELDS */}
                        {["title", "description", "price", "imageUrl", "size"].map((field) => (
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

                        {/* CATEGORY DROPDOWN */}
                        <label className="block text-[#F5F5F5] mb-1">Kategori</label>
                        <select
                            name="category"
                            className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none cursor-pointer"
                            value={newProduct.category}
                            onChange={handleChange}
                        >
                            <option value="">Velg en kategori</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                        {/* ARTIST DROPDOWN */}
                        <label className="block text-[#F5F5F5] mb-1">Kunstner</label>
                        <select
                            name="artistId"
                            className="w-full p-2 mb-4 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none cursor-pointer"
                            value={newProduct.artistId}
                            onChange={handleChange}
                        >
                            <option value="">Velg en kunstner</option>
                            {artists.map((artist) => (
                                <option key={artist._id} value={artist._id}>{artist.name}</option>
                            ))}
                        </select>

                        {/* BUTTONS */}
                        <div className="flex justify-between mt-6">
                            <button
                                className="bg-[#FFD700] hover:bg-[#ffbb00] text-black px-4 py-2 rounded-lg font-semibold w-1/2 mr-2 cursor-pointer"
                                onClick={selectedProduct ? handleUpdateProduct : handleSubmit}
                            >
                                Legg til
                            </button>
                            <button
                                className="bg-[#FFD700] hover:bg-[#ffbb00] text-black px-4 py-2 rounded-lg font-semibold w-1/2 ml-2 cursor-pointer"
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