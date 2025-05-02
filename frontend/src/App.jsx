// src/App.jsx
import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import Navbar            from "./components/Navbar";
import AdminDashboard    from "./pages/AdminDashboard";
import AdminProducts     from "./pages/AdminProducts";
import AdminOrderHistory from "./pages/AdminOrderHistory";
import AdminArtists      from "./pages/AdminArtists";
import Shop              from "./pages/Shop";
import Home              from "./pages/Home";
import Artists           from "./pages/Artists";
import OrderSummary      from "./pages/OrderSummary";
import ContactPage       from "./pages/Contact";
import Success           from "./pages/Success";
import Login             from "./pages/Login";
import ArtistPage        from "./pages/ArtistPage";

import { useAuth } from "./context/AuthContext";

/* ---------- guards ---------- */

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user } = useAuth();

  if (user === null) return null;                        // still boot-strapping
  if (!user)        return <Navigate to="/login" replace />; // not logged-in
  if (requireAdmin && !user.isAdmin)
    return <Navigate to="/" replace />;                  // not an admin

  return <Outlet />;                                     // ✅ allowed through
};

/* ---------- wrappers ---------- */

function PublicLayout() {
  const { pathname } = useLocation();
  const hideNavbar = pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
}

/* ---------- router ---------- */

export default function App() {
  return (
    <Routes>
      {/* login */}
      <Route path="/login" element={<Login />} />

      {/* everything else */}
      <Route element={<PublicLayout />}>
        {/* ---------- ADMIN ---------- */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin">
            <Route index           element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="artists"  element={<AdminArtists />} />
            <Route path="order-history"   element={<AdminOrderHistory />} />
          </Route>
        </Route>

        {/* ---------- PUBLIC ---------- */}
        <Route path="/"              element={<Home />} />
        <Route path="/shop"          element={<Shop />} />
        <Route path="/artists"       element={<Artists />} />
        <Route path="/artists/:id"   element={<ArtistPage />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/contact"       element={<ContactPage />} />
        <Route path="/success"       element={<Success />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
