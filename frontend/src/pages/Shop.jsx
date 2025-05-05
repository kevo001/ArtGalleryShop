import { useEffect, useState } from "react";
import { openModal, closeModal } from "../scripts/shopScripts";
import "../styles/Shop.css";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

const Shop = () => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    size: [],
    artist: "",
    type: "",
    price: { min: "", max: "" },
  });
  const [artistOptions, setArtistOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 0 });

  const navigate = useNavigate();
  const location = useLocation();

  // Hydrate state
  useEffect(() => {
    if (location.state?.filterArtist)
      setFilters(f => ({ ...f, artist: location.state.filterArtist }));
    if (location.state?.cart) setCart(location.state.cart);
  }, [location.state]);

  // Persist cart
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  // Fetch items & build options & price bounds
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/items`);
        const data = await res.json();
        setArtworks(data);
        setFilteredArtworks(data);

        // artists
        const artistMap = new Map();
        data.forEach(i => i.artist?._id && artistMap.set(i.artist._id, i.artist));
        setArtistOptions([...artistMap.values()]);

        // categories
        setTypeOptions([...new Set(data.map(i => i.category).filter(Boolean))]);

        // price bounds
        const prices = data.map(i => Number(i.price));
        const min = Math.min(...prices, 0);
        const max = Math.max(...prices, 0);
        setPriceBounds({ min, max });
        setFilters(f => ({ ...f, price: { min: String(min), max: String(max) } }));
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    })();
  }, []);

  // Toggle size
  const toggleSize = size => {
    setFilters(f => ({
      ...f,
      size: f.size.includes(size)
        ? f.size.filter(s => s !== size)
        : [...f.size, size]
    }));
  };

  // Apply filters
  useEffect(() => {
    let f = artworks;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      f = f.filter(a =>
        a.title.toLowerCase().includes(t) ||
        a.artist?.name?.toLowerCase().includes(t)
      );
    }
    if (filters.artist) f = f.filter(a => a.artist?._id === filters.artist);
    if (filters.type)   f = f.filter(a => a.category === filters.type);
    if (filters.size.length) f = f.filter(a => filters.size.includes(a.size));
    const min = parseFloat(filters.price.min),
          max = parseFloat(filters.price.max);
    if (!isNaN(min)) f = f.filter(a => Number(a.price) >= min);
    if (!isNaN(max)) f = f.filter(a => Number(a.price) <= max);
    setFilteredArtworks(f);
  }, [searchTerm, filters, artworks]);

  // Cart helpers (addToCart, removeFromCart, updateQuantity)...
  const addToCart = (item, qty = 1) => {
    const stock = Number(item.quantity) || 1;
    const quantity = Math.min(Math.max(qty, 1), stock);
    setCart(prev => {
      const exists = prev.find(i => i._id === item._id);
      if (exists) {
        return prev.map(i =>
          i._id === item._id
            ? { ...i, quantity: Math.min(i.quantity + qty, stock) }
            : i
        );
      }
      return [...prev, { ...item, quantity, stock }];
    });
  };
  const removeFromCart = id => setCart(prev => prev.filter(i => i._id !== id));
  const updateQuantity = (id, change) =>
    setCart(prev => prev.map(item =>
      item._id === id
        ? { ...item, quantity: Math.max(1, Math.min(item.quantity + change, item.stock)) }
        : item
    ));

  // Modal reset
  useEffect(() => {
    if (selectedArt) {
      setModalQuantity(1);
      openModal(selectedArt, setSelectedArt);
    }
  }, [selectedArt]);

  // Compute slider track styles
  const range = priceBounds.max - priceBounds.min;
  const leftPercent = ((filters.price.min - priceBounds.min) / range) * 100;
  const widthPercent = ((filters.price.max - filters.price.min) / range) * 100;

  return (
    <div>
      <main style={{ display: "flex" }}>
        <aside className="filter">
          <h3>Filter by</h3>

          {/* Artist */}
          <div>
            <h4>Artist</h4>
            <select
              value={filters.artist}
              onChange={e => setFilters(f => ({ ...f, artist: e.target.value }))}
            >
              <option value="">All</option>
              {artistOptions.map(a => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <h4>Category</h4>
            <select
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
            >
              <option value="">All</option>
              {typeOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <h4>Size</h4>
            <details>
              <summary>
                {filters.size.length ? filters.size.join(", ") : "Select sizes"}
              </summary>
              <div className="size-options">
                {["Small","Medium","Large"].map(sz => (
                  <label key={sz}>
                    <input
                      type="checkbox"
                      checked={filters.size.includes(sz)}
                      onChange={() => toggleSize(sz)}
                    />
                    {sz}
                  </label>
                ))}
              </div>
            </details>
          </div>

          {/* Dual-thumb Price Slider */}
          <div>
            <h4>Price</h4>
            <div className="price-range">
              <div className="slider-track" />
              <div
                className="slider-range"
                style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
              />
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={filters.price.min}
                onChange={e =>
                  setFilters(f => ({
                    ...f,
                    price: { ...f.price, min: e.target.value }
                  }))
                }
                className="thumb thumb-left"
              />
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={filters.price.max}
                onChange={e =>
                  setFilters(f => ({
                    ...f,
                    price: { ...f.price, max: e.target.value }
                  }))
                }
                className="thumb thumb-right"
              />
            </div>
            <div className="slider-values">
              <span>kr {filters.price.min}</span>
              <span>kr {filters.price.max}</span>
            </div>
          </div>
        </aside>

        {/* SHOP CONTENT */}
        <div style={{ flexGrow: 1 }}>
          <div className="shop-header">
            <div className="shop-header-row">
              <div className="shop-header-left">
                <h2>All Products</h2>
                <p className="product-count">
                  {filteredArtworks.length} product
                  {filteredArtworks.length !== 1 && "s"}
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
            {filteredArtworks.map((art) => (
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
                  onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                  disabled={modalQuantity <= 1}
                >
                  −
                </button>
                <input type="number" value={modalQuantity} readOnly />
                <button
                  onClick={() =>
                    setModalQuantity((q) =>
                      Math.min(Number(selectedArt.quantity) || 1, q + 1)
                    )
                  }
                  disabled={modalQuantity >= Number(selectedArt.quantity)}
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
                  const stock = Number(selectedArt.quantity) || modalQuantity;
                  const qty = Math.min(modalQuantity, stock);
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
              Cart ({cart.length} item{cart.length !== 1 && "s"})
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
                {cart.map((item) => (
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
                          onClick={() => updateQuantity(item._id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
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
