import React from 'react';
import { Link } from 'react-router-dom';

const PackageCard = ({ pkg }) => {
  // Add safety check at the beginning
  if (!pkg || !pkg._id) {
    return null; // Return nothing if package is invalid
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      {pkg.imageUrl && (
        <img 
          src={`http://localhost:5000${pkg.imageUrl}`} 
          alt={pkg.name} 
          className="w-full h-56 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-secondary-800 mb-2">{pkg.name}</h3>
        <p className="text-secondary-600 mb-4 line-clamp-2">{pkg.description}</p>
        <div className="space-y-2 mb-4">
          <p className="text-secondary-700 flex items-center">
            <span className="w-24 font-semibold">Duration:</span> 
            <span className="text-primary-600">{pkg.duration}</span>
          </p>
          <p className="text-secondary-700 flex items-center">
            <span className="w-24 font-semibold">Price:</span>
            <span className="text-accent font-bold">${pkg.price}</span>
          </p>
        </div>
        <Link 
          to={`/package/${pkg._id}`} 
          className="block w-full text-center bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          Explore Package
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;
