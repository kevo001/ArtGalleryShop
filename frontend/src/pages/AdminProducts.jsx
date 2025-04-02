import React, { useEffect, useState } from "react";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: "", description: "", price: "", imageUrl: "", size: "", category: "", artistId: ""
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/items")
            .then(res => res.json())
            .then(setProducts)
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/artists")
            .then(res => res.json())
            .then(setArtists)
            .catch(err => console.error("Error fetching artists:", err));
    }, []);

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const { title, description, price, imageUrl, size, category, artistId } = newProduct;

        if (!title || !description || !price || !imageUrl || !size || !category || !artistId) {
            alert("Alle felt må fylles ut.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                const res = await fetch("http://localhost:5000/api/items");
                const updatedProducts = await res.json();
                setProducts(updatedProducts);
                setIsModalOpen(false);
                setNewProduct({ title: "", description: "", price: "", imageUrl: "", size: "", category: "", artistId: "" });
            }
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Er du sikker på at du vil slette dette produktet?");
        if (!confirmed) return;

        try {
            const res = await fetch(`http://localhost:5000/api/items/${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
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
                    <li><a href="/admin" className="text-[#F5F5F5] hover:text-[#FFD700]">Home</a></li>
                    <li><a href="/admin/order-history" className="text-[#F5F5F5] hover:text-[#FFD700]">Orders</a></li>
                    <li><a href="/admin/products" className="text-[#FFD700]">Products</a></li>
                    <li><a href="/admin/artists" className="text-[#F5F5F5] hover:text-[#FFD700]">Artists</a></li>
                    <li><a href="#" className="text-[#F5F5F5] hover:text-[#FFD700]">Log Out</a></li>
                </ul>
            </nav>

            {/* HEADER */}
            <header className="bg-gradient-to-r from-[#444] to-[#2F2F2F] text-center py-10 shadow-lg">
                <h1 className="text-4xl font-bold text-white">Produkter</h1>
                <p className="text-gray-300 mt-2">Administrer, opprett og rediger produktene i galleriet</p>
            </header>

            {/* PRODUCT LIST */}
            <section className="mt-8 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            onClick={() => setSelectedProduct(product)}
                            className="cursor-pointer w-[230px] rounded-2xl bg-[#2A2A2A] overflow-hidden shadow-md border-2 border-[#333] hover:border-[#FFD700] transition-transform"
                        >
                            <div className="h-[160px] bg-[#3A3A3A] flex items-center justify-center px-4">
                                <p className="text-sm text-gray-500">Bilde kommer</p>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-[#FFD700] mb-1">{product.title}</h3>
                                <p className="text-sm text-gray-300">{product.price} kr</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* DETAIL MODAL */}
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
                        <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-full h-40 object-cover rounded mb-4" />
                        <div className="space-y-1 text-sm text-gray-300">
                            <p><span className="font-semibold text-white">Pris:</span> {selectedProduct.price} kr</p>
                            <p><span className="font-semibold text-white">Beskrivelse:</span> {selectedProduct.description}</p>
                            <p><span className="font-semibold text-white">Størrelse:</span> {selectedProduct.size}</p>
                            <p><span className="font-semibold text-white">Kategori:</span> {selectedProduct.category}</p>
                            <p><span className="font-semibold text-white">Kunstner:</span> {selectedProduct.artist?.name}</p>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                                onClick={() => handleDelete(selectedProduct._id)}
                            >
                                Slett
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
