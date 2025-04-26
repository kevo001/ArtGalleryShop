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
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import OrderSummary from "./pages/OrderSummary";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function Layout() {
  const location = useLocation();
  const hideNavbar = /^\/admin/i.test(location.pathname); // Regex to check if the path starts with "/admin"

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/admin" element={<ProtectedAdminRoute> <AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/products" element={<ProtectedAdminRoute> <AdminProducts /></ProtectedAdminRoute>} />
        <Route path="/admin/order-history" element={<ProtectedAdminRoute> <AdminOrderHistory /></ProtectedAdminRoute>} />
        <Route path="/admin/artists" element={<ProtectedAdminRoute> <AdminArtists /></ProtectedAdminRoute>} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/" element={<Home />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
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