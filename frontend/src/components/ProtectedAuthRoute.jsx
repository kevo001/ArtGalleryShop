import { Navigate } from "react-router-dom";

const ProtectedAuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    // If already logged in, go to Home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAuthRoute;