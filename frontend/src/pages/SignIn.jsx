import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    // Hardkodet admin-bruker
    const hardcodedAdmin = {
      email: "admin@galleriedwin.no",
      password: "admin123",
    };
  
    if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
      // Gi admin-token manuelt og redirect
      localStorage.setItem("token", "hardcoded-admin-token");
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
      return;
    }
  
    // Vanlig brukerlogin
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, isAdmin } = res.data;
      localStorage.setItem("token", token);
  
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Innlogging feilet. Sjekk detaljer og prøv igjen.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
      <header className="bg-gradient-to-r from-[#282828] to-[#3E3E3E] text-center py-10 shadow-md">
        <h1 className="text-4xl font-bold text-[#FFD700]">Logg inn</h1>
        <p className="text-gray-400 mt-2">Velkommen tilbake til Galleri Edwin</p>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[#FFD700]">Logg inn</h2>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-gray-300">E-post</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[#3E3E3E] border border-[#555] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-gray-300">Passord</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#3E3E3E] border border-[#555] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#FFD700] text-black py-2 rounded-lg font-semibold hover:bg-[#e6c200] transition">
              Logg inn
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Har du ikke en konto?</p>
            <Link to="/signup" className="text-[#FFD700] hover:underline">Registrer deg her</Link>
          </div>
        </div>
      </main>

      <footer className="mt-auto text-center py-6 text-[#888] bg-[#1A1A1A] border-t border-[#333]">
        <p>&copy; 2025 galleri edwin – Autentisering</p>
      </footer>
    </div>
  );
};

export default SignIn;