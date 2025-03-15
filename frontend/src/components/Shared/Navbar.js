import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="brand">
          <Link to="/" className="brand-link">Dream Destiny Travel</Link>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/admin" className="nav-link">Admin Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
