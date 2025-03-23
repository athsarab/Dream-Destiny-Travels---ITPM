import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    availableRooms: '',
    pricePerNight: '',
    roomType: '',
    facilities: [],
    contactNumber: '',
    status: 'available'
  });

  // Add validation state
  const [validationErrors, setValidationErrors] = useState({
    contactNumber: ''
  });

  // Add validation function
  const validateField = (name, value) => {
    if (name === 'contactNumber') {
      const phoneRegex = /^\d{10}$/;
      return !phoneRegex.test(value) ? 
        'Contact number must be exactly 10 digits' : '';
    }
    return '';
  };

  useEffect(() => {
    if (!id) {
      setError('No hotel ID provided');
      return;
    }
    fetchHotelData();
  }, [id]);

  const fetchHotelData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching hotel with ID:', id);

      const response = await axios.get(`http://localhost:5000/api/hotels/${id}`);
      console.log('Received hotel data:', response.data);

      if (!response.data) {
        throw new Error('No hotel data received');
      }

      // Explicitly cast numeric values to strings for form inputs
      setFormData({
        name: response.data.name || '',
        location: response.data.location || '',
        availableRooms: String(response.data.availableRooms || ''),
        pricePerNight: String(response.data.pricePerNight || ''),
        roomType: response.data.roomType || '',
        facilities: response.data.facilities || [],
        contactNumber: response.data.contactNumber || '',
        status: response.data.status || 'available'
      });
    } catch (error) {
      console.error('Error details:', error.response || error);
      setError(error.response?.data?.message || 'Failed to fetch hotel details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Phone validation
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.contactNumber)) {
        setValidationErrors(prev => ({
          ...prev,
          contactNumber: 'Contact number must be exactly 10 digits'
        }));
        return;
      }

      // Input validation
      if (!formData.name || !formData.location || !formData.roomType || !formData.contactNumber) {
        alert('Please fill in all required fields');
        return;
      }

      // Data preparation
      const updateData = {
        ...formData,
        availableRooms: parseInt(formData.availableRooms) || 0,
        pricePerNight: parseFloat(formData.pricePerNight) || 0,
      };

      console.log('Sending update data:', updateData);

      const response = await axios.put(`http://localhost:5000/api/hotels/${id}`, updateData);
      console.log('Update response:', response.data);

      alert('Hotel updated successfully!');
      navigate('/employee-manager/hotels-list');
    } catch (error) {
      console.error('Update error:', error.response || error);
      alert(error.response?.data?.message || 'Failed to update hotel');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
        <div className="max-w-7xl mx-auto text-white text-center">
          Loading hotel details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
        <div className="max-w-7xl mx-auto text-red-500 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              Edit Hotel
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div>
              <label className="block text-gray-400 mb-2">Hotel Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Available Rooms</label>
              <input
                type="number"
                required
                value={formData.availableRooms}
                onChange={(e) => setFormData({...formData, availableRooms: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Price Per Night</label>
              <input
                type="number"
                required
                value={formData.pricePerNight}
                onChange={(e) => setFormData({...formData, pricePerNight: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Room Type</label>
              <select
                required
                value={formData.roomType}
                onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              >
                <option value="">Select Room Type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                required
                placeholder="Enter 10 digit contact number"
                value={formData.contactNumber}
                onChange={(e) => {
                  setFormData({...formData, contactNumber: e.target.value});
                  setValidationErrors(prev => ({
                    ...prev,
                    contactNumber: validateField('contactNumber', e.target.value)
                  }));
                }}
                className={`w-full p-3 rounded-lg bg-gray-700/50 text-white border ${
                  validationErrors.contactNumber ? 'border-red-500' : 'border-gray-600'
                } focus:border-pink-500 focus:ring-2 focus:ring-pink-500`}
              />
              {validationErrors.contactNumber && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.contactNumber}</p>
              )}
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-lg hover:from-violet-600 hover:to-purple-700"
              >
                Update Hotel
              </button>
              <button
                type="button"
                onClick={() => navigate('/employee-manager/hotels-list')}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditHotel;
