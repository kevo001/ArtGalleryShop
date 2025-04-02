import React, { useState } from "react";

const Shop = () => {
    const [selectedArt, setSelectedArt] = useState(null);

    // Artworks array
    const artworks = [
        { src: "/images/Shop1.jpeg", title: "Som vann og luft II", price: "8000,00", size: "30x30 cm (Small)" },
        { src: "/images/Shop2.jpeg", title: "Skygge", price: "7500,00", size: "40x40 cm (Medium)" },
        { src: "/images/Shop3.jpeg", title: "Vertikal flyt", price: "8500,00", size: "50x50 cm (Large)" },
        { src: "/images/Shop4.jpg", title: "Mellom Brun og Ross 1", price: "9000,00", size: "60x60 cm (Large)" },
        { src: "/images/Shop4.jpg", title: "Mellom Brun og Ross 1", price: "9000,00", size: "60x60 cm (Large)" },
        { src: "/images/Shop4.jpg", title: "Mellom Brun og Ross 1", price: "9000,00", size: "60x60 cm (Large)" },
        { src: "/images/Shop4.jpg", title: "Mellom Brun og Ross 1", price: "9000,00", size: "60x60 cm (Large)" }
    ];

    // Open modal function
    const openModal = (art) => {
        console.log("Opening modal for:", art.title);
        setSelectedArt(art);
    };

    // Close modal function
    const closeModal = () => {
        console.log("Closing modal");
        setSelectedArt(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* NAVIGATION */}
            <header className="flex flex-col items-center py-6 bg-black text-white border-b border-gray-700">
                <h1 className="text-4xl font-light">galleri edwin</h1>
                <p className="text-sm text-gray-400 mt-2">Discover the exceptional living with art</p>
                <nav className="flex space-x-6 mt-6">
                    <a href="/home" className="text-gray-400 hover:text-white">Home</a>
                    <a href="/shop" className="text-white border-b-2 border-white pb-1">Shop</a>
                    <a href="/artists" className="text-gray-400 hover:text-white">Artist</a>
                    <a href="/gallery" className="text-gray-400 hover:text-white">Gallery</a>
                    <a href="/contact" className="text-gray-400 hover:text-white">Contact</a>
                    <a href="/viamilano" className="text-gray-400 hover:text-white">Viamilano</a>
                </nav>
            </header>

            {/* ARTWORK SECTION */}
            <section className="mt-16 px-6 text-center">
                <h2 className="text-3xl font-bold">Explore Our Collection</h2>
                <p className="text-gray-400 mt-4">
                    Immerse yourself in a curated selection of paintings and sculptures.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {artworks.map((art, index) => (
                        <div
                            key={index}
                            className="bg-[#2A2A2A] p-4 rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => openModal(art)}
                        >
                            <img src={art.src} alt={art.title} className="w-full h-auto rounded-lg"/>
                            <p className="text-white mt-2">{art.title}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal Popup */}
            {selectedArt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={closeModal}>
                    <div
                        className="bg-[#333] p-6 rounded-lg max-w-lg w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="absolute top-2 right-2 text-white text-2xl cursor-pointer" onClick={closeModal}>&times;</span>
                        <img src={selectedArt.src} alt={selectedArt.title} className="w-full h-auto rounded-lg mb-4" />
                        <div className="text-white">
                            <h1 className="text-2xl font-bold">{selectedArt.title}</h1>
                            <p className="mt-2">Unique work.<br/>Acrylic on canvas.</p>
                            <p className="mt-2"><strong>kr {selectedArt.price}</strong></p>
                            <hr className="my-4 border-gray-500"/>
                            <p><strong>Dimension</strong> <br/> {selectedArt.size}</p>
                            <hr className="my-4 border-gray-500"/>
                            <p><strong>Year</strong> <br/> 2022</p>
                            <div className="mt-4 flex gap-4">
                                <button className="btn bg-[#FFD700] text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition">
                                    Buy now
                                </button>
                                <button className="btn bg-[#FFD700] text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition">
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="mt-auto text-center py-8 text-gray-500 bg-black border-t border-gray-700">
                <p>&copy; 2025 Galleri Edwin. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Shop;