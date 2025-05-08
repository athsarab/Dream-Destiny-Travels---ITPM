import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PackageBookingForm from '../components/Client/PackageBookingForm';
import WeatherAlert from '../components/Weather/WeatherAlert';

const PackagePage = () => {
  const [package_, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await api.getPackage(id); // Changed from getPackageById to getPackage
        setPackage(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching package:', error);
        setError('Failed to fetch package details');
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleBooking = async (bookingData) => {
    try {
      setShowBookingForm(false); // Close form first
      navigate('/', { state: { message: 'Booking submitted successfully!' } });
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!package_) return <div>Package not found</div>;

  return (
    <div className="bg-dark-100 text-white p-6 pt-24 min-h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-dark-200 rounded-xl shadow-lg overflow-hidden mb-6">
        <h1 className="text-3xl font-bold p-6 border-b border-dark-300">{package_.name}</h1>
        
        {/* Add Weather Alert */}
        {package_ && package_.location && (
          <div className="px-6 pt-4">
            <WeatherAlert 
              location={package_.location} 
              travelDate={new Date()}  // Default to current date for package display
            />
          </div>
        )}
        
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
              onClick={() => setShowBookingForm(true)}
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
          {showBookingForm && (
            <PackageBookingForm
              packageDetails={package_}
              onSubmit={handleBooking}
              onCancel={() => setShowBookingForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PackagePage;
