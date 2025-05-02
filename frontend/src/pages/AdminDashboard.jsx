import React, { useEffect, useState } from "react";


const AdminDashboard = () => {
  const [stats, setStats] = useState({ items: 0, orders: 0, artists: 0 });
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    // Fetch items
    fetch("http://localhost:5000/api/items")
      .then((res) => res.json())
      .then((data) => {
        setStats((prev) => ({ ...prev, items: data.length }));
        setItems(data); // Save items to state
      })
      .catch((error) => console.error("Error fetching items:", error));

    // Fetch artists
    fetch("http://localhost:5000/api/artists")
      .then((res) => res.json())
      .then((data) => {
        setStats((prev) => ({ ...prev, artists: data.length }));
        setArtists(data); // Save artists to state
      })
      .catch((error) => console.error("Error fetching artists:", error));

    // Fetch orders
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setStats((prev) => ({ ...prev, orders: data.length }));
        setOrders(data); // Save orders to state
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const handleStatCardClick = (type) => {
    setModalContent(type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
      {/* NAVIGATION */}
      <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#282828] to-[#3E3E3E] drop-shadow-lg">
        <a href="/" className="block">
          <h1 className="text-2xl font-bold text-[#F5F5F5] hover:text-[#FFD700] transition-colors">
            galleri edwin
          </h1>
          <p className="text-[#CCCCCC] text-sm">Discover the exceptional living with art</p>
        </a>
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
        </ul>
      </nav>

      {/* CONTENT */}
      <header className="bg-gradient-to-r from-[#444] to-[#2F2F2F] text-center py-10 shadow-lg">
        <h1 className="text-4xl font-bold text-white">Velkommen til Adminpanelet</h1>
        <p className="text-gray-300 mt-2">Oppdater, administrer og overvåk innholdet på galleri edwin</p>
      </header>

      {/* STAT CARDS */}
      <div className="flex-grow">
        <section className="flex justify-center gap-6 mt-8 max-w-5xl mx-auto">
          <div
            onClick={() => handleStatCardClick("items")}
            className="bg-[#2A2A2A] p-6 rounded-lg text-center shadow-md w-64 cursor-pointer hover:bg-[#383838] transition-all"
          >
            <h2 className="text-lg text-[#FFD700] font-semibold">Aktive Produkter</h2>
            <p className="text-2xl font-bold">{stats.items}</p>
          </div>
          <div
            onClick={() => handleStatCardClick("orders")}
            className="bg-[#2A2A2A] p-6 rounded-lg text-center shadow-md w-64 cursor-pointer hover:bg-[#383838] transition-all"
          >
            <h2 className="text-lg text-[#FFD700] font-semibold">Antall Ordre</h2>
            <p className="text-2xl font-bold">{stats.orders}</p>
          </div>
          <div
            onClick={() => handleStatCardClick("artists")}
            className="bg-[#2A2A2A] p-6 rounded-lg text-center shadow-md w-64 cursor-pointer hover:bg-[#383838] transition-all"
          >
            <h2 className="text-lg text-[#FFD700] font-semibold">Antall Kunstnere</h2>
            <p className="text-2xl font-bold">{stats.artists}</p>
          </div>
        </section>

        {/* RECENT ORDERS */}
        <section className="mt-12 max-w-5xl mx-auto px-26">
          <h2 className="text-2xl font-bold mb-4">Siste Ordre</h2>
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
                  orders.slice(-5).reverse().map((order) => (
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

      {/* STAT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg w-[95%] md:w-[90%] lg:w-[800px] relative overflow-auto">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-2xl cursor-pointer"
              onClick={handleModalClose}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">
              {modalContent === "items" && "Aktive Produkter"}
              {modalContent === "orders" && "Antall Ordre"}
              {modalContent === "artists" && "Antall Kunstnere"}
            </h2>

            {/* Render content based on modalContent */}
            {modalContent === "items" && (
              <div className="max-h-[700px] overflow-y-auto">
                <table className="min-w-full bg-[#2A2A2A] text-white shadow-lg rounded-lg">
                  <thead className="bg-[#333333]">
                    <tr>
                      <th className="py-2 px-4 border-b">Tittel</th>
                      <th className="py-2 px-4 border-b">Bilde</th>
                      <th className="py-2 px-4 border-b">Pris</th>
                      <th className="py-2 px-4 border-b">Størrelse</th>
                      <th className="py-2 px-4 border-b">Kategori</th>
                      <th className="py-2 px-4 border-b">Kunstner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0 ? (
                      items.map((item) => (
                        <tr key={item._id} className="hover:bg-[#383838]">
                          <td className="py-2 px-4 border-b">{item.title}</td>
                          <td className="py-2 px-4 border-b">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-16 w-16 object-cover"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">{item.price} kr</td>
                          <td className="py-2 px-4 border-b">{item.size}</td>
                          <td className="py-2 px-4 border-b">{item.category}</td>
                          <td className="py-2 px-4 border-b">{item.artist?.name || "Ukjent"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-4 text-center">Ingen produkter funnet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {modalContent === "orders" && (
              <div className="max-h-[700px] overflow-y-auto">
                <table className="min-w-full bg-[#2A2A2A] text-white shadow-lg rounded-lg">
                  <thead className="bg-[#333333]">
                    <tr>
                      <th className="py-2 px-4 border-b">Ordrenr.</th>
                      <th className="py-2 px-4 border-b">Kunde</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Dato</th>
                      <th className="py-2 px-4 border-b">Totalt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-[#383838]">
                          <td className="py-2 px-4 border-b">{order.orderNumber}</td>
                          <td className="py-2 px-4 border-b">{order.customerName}</td>
                          <td className="py-2 px-4 border-b">{order.status}</td>
                          <td className="py-2 px-4 border-b">{order.date}</td>
                          <td className="py-2 px-4 border-b">kr {order.totalAmount},-</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-4 text-center">Ingen ordre funnet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {modalContent === "artists" && (
              <div className="max-h-[700px] overflow-y-auto">
                <table className="min-w-full bg-[#2A2A2A] text-white shadow-lg rounded-lg">
                  <thead className="bg-[#333333]">
                    <tr>
                      <th className="py-2 px-4 border-b">Navn</th>
                      <th className="py-2 px-4 border-b">Bilde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artists.length > 0 ? (
                      artists.map((artist) => (
                        <tr key={artist._id} className="hover:bg-[#383838]">
                          <td className="py-2 px-4 border-b">{artist.name}</td>
                          <td className="py-2 px-4 border-b">
                            <img
                              src={artist.imageUrl}
                              alt={artist.name}
                              className="h-16 w-16 object-cover"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-4 text-center">Ingen kunstnere funnet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <button
              onClick={handleModalClose}
              className="bg-[#FFD700] hover:bg-[#ffbb00] text-black px-4 py-2 rounded-lg font-semibold cursor-pointer w-full"
            >
              Lukk
            </button>
          </div>
        </div>
      )}


      {/* FOOTER */}
      <footer className="mt-auto text-center py-6 text-[#888] bg-[#1A1A1A] border-t border-[#333]">
        <p>&copy; 2025 galleri edwin – Adminpanel</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;