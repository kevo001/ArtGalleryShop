import { useEffect, useState } from "react";
import { openModal, closeModal } from "../scripts/shopScripts";
import "../styles/Shop.css";

const Shop = () => {
  const [artworks, setArtworks] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/items");
        const data = await response.json();
        setArtworks(data); // no sorting applied
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div>
      <main>
        {/* FILTER */}
        <aside className="filter">
          <h3>Filter by</h3>
          <div>
            <h4>Artist</h4>
          </div>
          <div>
            <h4>Type</h4>
          </div>
          <div>
            <h4>Price</h4>
          </div>
          <div>
            <h4>Size</h4>
            <label>
              <input type="checkbox" /> Small
            </label>
            <label>
              <input type="checkbox" /> Medium
            </label>
            <label>
              <input type="checkbox" /> Large
            </label>
          </div>
        </aside>

        {/* SHOP CONTENT */}
        <div style={{ flexGrow: 1 }}>
          <div className="shop-header">
            <h2>All Products</h2>
            <p>{artworks.length} product{artworks.length !== 1 && "s"}</p>
          </div>

          <section className="shop">
            {artworks.map((art, index) => (
              <div
                key={index}
                className="art-card"
                onClick={() => openModal(art, setSelectedArt)}
              >
                <img src={art.imageUrl} alt={art.title} />
                <h3>{art.title}</h3>
                <p>kr {Number(art.price).toLocaleString("no-NO")},00</p>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* POPUP MODAL */}
      {selectedArt && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-image">
              <img src={selectedArt.imageUrl} alt={selectedArt.title} />
            </div>

            <div className="popup-details">
              <span className="close" onClick={() => closeModal(setSelectedArt)}>
                &times;
              </span>

              <h2>{selectedArt.title}</h2>
              <p className="price">
                kr {Number(selectedArt.price).toLocaleString("no-NO")},00
              </p>

              <label className="qty-label">Quantity *</label>
              <div className="quantity-controls">
                <button>-</button>
                <input type="number" value={1} readOnly />
                <button>+</button>
              </div>

              <button className="add-to-cart">Add to Cart</button>

              <div className="meta">
                <div>
                  <h4>Dimension</h4>
                  <p>{selectedArt.size} cm</p>
                </div>
                <div>
                  <h4>Year</h4>
                  <p>{selectedArt.year || "Unknown"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
