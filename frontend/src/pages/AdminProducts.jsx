import React, { useEffect, useState } from "react";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "", imageUrl: "" });

    useEffect(() => {
        // Fetch products
        fetch("http://localhost:5000/api/items")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                const createdProduct = await response.json();
                setProducts([...products, createdProduct]); // Update UI
                setIsModalOpen(false); // Close modal
                setNewProduct({ title: "", description: "", price: "", imageUrl: "" }); // Reset form
            }
        } catch (error) {
            console.error("Error creating product:", error);
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
                        <a href="#" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
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
                        <a href="#" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
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
                <h1 className="text-4xl font-bold text-white">Produkter</h1>
                <p className="text-gray-300 mt-2">Administrer, opprett og rediger produktene i galleriet</p>
            </header>

            {/* FILTERS & ACTION BUTTONS */}
            <section className="mt-6 max-w-6xl mx-auto w-full px-4">
                <div className="flex justify-between items-center">
                    <div className="space-x-6">
                        <button className="text-[#FFD700] hover:underline">Malerier</button>
                        <button className="text-[#FFD700] hover:underline">Skulpturer</button>
                        <button className="text-[#FFD700] hover:underline">Fotografi</button>
                    </div>
                    <div className="flex space-x-4">
                        <select className="bg-[#2A2A2A] text-white px-3 py-2 rounded-lg">
                            <option>Sorter: Nyeste</option>
                            <option>Sorter: Eldste</option>
                        </select>
                        <button
                            className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Create New
                        </button>
                    </div>
                </div>
            </section>

            {/* PRODUCT LIST */}
            <section className="mt-8 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 justify-start">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-[#2A2A2A] p-4 rounded-lg shadow-lg border-2 border-transparent hover:border-[#FFD700] transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <img src={product.imageUrl} alt={product.title} className="w-full h-40 object-cover rounded" />
                            <h3 className="mt-4 text-lg font-bold text-[#FFD700]">{product.title}</h3>
                            <p className="text-sm text-gray-400">{product.description}</p>
                            <p className="text-sm text-gray-400">{product.price} kr</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CREATE NEW PRODUCT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-96 relative">
                        {/* Close button (X) */}
                        <button
                            className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl"
                            onClick={() => setIsModalOpen(false)}
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                            Legg til nytt produkt
                        </h2>

                        {/* Input fields */}
                        <label className="block text-[#F5F5F5] mb-1">Tittel</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Skriv inn tittel"
                            className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
                            value={newProduct.title}
                            onChange={handleChange}
                        />

                        <label className="block text-[#F5F5F5] mb-1">Beskrivelse</label>
                        <input
                            type="text"
                            name="description"
                            placeholder="Skriv inn beskrivelse"
                            className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
                            value={newProduct.description}
                            onChange={handleChange}
                        />

                        <label className="block text-[#F5F5F5] mb-1">Pris (kr)</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Skriv inn pris"
                            className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
                            value={newProduct.price}
                            onChange={handleChange}
                        />

                        <label className="block text-[#F5F5F5] mb-1">Bilde-URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            placeholder="Lim inn bilde-URL"
                            className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
                            value={newProduct.imageUrl}
                            onChange={handleChange}
                        />

                        {/* Buttons */}
                        <div className="flex justify-between mt-4">
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