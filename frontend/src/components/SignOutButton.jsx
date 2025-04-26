import React from "react";
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  return (
    <div className="group">
      <button
        onClick={handleSignOut}
        className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300"
      >
        Sign Out
        <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
      </button>
    </div>
  );
};

export default SignOutButton;