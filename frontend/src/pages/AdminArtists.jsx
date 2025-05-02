import React, { useEffect, useState } from "react";
import API_BASE_URL from '../apiConfig';

const AdminArtists = () => {
  const [artists, setArtists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArtist, setNewArtist] = useState({ name: "", bio: "", categories: [] });
  const [categoriesList, setCategoriesList] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [editFile, setEditFile] = useState(null);

  // Fetch artists
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/artists`)
      .then(res => res.json())
      .then(data => setArtists(data))
      .catch(err => console.error("Error fetching artists:", err));
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategoriesList(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    setNewArtist({ ...newArtist, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const toggleNewCategory = (catId) => {
    setNewArtist(a => ({
      ...a,
      categories: a.categories.includes(catId)
        ? a.categories.filter(c => c !== catId)
        : [...a.categories, catId]
    }));
  };

  const handleSubmit = async () => {
    if (!newArtist.name || !newArtist.bio || !newFile) {
      return alert('Navn, bio og bilde er påkrevd.');
    }
    const formData = new FormData();
    formData.append('name', newArtist.name);
    formData.append('bio', newArtist.bio);
    formData.append('image', newFile);
    newArtist.categories.forEach(id => formData.append('categories', id));

    try {
      const response = await fetch(`${API_BASE_URL}/api/artists`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const created = await response.json();
        setArtists(prev => [...prev, created]);
        setIsModalOpen(false);
        setNewArtist({ name: "", bio: "", categories: [] });
        setNewFile(null);
      } else {
        console.error('Failed to create artist', response.statusText);
      }
    } catch (err) {
      console.error("Error creating artist:", err);
    }
  };

  const handleEditFileChange = (e) => {
    setEditFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    if (!selectedArtist.name || !selectedArtist.bio) {
      return alert('Navn og bio er påkrevd.');
    }
    const formData = new FormData();
    formData.append('name', selectedArtist.name);
    formData.append('bio', selectedArtist.bio);
    if (editFile) formData.append('image', editFile);
    selectedArtist.categories.forEach(id => formData.append('categories', id));

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/artists/${selectedArtist._id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );
      if (res.ok) {
        const updated = await res.json();
        setArtists(prev => prev.map(a => (a._id === updated._id ? updated : a)));
        setSelectedArtist(null);
        setEditFile(null);
      } else {
        console.error('Failed to update artist', res.statusText);
      }
    } catch (err) {
      console.error('Error updating artist:', err);
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
          <li><a href="/admin/products" className="text-[#F5F5F5] hover:text-[#FFD700]">Products</a></li>
          <li><a href="/admin/artists" className="text-[#FFD700]">Artists</a></li>
          <li><a href="#" className="text-[#F5F5F5] hover:text-[#FFD700]">Log Out</a></li>
        </ul>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#444] to-[#2F2F2F] text-center py-10 shadow-lg">
        <h1 className="text-4xl font-bold text-white">Kunstnere</h1>
        <p className="text-gray-300 mt-2">Administrer, opprett og rediger kunstnere i galleriet</p>
      </header>

      {/* ACTION BUTTON */}
      <section className="mt-6 max-w-6xl mx-auto w-full px-4">
        <div className="flex justify-end">
          <button
            className="bg-[#FFD700] text-black px-4 py-2 rounded-lg font-semibold cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Create New
          </button>
        </div>
      </section>

      {/* ARTIST LIST */}
      <section className="mt-8 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map(artist => (
            <div
              key={artist._id}
              onClick={() => setSelectedArtist({
                    ...artist,
                    categories: (artist.categories || []).map(c => (c._id || c))
                  })}
              className="cursor-pointer bg-[#2A2A2A] p-4 rounded-lg shadow-lg border-2 border-transparent hover:border-[#FFD700] transition-all duration-300"
            >
              <img src={artist.imageUrl} alt={artist.name} className="w-full h-40 object-cover rounded" />
              <h3 className="mt-4 text-lg font-bold text-[#FFD700]">{artist.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* CREATE NEW ARTIST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >&times;</button>
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">Legg til ny kunstner</h2>

            <label className="block text-[#F5F5F5] mb-1">Navn</label>
            <input
              type="text"
              name="name"
              placeholder="Skriv inn navn"
              className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
              value={newArtist.name}
              onChange={handleChange}
            />

          <label className="block text-[#F5F5F5] mb-1">Kategorier</label>
         <div className="mb-4 max-h-32 overflow-auto space-y-1">
         {categoriesList.map(cat => (
         <label key={cat._id} className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={newArtist.categories.includes(cat._id)}
           onChange={() => toggleNewCategory(cat._id)}
          />
          {cat.name}
        </label>
      ))}
    </div>
            <label className="block text-[#F5F5F5] mb-1">Bio</label>
            <textarea
              name="bio"
              placeholder="Skriv kort bio"
              className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
              value={newArtist.bio}
              onChange={handleChange}
            />
            <label className="block text-[#F5F5F5] mb-1">Last opp bilde</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full mb-3"
              onChange={handleFileChange}
            />

            <div className="flex justify-between mt-4">
              <button
                className="bg-[#FFD700] hover:bg-[#ffbb00] text-black px-4 py-2 rounded-lg font-semibold w-1/2 mr-2"
                onClick={handleSubmit}
              >Legg til</button>
              <button
                className="bg-[#FFD700] hover:bg-[#ffbb00] text-black px-4 py-2 rounded-lg font-semibold w-1/2 ml-2"
                onClick={() => setIsModalOpen(false)}
              >Avbryt</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ARTIST MODAL */}
      {selectedArtist && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-[400px] relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl cursor-pointer"
              onClick={() => setSelectedArtist(null)}
            >&times;</button>
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">Rediger kunstner</h2>

            <label className="block text-[#F5F5F5] mb-1">Navn</label>
            <input
              type="text"
              name="name"
              value={selectedArtist.name}
              onChange={e => setSelectedArtist({ ...selectedArtist, name: e.target.value })}
              className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
            />
            <label className="block text-[#F5F5F5] mb-1">Bio</label>
            <textarea
              name="bio"
              value={selectedArtist.bio}
              onChange={e => setSelectedArtist({ ...selectedArtist, bio: e.target.value })}
              rows={3}
              className="w-full p-2 mb-3 bg-[#1A1A1A] text-white rounded border border-gray-600 focus:border-[#FFD700] outline-none"
            />
            <label className="block text-[#F5F5F5] mb-1 ">Last opp nytt bilde</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full mb-3"
              onChange={handleEditFileChange}
            />
            {/* after your <input type="file" … /> */}
            <label className="block text-[#F5F5F5] mb-1">Kategorier</label>
            <div className="mb-4 max-h-32 overflow-auto space-y-1 ">
            {categoriesList.map(cat => (
            <label key={cat._id} className="flex items-center">
            <input
            type="checkbox"
            className="mr-2 cursor-pointer"
            checked={(selectedArtist.categories || []).includes(cat._id)}
            onChange={() => {
             const has = (selectedArtist.categories || []).includes(cat._id);
              const list = has
             ? selectedArtist.categories.filter(c => c !== cat._id)
            : [...(selectedArtist.categories || []), cat._id];
              setSelectedArtist({ ...selectedArtist, categories: list });
                 }}
              />
             {cat.name}
            </label>
            ))}
            </div>
            
            {selectedArtist.imageUrl && !editFile && (
              <img src={selectedArtist.imageUrl} alt="Preview" className="w-full h-40 object-cover rounded mb-4" />
            )}
            {editFile && (
              <img src={URL.createObjectURL(editFile)} alt="New preview" className="w-full h-40 object-cover rounded mb-4" />
            )}

            <div className="flex justify-between mt-4">
              <button
                className="bg-[#FFD700] hover:bg-[#ffbb00] text-black px-4 py-2 rounded-lg font-semibold w-1/2 mr-2"
                onClick={handleUpdate}
              >Lagre</button>
              <button
                className="bg-[#FFD700] hover:bg-[#ffbb00] text-black px-4 py-2 rounded-lg font-semibold w-1/2 ml-2"
                onClick={() => setSelectedArtist(null)}
              >Avbryt</button>
            </div>
            <div className="flex justify-center mt-6">
            <button
               className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
               onClick={async () => {
                const confirmed = confirm("Er du sikker på at du vil slette denne kunstneren?");
                if (!confirmed) return;
                try {
                const res = await fetch(`${API_BASE_URL}/api/artists/${selectedArtist._id}`, {
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
