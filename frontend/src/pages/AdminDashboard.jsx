import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ items: 0, orders: 0, artists: 0 });
    const [orders, setOrders] = useState([]); // Initialize orders state
  
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
    <div className="w-screen min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navigation */}
      <nav className="w-full bg-gray-800 py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">galleri edwin</h1>
          <p className="text-sm text-gray-400">Discover the exceptional living with art</p>
        </div>
        <ul className="flex space-x-6">
          <li><a href="/admin" className="text-yellow-500 font-semibold">Home</a></li>
          <li><a href="/admin/orders" className="hover:text-yellow-500">Orders</a></li>
          <li><a href="/admin/products" className="hover:text-yellow-500">Products</a></li>
          <li><a href="/admin/artists" className="hover:text-yellow-500">Artists</a></li>
          <li><a href="/logout" className="hover:text-yellow-500">Log Out</a></li>
        </ul>
      </nav>

      {/* Main Content Wrapper */}
      <div className="flex-grow flex flex-col w-full">
        {/* Header Section */}
        <header className="w-full bg-gray-800 p-8 flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-4xl font-bold">Velkommen til Adminpanelet</h1>
            <p className="text-gray-400">Oppdater, administrer og overvåk innholdet på galleri edwin</p>
          </div>
          <img src="/Bilder/Viamilano.jpg" alt="Admin Panel" className="w-32 rounded-lg" />
        </header>

        {/* Stats Overview */}
        <section className="flex justify-around mt-8 px-6 w-full">
          <div className="bg-gray-700 p-6 rounded-lg text-center shadow-lg w-1/4">
            <h2 className="text-lg text-yellow-400">Aktive Produkter</h2>
            <p className="text-2xl font-semibold">{stats.items}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg text-center shadow-lg w-1/4">
            <h2 className="text-lg text-yellow-400">Antall Ordrer</h2>
            <p className="text-2xl font-semibold">{stats.orders}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg text-center shadow-lg w-1/4">
            <h2 className="text-lg text-yellow-400">Antall Kunstnere</h2>
            <p className="text-2xl font-semibold">{stats.artists}</p>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="mt-8 px-6 flex-grow w-full">
          <h2 className="text-xl font-bold mb-4">Siste Ordrer</h2>
          <table className="w-full bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-4">Ordernr.</th>
                <th className="py-3 px-4">Kunde</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dato</th>
                <th className="py-3 px-4">Totalt</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-600">
                    <td className="py-3 px-4">{order.orderNumber}</td>
                    <td className="py-3 px-4">{order.customerName}</td>
                    <td className="py-3 px-4">{order.status}</td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4">kr {order.totalAmount},-</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">Ingen ordrer funnet</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-gray-500 py-4 border-t border-gray-600">
        &copy; 2025 galleri edwin – Adminpanel
      </footer>
    </div>
  );
};

export default AdminDashboard;