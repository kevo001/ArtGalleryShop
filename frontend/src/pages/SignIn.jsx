import React, { useState } from "react";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    // Hardcoded admin credentials (only for this demo)
    const adminCredentials = {
      username: "admin",
      password: "admin123",
    };

    if (username === adminCredentials.username && password === adminCredentials.password) {
      // Redirect to the admin dashboard after successful login
      navigate("/admin-dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      <header className="bg-black text-center py-10">
        <h1 className="text-4xl font-bold">Sign In</h1>
      </header>

      <main className="flex-grow flex justify-center items-center">
        <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-md w-96">
          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-400">Don't have an account?</p>
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-400"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;