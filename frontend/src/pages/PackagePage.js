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
    <div className="min-h-screen bg-dark-100 text-white p-6">
      <div className="max-w-4xl mx-auto bg-dark-200 rounded-xl shadow-lg overflow-hidden">
        <h1 className="text-3xl font-bold p-6 border-b border-dark-300">{package_.name}</h1>
        {package_.imageUrl && (
          <img 
            src={`http://localhost:5000${package_.imageUrl}`} 
            alt={package_.name} 
            className="w-full h-96 object-cover"
          />
        )}
        <div className="p-6">
          <p className="text-dark-500 mb-6">{package_.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p className="text-dark-500"><span className="text-white font-bold">Duration:</span> {package_.duration}</p>
            <p className="text-dark-500"><span className="text-white font-bold">Location:</span> {package_.location}</p>
            <p className="text-dark-500"><span className="text-white font-bold">Price:</span> <span className="text-accent">${package_.price}</span></p>
            <p className="text-dark-500"><span className="text-white font-bold">Max Participants:</span> {package_.maxPax}</p>
          </div>
          <div className="flex space-x-4">
            <button 
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
              onClick={() => alert('Booking functionality coming soon!')}
            >
              Book Now
            </button>
            <button 
              className="flex-1 bg-dark-300 text-white py-3 rounded-lg hover:bg-dark-400 transition-colors"
              onClick={() => navigate(-1)}
            >
              Back to Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePage;
