import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-800 hover:text-primary transition-colors duration-300">
              Dream Destiny Travel
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors duration-300">
              Home
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-primary font-medium transition-colors duration-300">
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
