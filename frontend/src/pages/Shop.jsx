import { useEffect, useState } from "react";
import { openModal, closeModal } from "../scripts/shopScripts";
import "../styles/Shop.css";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from '../apiConfig';

const Shop = () => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ size: [], artist: "", type: "" });
  const [artistOptions, setArtistOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.filterArtist) {
      setFilters(f => ({ ...f, artist: location.state.filterArtist }));
    }
  }, [location.state]);

  // Fetch combined items (admin + Stripe) from single endpoint
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/items`);
        const data = await res.json();

        setArtworks(data);
        setFilteredArtworks(data);

        // Build artist filter options
        const artistMap = new Map();
        data.forEach(item => {
          if (item.artist && item.artist._id) {
            artistMap.set(item.artist._id, item.artist);
          }
        });
        setArtistOptions([...artistMap.values()]);

        // Build category filter options
        const categories = [...new Set(data.map(item => item.category).filter(Boolean))];
        setTypeOptions(categories);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    fetchItems();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = artworks;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(art =>
        art.title.toLowerCase().includes(term) ||
        art.artist?.name?.toLowerCase().includes(term)
      );
    }

    if (filters.artist) {
      filtered = filtered.filter(art => art.artist?._id === filters.artist);
    }

    if (filters.type) {
      filtered = filtered.filter(art => art.category === filters.type);
    }

    if (filters.size.length > 0) {
      filtered = filtered.filter(art => filters.size.includes(art.size));
    }

    setFilteredArtworks(filtered);
  }, [searchTerm, filters, artworks]);

  // Handlers for cart logic
  const toggleSize = size => {
    setFilters(prev => {
      const sizes = prev.size.includes(size)
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size];
      return { ...prev, size: sizes };
    });
  };

  const addToCart = (item, qty = 1) => {
    const parsed = Number(item.quantity);
    const stock  = parsed > 0 ? parsed : 1; 
    const initial  = Math.max(1, Math.min(qty, stock)); 
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      if (exists) {
        return prev.map(i =>
          i._id === item._id
            ? {
                ...i,
                // clamp the new cart qty to the real stock
                quantity: Math.min(i.quantity + qty, stock)
              }
            : i
        );
      }
      return [
        ...prev,
        {
          ...item,
          quantity: Math.max(1, Math.min(qty, stock)),  // initial qty
          stock                            // stash the real stock
        }
      ];
    });
  };

  const removeFromCart = id => {
    setCart(prev => prev.filter(i => i._id !== id));
  };

  const updateQuantity = (id, change) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id
          ? {
              ...item,
              // never go below 1, never above the real stock
              quantity: Math.max(
                1,
                Math.min(item.quantity + change, item.stock)
              )
            }
          : item
      )
    );
  };

  // Persist cart in localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || "[]");
    setCart(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Handle cart passed via navigation state
  useEffect(() => {
    if (location.state?.cart) setCart(location.state.cart);
  }, [location.state]);

  // Reset quantity to 1 and open modal when selectedArt changes
  useEffect(() => {
    if (selectedArt) {
      setModalQuantity(1);
      openModal(selectedArt, setSelectedArt);
    }
  }, [selectedArt]);

  return (
    <div>
      <main>
        {/* FILTERS */}
        <aside className="filter">
          <h3>Filter by</h3>
          <div>
            <h4>Artist</h4>
            <select
              value={filters.artist}
              onChange={e => setFilters({ ...filters, artist: e.target.value })}
            >
              <option value="">All</option>
              {artistOptions.map(artist => (
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
              onChange={e => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All</option>
              {typeOptions.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h4>Size</h4>
            {["Small", "Medium", "Large"].map(size => (
              <label key={size}>
                <input
                  type="checkbox"
                  checked={filters.size.includes(size)}
                  onChange={() => toggleSize(size)}
                />
                {size}
              </label>
            ))}
          </div>
        </aside>
        {/* SHOP HEADER + PRODUCTS */}
        <div style={{ flexGrow: 1 }}>
          <div className="shop-header">
            <div className="shop-header-row">
              <div className="shop-header-left">
                <h2>All Products</h2>
                <p className="product-count">
                  {filteredArtworks.length} product
                  {filteredArtworks.length !== 1 && 's'}
                </p>
              </div>
              <div className="shop-header-center">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by title or artist..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="shop-header-right">
                <button
                  className="cart-toggle"
                  onClick={() => setIsCartOpen(true)}
                >
                  🛒 Cart ({cart.length})
                </button>
              </div>
            </div>
          </div>
          <section className="shop">
            {filteredArtworks.map(art => (
              <div
                key={art._id}
                className="art-card"
                onClick={() => setSelectedArt(art)}
              >
                <img src={art.imageUrl} alt={art.title} />
                <h3>{art.title}</h3>
                <p>kr {Number(art.price).toLocaleString("no-NO")},00</p>
              </div>
            ))}
          </section>
        </div>
      </main>

      {/* PRODUCT MODAL */}
      {selectedArt && (
        <div className="popup">
          <div className="popup-content">
            <div className="popup-image">
              <img src={selectedArt.imageUrl} alt={selectedArt.title} />
            </div>
            <div className="popup-details">
              <span
                className="close"
                onClick={() => closeModal(setSelectedArt)}
              >
                &times;
              </span>
              <h2>{selectedArt.title}</h2>
              <p className="price">
                kr {Number(selectedArt.price).toLocaleString("no-NO")},00
              </p>

              {/* Quantity Controls */}
              <label className="qty-label">Quantity *</label>
              <div className="quantity-controls">
                <button
                  onClick={() =>
                    setModalQuantity(q => Math.max(1, q - 1))
                  }
                  disabled={modalQuantity <= 1}
                >
                  −
                </button>
                <input type="number" value={modalQuantity} readOnly />
                <button
                  onClick={() =>
                    setModalQuantity(q =>
                      Math.min(selectedArt.quantity, q + 1)
                    )
                  }
                  disabled={modalQuantity >= selectedArt.quantity}
                >
                  ＋
                </button>
              </div>
              {/* Meta */}
              <div className="meta">
                {selectedArt.artist?.name && (
                  <>
                    <h4>Artist</h4>
                    <p className="artist-name">
                    <span
            className="cursor-pointer hover:text-[#FFD700]"
            onClick={() => {
              closeModal(setSelectedArt);
              navigate(`/artists/${selectedArt.artist._id}`);
            }}
          >
            {selectedArt.artist.name}
          </span>
                    </p>
                  </>
                )}
                {(selectedArt.dimension || selectedArt.size) && (
                  <>
                    <h4>Size</h4>
                    <p>
                      {selectedArt.dimension}{" "}
                      {selectedArt.size && `(${selectedArt.size})`}
                    </p>
                  </>
                )}
                {selectedArt.year && (
                  <>
                    <h4>Year</h4>
                    <p>{selectedArt.year}</p>
                  </>
                )}
              </div>

              {/* Add to Cart */}
               <button
                className="add-to-cart"
                onClick={() => {
                // if stock is defined, cap at it; otherwise just use modalQuantity
                const available = selectedArt.quantity != null
                ? Number(selectedArt.quantity)
                : modalQuantity;
                const qty = Math.min(modalQuantity, available);
                addToCart(selectedArt, qty);
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
            <h3>
              Cart ({cart.length} item
              {cart.length !== 1 && 's'})
            </h3>
            <button
              onClick={() => setIsCartOpen(false)}
              className="cart-close"
            >
              &times;
            </button>
          </div>
          <div className="cart-body">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {cart.map(item => (
                  <li key={item._id} className="cart-item">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="cart-thumb"
                    />
                    <div className="cart-item-info">
                      <strong>{item.title}</strong>
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, -1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, 1)
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          ＋
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="remove-btn"
                      >
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
                {cart
                  .reduce((sum, i) => sum + i.price * i.quantity, 0)
                  .toLocaleString("no-NO")}
                ,00
              </p>
              <button
                className="checkout-btn"
                onClick={() =>
                  navigate("/order-summary", { state: { cart } })
                }
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
