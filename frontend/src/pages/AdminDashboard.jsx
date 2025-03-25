import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ items: 0, orders: 0, artists: 0 });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch items
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => {
        console.log("Items fetched:", data); // Debugging
        setStats((prev) => ({ ...prev, items: data.length }));
      })
      .catch((error) => console.error("Error fetching items:", error));

    // Fetch artists
    fetch("http://localhost:5000/api/artists")
      .then((res) => res.json())
      .then((data) => {
        console.log("Artists fetched:", data); // Debugging
        setStats((prev) => ({ ...prev, artists: data.length }));
      })
      .catch((error) => console.error("Error fetching artists:", error));

    // Fetch orders
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        console.log("Orders fetched:", data); // Debugging
        setStats((prev) => ({ ...prev, orders: data.length }));
        setOrders(data); // Save orders to state
      })
      .catch((error) => console.error("Error fetching orders:", error));
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
            <a href="/admin" className="text-[#FFD700] hover:text-[#FFD700] transition duration-300">
              Home
              <span className="block w-0 h-[2px] bg-[#AAAAAA] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li className="relative group">
            <a href="/admin/order-history" className="text-[#F5F5F5] hover:text-[#FFD700] transition duration-300">
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

      {/* CONTENT */}
      
        {/* HEADER */}
        <header className="bg-gradient-to-r from-[#444] to-[#2F2F2F] text-center py-10 shadow-lg">
          <h1 className="text-4xl font-bold text-white">Velkommen til Adminpanelet</h1>
          <p className="text-gray-300 mt-2">Oppdater, administrer og overvåk innholdet på galleri edwin</p>
        </header>

        {/* STAT CARDS */}
        <div className="flex-grow">
        <section className="flex justify-center gap-6 mt-8 max-w-5xl mx-auto">
          <div className="bg-[#2A2A2A] p-6 rounded-lg text-center shadow-md w-64">
            <h2 className="text-lg text-[#FFD700] font-semibold">Aktive Produkter</h2>
            <p className="text-2xl font-bold">{stats.items}</p>
          </div>
          <div className="bg-[#2A2A2A] p-6 rounded-lg text-center shadow-md w-64">
            <h2 className="text-lg text-[#FFD700] font-semibold">Antall Ordrer</h2>
            <p className="text-2xl font-bold">{stats.orders}</p>
          </div>
          <div className="bg-[#2A2A2A] p-6 rounded-lg text-center shadow-md w-64">
            <h2 className="text-lg text-[#FFD700] font-semibold">Antall Kunstnere</h2>
            <p className="text-2xl font-bold">{stats.artists}</p>
          </div>
        </section>

        {/* RECENT ORDERS */}
        <section className="mt-12 max-w-5xl mx-auto px-26">
          <h2 className="text-2xl font-bold mb-4">Siste Ordrer</h2>
          <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left bg-[#2A2A2A] shadow-lg rounded-lg">
              <thead className="bg-[#333333] text-[#F5F5F5]">
                <tr>
                  <th className="py-4 px-6 border-b border-[#444]">Ordernr.</th>
                  <th className="py-4 px-6 border-b border-[#444]">Kunde</th>
                  <th className="py-4 px-6 border-b border-[#444]">Status</th>
                  <th className="py-4 px-6 border-b border-[#444]">Dato</th>
                  <th className="py-4 px-6 border-b border-[#444]">Totalt</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#383838] transition-all">
                      <td className="py-4 px-6 border-b border-[#444]">{order.orderNumber}</td>
                      <td className="py-4 px-6 border-b border-[#444]">{order.customerName}</td>
                      <td className="py-4 px-6 border-b border-[#444]">{order.status}</td>
                      <td className="py-4 px-6 border-b border-[#444]">{order.date}</td>
                      <td className="py-4 px-6 border-b border-[#444]">kr {order.totalAmount},-</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-[#CCCCCC]">Ingen order funnet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto text-center py-6 text-[#888] bg-[#1A1A1A] border-t border-[#333]">
        <p>&copy; 2025 galleri edwin – Adminpanel</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;