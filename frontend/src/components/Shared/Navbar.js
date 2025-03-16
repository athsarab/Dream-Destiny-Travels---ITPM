import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 top-4">
      <div className="container mx-auto px-6">
        <div className="mx-4 bg-dark-200/30 backdrop-blur-sm rounded-2xl shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent group-hover:from-primary-500 group-hover:to-primary-700 transition-all duration-300">
                Dream Destiny
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-white/90 hover:text-primary-400 font-medium transition-colors duration-300">
                Home
              </Link>
              <Link to="/packages" className="text-white/90 hover:text-primary-400 font-medium transition-colors duration-300">
                Packages
              </Link>
              <Link to="/admin" className="px-4 py-2 bg-primary-600/80 hover:bg-primary-600 text-white rounded-full transition-all duration-300 backdrop-blur-sm">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
