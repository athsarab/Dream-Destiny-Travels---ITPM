import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HotelManagement = () => {
  const navigate = useNavigate();
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
  const [validationErrors, setValidationErrors] = useState({
    contactNumber: ''
  });

  const validateField = (name, value) => {
    if (name === 'contactNumber') {
      const phoneRegex = /^\d{10}$/;
      return !phoneRegex.test(value) ? 
        'Contact number must be exactly 10 digits' : '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    setValidationErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Phone number validation
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.contactNumber)) {
        setValidationErrors(prev => ({
          ...prev,
          contactNumber: 'Contact number must be exactly 10 digits'
        }));
        return;
      }

      // Data validation
      const hotelData = {
        ...formData,
        availableRooms: parseInt(formData.availableRooms) || 0,
        pricePerNight: parseFloat(formData.pricePerNight) || 0,
        facilities: Array.isArray(formData.facilities) ? formData.facilities : []
      };

      if (!hotelData.name || !hotelData.location || !hotelData.roomType || !hotelData.contactNumber) {
        alert('Please fill in all required fields');
        return;
      }

      if (hotelData.availableRooms <= 0) {
        alert('Available rooms must be greater than 0');
        return;
      }

      if (hotelData.pricePerNight <= 0) {
        alert('Price per night must be greater than 0');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/hotels', hotelData);

      if (response.data) {
        alert('Hotel added successfully!');
        navigate('/employee-manager/hotels-list');
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add hotel. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              Add New Hotel
            </h1>
          </div>

          {/* Add Hotel Form */}
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
              <label className="block text-gray-400 mb-2">Hotel Contact No</label>
              <input
                type="text"
                name="contactNumber"
                required
                pattern="\d{10}"
                placeholder="Enter 10 digit contact number"
                value={formData.contactNumber}
                onChange={handleChange}
                maxLength="10"
                className={`w-full p-3 rounded-lg bg-gray-700/50 text-white border ${
                  validationErrors.contactNumber ? 'border-red-500' : 'border-gray-600'
                } focus:border-pink-500 focus:ring-2 focus:ring-pink-500`}
              />
              {validationErrors.contactNumber && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.contactNumber}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-lg hover:from-violet-600 hover:to-purple-700"
              >
                Add Hotel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelManagement;
