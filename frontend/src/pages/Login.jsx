import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const { setUser }             = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1) Send credentials, receive tokens
      const { data } = await apiClient.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = data;
      // 2) Persist tokens client‑side
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 3) Fetch current user
      const meRes = await apiClient.get('/auth/me');
      const user  = meRes.data.user;
      setUser(user);

      // 4) Redirect based on role
      if (user.isAdmin) navigate('/admin', { replace: true });
      else           navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-black p-8 rounded-lg shadow-lg border solid white">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Login</h2>
        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block w-full text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1 block !w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-100 placeholder-gray-500 text-black focus:outline-none focus:ring focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="yourName@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-100 placeholder-gray-500 text-black focus:outline-none focus:ring focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600 transition cursor-pointer"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}