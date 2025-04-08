import { useEffect, useState } from "react";
import { openModal, closeModal } from "../scripts/shopScripts";
import "../styles/Shop.css";
import { useNavigate, useLocation } from "react-router-dom";

const Shop = () => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const cartFromState = location.state?.cart;
  const [filters, setFilters] = useState({
    size: [],
    artist: "",
    type: "",
  });

  const [artistOptions, setArtistOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/items");
        const data = await response.json();
        setArtworks(data);
        setFilteredArtworks(data);

        const artistMap = new Map();
        data.forEach((item) => {
          if (item.artist && item.artist._id) {
            artistMap.set(item.artist._id, item.artist);
          }
        });
        setArtistOptions([...artistMap.values()]);

        const typeMap = new Map();
        data.forEach((item) => {
          if (item.type && item.type._id) {
            typeMap.set(item.type._id, item.type);
          }
        });
        setTypeOptions([...typeMap.values()]);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      }
    };

    fetchArtworks();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = artworks;

      if (searchTerm) {
        filtered = filtered.filter((art) =>
          art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          art.artist?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.artist) {
        filtered = filtered.filter((art) => art.artist?._id === filters.artist);
      }

      if (filters.type) {
        filtered = filtered.filter((art) => art.type?._id === filters.type);
      }

      if (filters.size.length > 0) {
        filtered = filtered.filter((art) => filters.size.includes(art.size));
      }

      setFilteredArtworks(filtered);
    };

    applyFilters();
  }, [searchTerm, filters, artworks]);

  const toggleSize = (size) => {
    setFilters((prev) => {
      const sizes = prev.size.includes(size)
        ? prev.size.filter((s) => s !== size)
        : [...prev.size, size];
      return { ...prev, size: sizes };
    });
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i._id === item._id);
      if (existing) {
        return prevCart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, change) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (location.state?.cart) {
      setCart(location.state.cart);
    }
  }, [location.state]);

  return (
    <div>
      <main>
        {/* FILTER */}
        <aside className="filter">
          <h3>Filter by</h3>
          <div>
            <h4>Artist</h4>
            <select
              value={filters.artist}
              onChange={(e) => setFilters({ ...filters, artist: e.target.value })}
            >
              <option value="">All</option>
              {artistOptions.map((artist) => (
                <option key={artist._id} value={artist._id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h4>Category</h4>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All</option>
              {typeOptions.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h4>Size</h4>
            {["Small", "Medium", "Large"].map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  checked={filters.size.includes(size)}
                  onChange={() => toggleSize(size)}
                />{" "}
                {size}
              </label>
            ))}
          </div>
        </aside>

        {/* SHOP CONTENT */}
        <div style={{ flexGrow: 1 }}>
        <div className="shop-header">
  <div className="shop-header-row">
    <div className="shop-header-left">
      <h2>All Products</h2>
      <p className="product-count">
        {filteredArtworks.length} product{filteredArtworks.length !== 1 && "s"}
      </p>
    </div>

    <div className="shop-header-center">
      <input
        type="text"
        className="search-input"
        placeholder="Search by title or artist..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <div className="shop-header-right">
      <button className="cart-toggle" onClick={() => setIsCartOpen(true)}>
        🛒 Cart ({cart.length})
      </button>
    </div>
  </div>
</div>

          <section className="shop">
            {filteredArtworks.map((art, index) => (
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
                <button disabled>-</button>
                <input type="number" value={1} readOnly />
                <button disabled>+</button>
              </div>
              <div className="meta">
                <h4>Artist</h4>
              {selectedArt.artist?.name && (
              <p className="artist-name">{selectedArt.artist.name}</p>
              )}
                <div>
                  <h4>Dimension</h4>
                  <p>{selectedArt.size} cm</p>
                </div>
                <div>
                  <h4>Year</h4>
                  <p>{selectedArt.year || "Unknown"}</p>
                </div>
              </div>
              <button
                className="add-to-cart"
                onClick={() => {
                  addToCart(selectedArt);
                  closeModal(setSelectedArt);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="cart-drawer">
          <div className="cart-header">
            <h3>Cart ({cart.length} item{cart.length !== 1 && "s"})</h3>
            <button onClick={() => setIsCartOpen(false)} className="cart-close">
              &times;
            </button>
          </div>
          <div className="cart-body">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {cart.map((item) => (
                 <li key={item._id} className="cart-item">
                 <img src={item.imageUrl} alt={item.title} className="cart-thumb" />
               
                 <div className="cart-item-info">
                   <strong>{item.title}</strong>
                   <div>
                   </div>
                   <button onClick={() => removeFromCart(item._id)} className="remove-btn">
                     Remove
                   </button>
                 </div>
               </li>
                ))}
              </ul>
            )}
          </div>
          {cart.length > 0 && (
      <div className="cart-footer">
        <p className="cart-total">
          Total: kr{" "}
          {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString("no-NO")},00
        </p>
        <button
  className="checkout-btn"
  onClick={() => navigate("/order-summary", { state: { cart } })}
>
  Proceed to Checkout
</button>
      </div>
    )}


        </div>
      )}
    </div>
  );
};

export default Shop;
