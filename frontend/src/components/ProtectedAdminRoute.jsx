import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token) {
    // If not logged in at all → go to Sign In
    return <Navigate to="/signin" replace />;
  }

  if (!isAdmin) {
    // Logged in but not an admin → go to Home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;