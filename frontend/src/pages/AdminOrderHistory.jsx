import React, { useEffect, useState } from "react";

const AdminOrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching order history:", error));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
      {/* NAVIGATION */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#282828] to-[#3E3E3E] drop-shadow-lg">
        {/* Logo Section */}
        <div>
          < h1 className="text-2xl font-bold text-[#F5F5F5]">galleri edwin</h1>
          <p className="text-[#CCCCCC] text-sm">Discover the exceptional living with art</p>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li className="relative group">
            <a href="/admin" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
              Home
              <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li className="relative group">
            <a href="/admin/order-history" className="text-[#FFD700] hover:text-[#FFD700] transition duration-300">
              Orders
              <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li className="relative group">
            <a href="/admin/products" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
              Products
              <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li className="relative group">
            <a href="/admin/artists" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
              Artists
              <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li className="relative group">
            <a href="#" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
              Log Out
              <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
        </ul>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#444] to-[#2F2F2F] text-center py-10 shadow-lg">
          <h1 className="text-4xl font-bold text-white">Order History</h1>
          <p className="text-gray-300 mt-2">Overvåk og oppdatter kundens ordrer</p>
        </header>

      {/* ORDER TABLE */}
      <div className="flex justify-center mt-10 px-4">
        <div className="bg-[#2A2A2A] rounded-lg overflow-hidden w-full max-w-6xl shadow-lg">
          <table className="w-full text-left table-auto">
            <thead className="bg-[#333] text-white">
              <tr>
                <th className="py-4 px-6 border-b border-[#444]">Order Number</th>
                <th className="py-4 px-6 border-b border-[#444]">Customer</th>
                <th className="py-4 px-6 border-b border-[#444]">Status</th>
                <th className="py-4 px-6 border-b border-[#444]">Date</th>
                <th className="py-4 px-6 border-b border-[#444]">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#383838] transition">
                    <td className="py-4 px-6 border-b border-[#444]">{order.orderNumber}</td>
                    <td className="py-4 px-6 border-b border-[#444]">{order.customerName}</td>
                    <td className="py-4 px-6 border-b border-[#444]">{order.status}</td>
                    <td className="py-4 px-6 border-b border-[#444]">{order.date}</td>
                    <td className="py-4 px-6 border-b border-[#444]">kr {order.totalAmount},-</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">Ingen ordrer funnet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto text-center py-6 text-[#888] bg-[#1A1A1A] border-t border-[#333]">
        <p>&copy; 2025 galleri edwin – Adminpanel</p>
      </footer>
    </div>
  );
};

export default AdminOrderHistory;