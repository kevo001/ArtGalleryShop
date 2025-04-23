export const fetchArtworks = async (setArtworks) => {
  try {
    const response = await fetch("http://localhost:5000/api/items");
    const data = await response.json();
    setArtworks(data);
  } catch (error) {
    console.error("Failed to fetch artworks:", error);
  }
};

export const openModal = (art, setSelectedArt) => {
  setSelectedArt(art);
};

export const closeModal = (setSelectedArt) => {
  setSelectedArt(null);
};