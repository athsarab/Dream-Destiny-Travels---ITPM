import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-dark-100 to-dark-200 py-12 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-4">
              Dream Destiny Travel
            </h3>
            <p className="text-gray-400 pr-4">
              Discover amazing destinations and create unforgettable memories with our carefully curated travel experiences.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">Home</Link>
              <Link to="/packages" className="text-gray-400 hover:text-primary-400 transition-colors">Packages</Link>
              <Link to="/custom-package" className="text-gray-400 hover:text-primary-400 transition-colors">Custom Package</Link>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <p className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                info@dreamdestiny.com
              </p>
              <p className="text-gray-400 hover:text-primary-400 transition-colors flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                +94 717325275
              </p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-dark-300/30 pt-8 mt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Dream Destiny Travel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
