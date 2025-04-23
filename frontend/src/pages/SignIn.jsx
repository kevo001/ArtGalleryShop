import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    const adminCredentials = {
      username: "admin",
      password: "admin123",
    };

    if (
      username === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      navigate("/admin");
    } else {
      alert("Ugyldige innloggingsdetaljer. Prøv igjen.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
      <header className="bg-gradient-to-r from-[#282828] to-[#3E3E3E] text-center py-10 shadow-md">
        <h1 className="text-4xl font-bold text-[#FFD700]">Admin Innlogging</h1>
        <p className="text-gray-400 mt-2">Velkommen tilbake til Galleri Edwin</p>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[#FFD700]">Logg inn</h2>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-2 text-gray-300">
                Brukernavn
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-[#3E3E3E] border border-[#555] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-gray-300">
                Passord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#3E3E3E] border border-[#555] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FFD700] text-black py-2 rounded-lg font-semibold hover:bg-[#e6c200] transition"
            >
              Logg inn
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Har du ikke en konto?</p>
            <Link to="/signup" className="text-[#FFD700] hover:underline">
              Registrer deg her
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-auto text-center py-6 text-[#888] bg-[#1A1A1A] border-t border-[#333]">
        <p>&copy; 2025 galleri edwin – Adminpanel</p>
      </footer>
    </div>
  );
};

export default SignIn;