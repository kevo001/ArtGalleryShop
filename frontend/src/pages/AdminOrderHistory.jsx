import React, { useEffect, useState } from "react";

const AdminOrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) =>
        console.error("Error fetching order history:", error)
      );
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders((prev) =>
          prev.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      }
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#444] to-[#2F2F2F] text-center py-10 shadow-lg">
        <h1 className="text-4xl font-bold text-white">Order History</h1>
        <p className="text-gray-300 mt-2">Overvåk og oppdater kundens ordrer</p>
      </header>

      {/* ORDER TABLE */}
      <div className="flex justify-center mt-10 px-4">
      <div className="bg-[#2A2A2A] rounded-lg overflow-x-auto w-full max-w-[100vw] xl:max-w-[1800px] shadow-lg">
          <table className="w-full text-left table-auto">
            <thead className="bg-[#333] text-white">
              <tr>
                <th className="py-4 px-6 border-b border-[#444]">Order Number</th>
                <th className="py-4 px-6 border-b border-[#444]">Customer</th>
                <th className="py-4 px-6 border-b border-[#444]">Email</th>
                <th className="py-4 px-6 border-b border-[#444]">Address</th>
                <th className="py-4 px-6 border-b border-[#444]">Items</th>
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
                    <td className="py-4 px-6 border-b border-[#444]">{order.email}</td>
                    <td className="py-4 px-6 border-b border-[#444]">
                      {order.address?.line1
                        ? `${order.address.line1}, ${order.address.postal_code} ${order.address.city}, ${order.address.country}`
                        : <span className="text-gray-400 italic">Ingen adresse</span>}
                    </td>
                    <td className="py-4 px-6 border-b border-[#444]">
                      {order.cart && order.cart.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {order.cart.map((item, index) => (
                            <li key={index}>
                              {item.title} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic">Ingen produkter</span>
                      )}
                    </td>
                    <td className="py-4 px-6 border-b border-[#444]">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className="bg-[#2A2A2A] border border-[#555] rounded px-2 py-1 text-white"
                      >
                        <option value="Under behandling">Under behandling</option>
                        <option value="Ferdig">Ferdig</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 border-b border-[#444]">{order.date}</td>
                    <td className="py-4 px-6 border-b border-[#444]">
                      kr {order.totalAmount?.toLocaleString("no-NO")},-
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-400">Ingen ordrer funnet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderHistory;
