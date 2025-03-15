import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PackagePage = () => {
  const [package_, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/packages/${id}`);
        setPackage(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch package details');
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!package_) return <div>Package not found</div>;

  return (
    <div className="package-details">
      <h1>{package_.name}</h1>
      {package_.imageUrl && (
        <img 
          src={package_.imageUrl} 
          alt={package_.name} 
          className="package-detail-image"
        />
      )}
      <div className="package-info">
        <p className="description">{package_.description}</p>
        <div className="details">
          <p><strong>Duration:</strong> {package_.duration}</p>
          <p><strong>Location:</strong> {package_.location}</p>
          <p><strong>Price:</strong> ${package_.price}</p>
          <p><strong>Max Participants:</strong> {package_.maxPax}</p>
        </div>
        <button 
          className="book-now-btn"
          onClick={() => alert('Booking functionality coming soon!')}
        >
          Book Now
        </button>
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Back to Packages
        </button>
      </div>
    </div>
  );
};

export default PackagePage;
