import React, { useEffect, useState } from "react";

const AdminArtists = () => {
    const [artists, setArtists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newArtist, setNewArtist] = useState({ name: "", bio: "", imageUrl: "" });
    const [selectedArtist, setSelectedArtist] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/artists")
            .then((res) => res.json())
            .then((data) => setArtists(data))
            .catch((error) => console.error("Error fetching artists:", error));
    }, []);

    const handleChange = (e) => {
        setNewArtist({ ...newArtist, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/artists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newArtist),
            });

            if (response.ok) {
                const createdArtist = await response.json();
                setArtists([...artists, createdArtist]);
                setIsModalOpen(false);
                setNewArtist({ name: "", bio: "", imageUrl: "" });
            }
        } catch (error) {
            console.error("Error creating artist:", error);
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
                    <li className="relative group"><a href="/admin" className="text-[#F5F5F5] hover:text-[#FFD700]">Home</a></li>
                    <li className="relative group"><a href="/admin/order-history" className="text-[#F5F5F5] hover:text-[#FFD700]">Orders</a></li>
                    <li className="relative group"><a href="/admin/products" className="text-[#F5F5F5] hover:text-[#FFD700]">Products</a></li>
                    <li className="relative group"><a href="/admin/artists" className="text-[#FFD700]">Artists</a></li>
                    <li className="relative group"><a href="#" className="text-[#F5F5F5] hover:text-[#FFD700]">Log Out</a></li>
                </ul>
            </nav>

            {/* HEADER */}
            <header className="bg-gradient-to-r from-[#444] to-[#2F2F2F] text-center py-10 shadow-lg">
                <h1 className="text-4xl font-bold text-white">Kunstnere</h1>
                <p className="text-gray-300 mt-2">Administrer, opprett og rediger kunstnere i galleriet</p>
            </header>

            {/* CREATE BUTTON */}
            <section className="mt-6 max-w-6xl mx-auto w-full px-4">
                <div className="flex justify-end">
                    <button
                        className="cursor-pointer bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create New
                    </button>
                </div>
            </section>

            {/* ARTIST CARDS */}
            <section className="mt-8 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-start">
                    {artists.map((artist) => (
                        <div
                            key={artist._id}
                            onClick={() => setSelectedArtist(artist)}
                            className="cursor-pointer bg-[#2A2A2A] p-4 rounded-lg shadow-lg border-2 border-transparent hover:border-[#FFD700] transition-all duration-300 transform hover:-translate-y-2 w-full min-w-[240px]">
                            <img src={artist.imageUrl} alt={artist.name} className="w-full h-40 object-cover rounded" />
                            <h3 className="mt-4 text-lg font-bold text-[#FFD700]">{artist.name}</h3>
                            <p className="text-sm text-gray-400 mt-1">{artist.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CREATE ARTIST MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-96 relative">
                        <button className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl" onClick={() => setIsModalOpen(false)}>&times;</button>
                        <h2 className="text-2xl font-semibold text-white mb-4 text-center">Legg til ny kunstner</h2>
                        <label className="block text-[#F5F5F5] mb-1">Navn</label>
                        <input type="text" name="name" className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600" value={newArtist.name} onChange={handleChange} />
                        <label className="block text-[#F5F5F5] mb-1">Bio</label>
                        <input type="text" name="bio" className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600" value={newArtist.bio} onChange={handleChange} />
                        <label className="block text-[#F5F5F5] mb-1">Bilde-URL</label>
                        <input type="text" name="imageUrl" className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600" value={newArtist.imageUrl} onChange={handleChange} />
                        <div className="flex justify-between mt-4">
                            <button className="cursor-pointer bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold w-1/2 mr-2" onClick={handleSubmit}>Legg til</button>
                            <button className="cursor-pointer bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold w-1/2 ml-2" onClick={() => setIsModalOpen(false)}>Avbryt</button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT ARTIST MODAL */}
            {selectedArtist && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-[400px] relative">
                        <button className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl" onClick={() => setSelectedArtist(null)}>&times;</button>
                        <h2 className="text-2xl font-semibold text-white mb-4 text-center">Rediger kunstner</h2>
                        <label className="block text-[#F5F5F5] mb-1">Navn</label>
                        <input type="text" name="name" value={selectedArtist.name} onChange={(e) => setSelectedArtist({ ...selectedArtist, name: e.target.value })} className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600" />
                        <label className="block text-[#F5F5F5] mb-1">Bio</label>
                        <textarea name="bio" value={selectedArtist.bio} onChange={(e) => setSelectedArtist({ ...selectedArtist, bio: e.target.value })} rows={3} className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600" />
                        <label className="block text-[#F5F5F5] mb-1">Bilde-URL</label>
                        <input type="text" name="imageUrl" value={selectedArtist.imageUrl} onChange={(e) => setSelectedArtist({ ...selectedArtist, imageUrl: e.target.value })} className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600" />
                        <img src={selectedArtist.imageUrl} alt="Preview" className="w-full h-40 object-cover rounded mb-4" />
                        <div className="flex justify-between mt-4">
                            <button className="cursor-pointer bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold w-1/2 mr-2"
                                onClick={async () => {
                                    try {
                                        const res = await fetch(`http://localhost:5000/api/artists/${selectedArtist._id}`, {
                                            method: "PUT",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(selectedArtist),
                                        });
                                        if (res.ok) {
                                            const updated = await res.json();
                                            setArtists((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
                                            setSelectedArtist(null);
                                        }
                                    } catch (err) {
                                        console.error("Error updating artist:", err);
                                    }
                                }}
                            >Lagre</button>
                            <button className="cursor-pointer bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold w-1/2 ml-2" onClick={() => setSelectedArtist(null)}>Avbryt</button>
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                                onClick={async () => {
                                    const confirmed = confirm("Er du sikker på at du vil slette denne kunstneren?");
                                    if (!confirmed) return;
                                    try {
                                        const res = await fetch(`http://localhost:5000/api/artists/${selectedArtist._id}`, {
                                            method: "DELETE",
                                        });
                                        if (res.ok) {
                                            setArtists((prev) => prev.filter((a) => a._id !== selectedArtist._id));
                                            setSelectedArtist(null);
                                        }
                                    } catch (err) {
                                        console.error("Error deleting artist:", err);
                                    }
                                }}
                            >
                                Slett kunstner
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

export default AdminArtists;