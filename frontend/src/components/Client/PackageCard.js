import React from 'react';
import { Link } from 'react-router-dom';

const PackageCard = ({ package: pkg }) => {
  return (
    <div className="package-card">
      {pkg.imageUrl && (
        <img src={pkg.imageUrl} alt={pkg.name} className="package-image" />
      )}
      <div className="package-content">
        <h3 className="package-title">{pkg.name}</h3>
        <p className="package-description">{pkg.description.substring(0, 100)}...</p>
        <div className="package-details">
          <span className="package-duration">Duration: {pkg.duration}</span>
          <span className="package-price">Price: ${pkg.price}</span>
        </div>
        <Link 
          to={`/package/${pkg._id}`} 
          className="btn btn-primary view-details-btn"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;
