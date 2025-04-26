import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AuthButton = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/signin");
  };

  if (!token) {
    // Ikke logget inn -> Vis "Sign In"
    return (
      <Link
        to="/signin"
        className="bg-[#FFD700] text-black px-4 py-2 rounded hover:bg-[#e6c200] transition"
      >
        Sign In
      </Link>
    );
  }

  if (isAdmin) {
    // Logget inn som admin -> Vis "AdminPanel"
    return (
      <button
        onClick={() => navigate("/admin")}
        className="bg-[#FFD700] text-black px-4 py-2 rounded hover:bg-[#e6c200] transition"
      >
        AdminPanel
      </button>
    );
  }

  // Logget inn som vanlig bruker -> Vis "Logg ut"
  return (
    <button
      onClick={handleLogout}
      className="bg-[#FFD700] text-black px-4 py-2 rounded hover:bg-[#e6c200] transition"
    >
      Logg ut
    </button>
  );
};

export default AuthButton;