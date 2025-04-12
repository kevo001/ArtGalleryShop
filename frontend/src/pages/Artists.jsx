import React, { useState } from "react";

const Artists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const artists = [
    {
      name: "Axel Tostrup Evensen",
      image: "/images/Axel.jpg",
      categories: ["Paintings", "Sculptures"],
      link: "/Artist1.html",
    },
    {
      name: "Another Artist",
      image: "/images/artist2.jpg",
      categories: ["Photography", "Digital Art"],
      link: "/another-artist.html",
    },
  ];

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || artist.categories.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* NAVIGATION (can extract if reused) */}
      <header className="flex flex-col items-center py-6 border-b border-gray-700">
        <h1 className="text-4xl font-light">galleri edwin</h1>
        <p className="text-sm text-gray-400 mt-2">Discover the exceptional living with art</p>
        <nav className="flex space-x-6 mt-6">
          <a href="/home" className="text-gray-400 hover:text-white">Home</a>
          <a href="/shop" className="text-gray-400 hover:text-white">Shop</a>
          <a href="/artists" className="text-white border-b-2 border-white pb-1">Artists</a>
          <a href="/gallery" className="text-gray-400 hover:text-white">Gallery</a>
          <a href="/contact" className="text-gray-400 hover:text-white">Contact</a>
          <a href="/viamilano" className="text-gray-400 hover:text-white">Viamilano</a>
        </nav>
      </header>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 px-6 py-10 bg-[#1A1A1A]">
        <input
          type="text"
          placeholder="Search artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 w-72 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          <option value="all">All Categories</option>
          <option value="Paintings">Paintings</option>
          <option value="Sculptures">Sculptures</option>
          <option value="Photography">Photography</option>
          <option value="Digital Art">Digital Art</option>
        </select>
      </div>

      {/* ARTISTS GRID */}
      <main className="px-6 py-10">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Artists</h2>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredArtists.length > 0 ? (
            filteredArtists.map((artist, idx) => (
              <a
                key={idx}
                href={artist.link}
                className="bg-[#1F1F1F] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img src={artist.image} alt={artist.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{artist.name}</h3>
                  <div className="mt-2 text-sm text-gray-400 space-x-2">
                    {artist.categories.map((cat, i) => (
                      <span key={i} className="inline-block bg-gray-700 px-2 py-1 rounded-full">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-400">No artists found.</p>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto text-center py-8 text-gray-500 bg-black border-t border-gray-700">
        <p>&copy; 2025 Galleri Edwin. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Artists;
