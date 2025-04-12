import { Link } from "react-router-dom";
import "../styles/Navbar.css"; 

const Navbar = () => {
  return (
    <header className="navbar-container">
      <div className="logo">
        <img src="/images/Skjermbilde 2024-11-30 kl. 08.26.26.jpeg" alt="Logo" />
      </div>

      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/artists">Artists</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Navbar;