import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/OrderSummary.css";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [lastRemoved, setLastRemoved] = useState(null);
  const [lastCleared, setLastCleared] = useState(null);

  // Initialize cart from either location.state or URL query param
  useEffect(() => {
    const stateCart = location.state?.cart || [];
    const params = new URLSearchParams(location.search);
    const cartB64 = params.get("cart");

    if (cartB64) {
      try {
        const json = atob(cartB64);
        const parsed = JSON.parse(json);
        setCart(parsed);
      } catch (e) {
        console.error("Invalid cart data in URL:", e);
        setCart(stateCart);
      }
    } else {
      setCart(stateCart);
    }
  }, [location.search, location.state]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (id) => {
    const itemToRemove = cart.find((item) => item._id === id);
    setLastRemoved(itemToRemove);
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const undoRemove = () => {
    if (lastRemoved) {
      setCart((prev) => [...prev, lastRemoved]);
      setLastRemoved(null);
    }
  };

  const clearAll = () => {
    setLastRemoved(null);
    setCart([]);
    setLastCleared(cart);
  };

  const undoClearAll = () => {
    if (lastCleared) {
      setCart(lastCleared);
      setLastCleared(null);
    }
  };

  const handleStripeCheckout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart }),
        }
      );
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error", error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="order-summary empty">
        <h2>Your order is empty.</h2>
        <button
          className="back-btn-top"
          onClick={() => navigate("/shop", { state: { cart } })}
        >
          ← Back to Shop
        </button>

        {lastRemoved && (
          <button className="undo-btn" onClick={undoRemove}>
            Undo Remove
          </button>
        )}

        {lastCleared && (
          <div className="undo-section">
            <p>All items removed.</p>
            <button className="undo-btn" onClick={undoClearAll}>
              Undo Clear All
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="order-summary">
      <div className="order-summary-header">
        <button
          className="back-arrow"
          onClick={() => navigate("/shop", { state: { cart } })}
        >
          ←
        </button>
        <h2>Order Summary</h2>
      </div>

      <div className="order-summary-wrapper">
        <ul className="summary-list">
          {cart.map((item) => (
            <li key={item._id} className="summary-item">
              <img
                src={`http://localhost:5000${item.imageUrl}`}
                alt={item.title}
                className="summary-thumb"
              />
              <div className="summary-info">
                <h4>{item.title}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>
                  Price: kr {Number(item.price).toLocaleString("no-NO")},00
                </p>
                <button
                  className="remove-summary"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        {lastRemoved && (
          <div className="undo-section">
            <p>Item removed.</p>
            <button className="undo-btn" onClick={undoRemove}>
              Undo
            </button>
          </div>
        )}

        <div className="summary-total">
          <h3>Total: kr {total.toLocaleString("no-NO")},00</h3>
        </div>

        <div className="summary-actions">
          <button className="clear-btn" onClick={clearAll}>
            Clear All
          </button>
          <button className="confirm-btn" onClick={handleStripeCheckout}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
