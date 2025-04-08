import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import AdminOrderHistory from "./pages/AdminOrderHistory";
import AdminArtists from "./pages/AdminArtists";
import OrderSummary from "./pages/OrderSummary";

function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin", "/Admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orderHistory" element={<AdminOrderHistory />} />
        <Route path="/admin/artists" element={<AdminArtists />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/order-summary" element={<OrderSummary />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;