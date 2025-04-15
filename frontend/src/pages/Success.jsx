import { useNavigate } from "react-router-dom";
import "../styles/Success.css"; // Gjenbruk stilen fra OrderSummary

const Success = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="order-summary">
        <div className="order-summary-header">
          <h2>Thank You!</h2>
        </div>

        <div className="order-summary-wrapper">
          <div className="summary-total">
            <h3>Your payment was successful 🎉</h3>
            <p>You will receive a confirmation email shortly.</p>
          </div>

          <div className="summary-actions">
            <button className="back-btn-top" onClick={() => navigate("/shop")}>
              ← Back to Shop
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;
