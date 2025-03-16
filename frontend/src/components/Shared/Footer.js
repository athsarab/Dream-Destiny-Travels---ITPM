import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Dream Destiny Travel Agency</h3>
            <p className="text-gray-400 leading-relaxed">
              Making your travel dreams come true. Your journey begins with us.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <p className="text-gray-400">
                <span className="block">Email: info@dreamdestiny.com</span>
                <span className="block">Phone: +1 234 567 8900</span>
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">&copy; 2025 Dream Destiny Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
