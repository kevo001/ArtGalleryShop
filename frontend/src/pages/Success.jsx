import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Success.css";
import API_BASE_URL from '../apiConfig';

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`${API_BASE_URL}/api/stripe/session/${sessionId}`)
        .then(res => res.json())
        .then(data => setOrder(data))
        .catch(err => console.error("Failed to fetch session:", err));
    }
  }, [sessionId]);

  return (
    <div className="order-summary">
      <div className="order-summary-header">
        <h2>Thank You!</h2>
      </div>

      <div className="order-summary-wrapper">
        {order ? (
          <>
            <div className="summary-total">
              <h3>Your payment was successful 🎉</h3>
              <p>Order Number: <strong>{order.orderNumber}</strong></p>
              <p>Customer: {order.customerName} ({order.email})</p>
              <p>Total: kr {order.totalAmount.toLocaleString("no-NO")},-</p>
              <p>Shipping to: {order.address?.line1}, {order.address?.postal_code} {order.address?.city}, {order.address?.country}</p>
            </div>

            <div className="summary-items">
              <h4 className="mt-4">Items Ordered:</h4>
              <ul className="list-disc list-inside">
                {order.cart.map((item, index) => (
                  <li key={index}>
                    {item.title} × {item.quantity} – kr {item.price}
                  </li>
                ))}
              </ul>
            </div>

            <div className="summary-actions mt-4">
              <button className="back-btn-top" onClick={() => navigate("/shop")}>
                ← Back to Shop
              </button>
            </div>
          </>
        ) : (
          <p>Loading order...</p>
        )}
      </div>
    </div>
  );
};

export default Success;
