import React from "react";

const Artwork = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#111] text-white">
            {/* NAVIGATION */}
            <header className="flex flex-col items-center py-6 bg-black text-white border-b border-gray-700">
                <h1 className="text-4xl font-light">galleri edwin</h1>
                <p className="text-sm text-gray-400 mt-2">Discover the exceptional living with art</p>
                <nav className="flex space-x-6 mt-6">
                    <a href="/" className="text-gray-400 hover:text-white">Home</a>
                    <a href="/shop" className="text-gray-400 hover:text-white">Shop</a>
                    <a href="/artists" className="text-gray-400 hover:text-white">Artist</a>
                    <a href="/gallery" className="text-gray-400 hover:text-white">Gallery</a>
                    <a href="/contact" className="text-gray-400 hover:text-white">Contact</a>
                    <a href="/viamilano" className="text-gray-400 hover:text-white">Viamilano</a>
                </nav>
            </header>

            {/* SEARCH AND FILTER SECTION */}
            <div className="flex justify-between items-center p-6 bg-[#111] text-white">
                <input
                    type="text"
                    placeholder="Search artists..."
                    className="p-2 rounded-lg bg-[#2A2A2A] text-white placeholder-gray-400 focus:outline-none"
                />
                <select
                    className="p-2 rounded-lg bg-[#2A2A2A] text-white focus:outline-none"
                >
                    <option value="all">All Categories</option>
                    <option value="Paintings">Paintings</option>
                    <option value="Sculptures">Sculptures</option>
                    <option value="Photography">Photography</option>
                    <option value="Digital Art">Digital Art</option>
                </select>
            </div>

            {/* ARTISTS SECTION */}
            <main className="p-6 bg-[#1A1A1A]">
                <section className="text-center py-12">
                    <h1 className="text-3xl font-bold text-[#FFD700] mb-8">Meet Our Artists</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-screen-xl mx-auto">
                        {/* Artist Card */}
                        <a href="/artist1" className="group relative block bg-[#2A2A2A] rounded-lg overflow-hidden transition-transform hover:scale-105">
                            <img
                                src="/Images/Axel.jpg"
                                alt="Axel Tostrup Evensen"
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111] p-4">
                                <h2 className="text-lg font-bold text-white">Axel Tostrup Evensen</h2>
                                <div className="text-sm text-gray-300">
                                    <p>Paintings</p>
                                    <p>Sculptures</p>
                                </div>
                            </div>
                        </a>

                        {/* Another Artist Card */}
                        <a href="/artist2" className="group relative block bg-[#2A2A2A] rounded-lg overflow-hidden transition-transform hover:scale-105">
                            <img
                                src="/Images/artist2.jpg"
                                alt="Another Artist"
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#111] p-4">
                                <h2 className="text-lg font-bold text-white">Another Artist</h2>
                                <div className="text-sm text-gray-300">
                                    <p>Photography</p>
                                    <p>Digital Art</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="mt-auto text-center py-8 text-gray-500 bg-black border-t border-gray-700">
                <p>&copy; 2025 Galleri Edwin. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Artwork;