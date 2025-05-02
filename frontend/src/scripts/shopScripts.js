export const fetchArtworks = async (setArtworks) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`);
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
