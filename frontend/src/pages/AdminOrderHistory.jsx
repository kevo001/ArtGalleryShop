import React, { useEffect, useState } from "react";

const AdminOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [sortStatus, setSortStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching order history:", error));
  }, []);

  const handleSortChange = (status) => {
    setSortStatus(status);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const updateOrderStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${selectedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrder = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;

    let fieldA = a[sortField];
    let fieldB = b[sortField];

    // Special handling for orderNumber
    if (sortField === "orderNumber") {
      const numA = parseInt(fieldA.split("-")[1], 10);
      const numB = parseInt(fieldB.split("-")[1], 10);
      return sortDirection === "asc" ? numA - numB : numB - numA;
    }

    // Special handling for totalAmount
    if (sortField === "totalAmount") {
      return sortDirection === "asc"
        ? fieldA - fieldB
        : fieldB - fieldA;
    }

    // Special handling for date
    if (sortField === "date") {
      const [dayA, monthA, yearA] = fieldA.split(".");
      const [dayB, monthB, yearB] = fieldB.split(".");
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
    
      if (dateA.getTime() === dateB.getTime()) {
        // If dates are exactly equal, sort by orderNumber
        const numA = parseInt(a.orderNumber.split("-")[1], 10);
        const numB = parseInt(b.orderNumber.split("-")[1], 10);
        return sortDirection === "asc" ? numA - numB : numB - numA;
      } else {
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
    }

    // Default string comparison (customerName, status, etc.)
    return sortDirection === "asc"
      ? String(fieldA).localeCompare(String(fieldB))
      : String(fieldB).localeCompare(String(fieldA));
  });

  const handleSort = (field) => {
    if (field === sortField) {
      // If clicking the same field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Otherwise set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
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
          <li className="relative group"><a href="/admin" className="text-[#F5F5F5] hover:text-[#FFD700] transition">Home</a></li>
          <li className="relative group"><a href="/admin/order-history" className="text-[#FFD700] hover:text-[#FFD700] transition">Orders</a></li>
          <li className="relative group"><a href="/admin/products" className="text-[#F5F5F5] hover:text-[#FFD700] transition">Products</a></li>
          <li className="relative group"><a href="/admin/artists" className="text-[#F5F5F5] hover:text-[#FFD700] transition">Artists</a></li>
        </ul>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#444] to-[#2F2F2F] text-center py-10 shadow-lg">
        <h1 className="text-4xl font-bold text-white">Order History</h1>
        <p className="text-gray-300 mt-2">Overvåk og oppdatter kundens ordrer</p>
      </header>

      {/* SORT + SEARCH */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4 flex-wrap gap-4">
          <div className="flex space-x-2">
            <button onClick={() => handleSortChange("all")} className={`cursor-pointer px-4 py-2 rounded text-sm hover:bg-[#ffbb00] hover:text-black ${sortStatus === "all" ? "bg-[#FFD700] text-black" : "bg-[#444] text-white cursor:pointer"}`}>Alle</button>
            <button onClick={() => handleSortChange("Under behandling")} className={`cursor-pointer px-4 py-2 rounded text-sm hover:bg-[#ffbb00] hover:text-black ${sortStatus === "Under behandling" ? "bg-[#FFD700] text-black" : "bg-[#444] text-white"}`}>Under behandling</button>
            <button onClick={() => handleSortChange("Ferdig")} className={`cursor-pointer px-4 py-2 rounded text-sm hover:bg-[#ffbb00] hover:text-black ${sortStatus === "Ferdig" ? "bg-[#FFD700] text-black" : "bg-[#444] text-white"}`}>Ferdig</button>
          </div>

          <input
            type="text"
            placeholder="Søk etter kunde eller ordrenummer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded bg-[#333] text-white placeholder-gray-400 w-full max-w-sm"
          />
        </div>

        {/* ORDER TABLE */}
        <div className="bg-[#2A2A2A] rounded-lg overflow-hidden w-full shadow-lg">
          <table className="w-full text-left table-auto">
            <thead className="bg-[#333] text-white">
              <tr>
                <th
                  className="py-4 px-6 border-b border-[#444] cursor-pointer select-none"
                  onClick={() => handleSort("orderNumber")}
                >
                  Order Number
                  <span className="ml-1">
                    <span className={sortField === "orderNumber" && sortDirection === "asc" ? "text-yellow-400" : "text-gray-500"}>▲</span>
                    <span className={sortField === "orderNumber" && sortDirection === "desc" ? "text-yellow-400" : "text-gray-500"}>▼</span>
                  </span>
                </th>
                <th
                  className="py-4 px-6 border-b border-[#444] cursor-pointer select-none"
                  onClick={() => handleSort("customerName")}>
                  Customer
                  <span className="ml-1">
                    <span className={sortField === "customerName" && sortDirection === "asc" ? "text-yellow-400" : "text-gray-500"}>▲</span>
                    <span className={sortField === "customerName" && sortDirection === "desc" ? "text-yellow-400" : "text-gray-500"}>▼</span>
                  </span>
                </th>
                <th className="py-4 px-6 border-b border-[#444]">
                  Adresse
                </th>
                <th
                  className="py-4 px-6 border-b border-[#444] cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  Status
                  <span className="ml-1">
                    <span className={sortField === "status" && sortDirection === "asc" ? "text-yellow-400" : "text-gray-500"}>▲</span>
                    <span className={sortField === "status" && sortDirection === "desc" ? "text-yellow-400" : "text-gray-500"}>▼</span>
                  </span>
                </th>
                <th
                  className="py-4 px-6 border-b border-[#444] cursor-pointer select-none"
                  onClick={() => handleSort("date")}
                >
                  Date
                  <span className="ml-1">
                    <span className={sortField === "date" && sortDirection === "asc" ? "text-yellow-400" : "text-gray-500"}>▲</span>
                    <span className={sortField === "date" && sortDirection === "desc" ? "text-yellow-400" : "text-gray-500"}>▼</span>
                  </span>
                </th>
                <th
                  className="py-4 px-6 border-b border-[#444] cursor-pointer select-none"
                  onClick={() => handleSort("totalAmount")}
                >
                  Total
                  <span className="ml-1">
                    <span className={sortField === "totalAmount" && sortDirection === "asc" ? "text-yellow-400" : "text-gray-500"}>▲</span>
                    <span className={sortField === "totalAmount" && sortDirection === "desc" ? "text-yellow-400" : "text-gray-500"}>▼</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length > 0 ? (
                sortedOrders
                  .filter(
                    (order) =>
                      (sortStatus === "all" || order.status === sortStatus) &&
                      (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-[#383838] transition cursor-pointer"
                      onClick={() => openModal(order)}
                    >
                      <td className="py-4 px-6 border-b border-[#444]">{order.orderNumber}</td>
                      <td className="py-4 px-6 border-b border-[#444]">{order.customerName}</td>
                      <td className="py-4 px-6 border-b border-[#444]">
                        {order.address ? (
                          <>
                            {order.address.line1}{" "}
                            {order.address.line2 ? order.address.line2 + " " : ""}
                            {order.address.postal_code} {order.address.city}, {order.address.country}
                          </>
                        ) : (
                          "Ingen adresse"
                        )}
                      </td>
                      <td className="py-4 px-6 border-b border-[#444]">{order.status}</td>
                      <td className="py-4 px-6 border-b border-[#444]">{order.date}</td>
                      <td className="py-4 px-6 border-b border-[#444]">kr {order.totalAmount.toLocaleString()},-</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    Ingen ordrer funnet
                  </td>
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

      {/* MODAL */}
      {isModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)} // Close if background clicked
        >
          <div
            className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg w-full max-w-md text-white"
            onClick={(e) => e.stopPropagation()} // Stop click from reaching the background
          >
            <h2 className="text-2xl font-bold mb-4">Oppdater ordrestatus</h2>

            {/* Full Order Info */}
            <div className="mb-6 text-sm text-gray-300 space-y-1">
              <p><span className="font-semibold text-white">Ordrenummer:</span> {selectedOrder.orderNumber}</p>
              <p><span className="font-semibold text-white">Kunde:</span> {selectedOrder.customerName}</p>
              <p><span className="font-semibold text-white">E-post:</span> {selectedOrder.email}</p>
              {selectedOrder.address && (
                <p>
                  <span className="font-semibold text-white">Adresse:</span>{" "}
                  {selectedOrder.address.line1}, {selectedOrder.address.postal_code} {selectedOrder.address.city}, {selectedOrder.address.country}
                </p>
              )}
              <p><span className="font-semibold text-white">Dato:</span> {selectedOrder.date}</p>
              <p><span className="font-semibold text-white">Total:</span> kr {selectedOrder.totalAmount},-</p>

              {/* List products */}
              <div className="mt-4">
                <p className="font-semibold text-white mb-1">Produkter:</p>
                <ul className="list-disc list-inside">
                  {selectedOrder.cart.map((item, index) => (
                    <li key={index}>
                      {item.title} ({item.quantity} stk)
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Status options */}
            <div className="mb-6">
              <label className="flex items-center mb-2">
                <input
                  type="radio"
                  value="Under behandling"
                  checked={newStatus === "Under behandling"}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mr-2"
                />
                Under behandling
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="Ferdig"
                  checked={newStatus === "Ferdig"}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="mr-2"
                />
                Ferdig
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 transition"
              >
                Avbryt
              </button>
              <button
                onClick={updateOrderStatus}
                className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-yellow-400 transition"
              >
                Lagre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderHistory;