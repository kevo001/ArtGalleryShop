import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrderHistory from "./pages/AdminOrderHistory";
import AdminArtists from "./pages/AdminArtists";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Artists from "./pages/Artists";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/order-history" element={<AdminOrderHistory />} />
        <Route path="/admin/artists" element={<AdminArtists />} />
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/artists" element={<Artists />} />
      </Routes>
    </Router>
  );
}

export default App;
