// SignUp.jsx
import React, { useState }     from "react";
import { useNavigate, Link }   from "react-router-dom";
import axios                    from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,           // so cookies (on login) are handled automatically
});

const SignUp = () => {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [error, setError]             = useState(null);
  const navigate                      = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passordene stemmer ikke overens.");
      return;
    }

    try {
      const response = await api.post("/api/auth/signup", { email, password });
      if (response.status === 201) {
        // success → go to login
        navigate("/signin");
      } else {
        // unlikely, but just in case
        setError(response.data.message || "Noe gikk galt. Prøv igjen.");
      }
    } catch (err) {
      // pick up server-sent message if available
      const msg =
        err.response?.data?.message ||
        "Noe gikk galt under registrering.";
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
      <header className="bg-gradient-to-r from-[#282828] to-[#3E3E3E] text-center py-10 shadow-md">
        <h1 className="text-4xl font-bold text-[#FFD700]">Registrer deg</h1>
        <p className="text-gray-400 mt-2">Velkommen til Galleri Edwin</p>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[#FFD700]">Opprett konto</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSignUp} className="space-y-4">
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
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-gray-300">Bekreft passord</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#3E3E3E] border border-[#555] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FFD700] text-black py-2 rounded-lg font-semibold hover:bg-[#e6c200] transition"
            >
              Opprett konto
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Har du allerede en konto?</p>
            <Link to="/signin" className="text-[#FFD700] hover:underline">
              Logg inn her
            </Link>
          </div>
        </div>
      </main>

      <footer className="mt-auto text-center py-6 text-[#888] bg-[#1A1A1A] border-t border-[#333]">
        <p>&copy; 2025 galleri edwin – Registrering</p>
      </footer>
    </div>
  );
};

export default SignUp;