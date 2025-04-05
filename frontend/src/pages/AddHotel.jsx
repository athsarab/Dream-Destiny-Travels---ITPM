import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddHotel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    availableRooms: '',
    pricePerNight: '',
    roomType: '',
    contactNumber: '',
    status: 'available'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        availableRooms: Math.max(0, parseInt(formData.availableRooms) || 0),
        pricePerNight: Math.min(Math.max(0, parseFloat(formData.pricePerNight) || 0), 2500),
        roomType: formData.roomType,
        contactNumber: formData.contactNumber.trim(),
        status: 'available'
      };

      // Validation checks
      if (!cleanedData.name || !cleanedData.location || !cleanedData.roomType || !cleanedData.contactNumber) {
        alert('Please fill in all required fields');
        return;
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(cleanedData.contactNumber)) {
        alert('Contact number must be exactly 10 digits');
        return;
      }

      if (cleanedData.availableRooms < 0) {
        alert('Available rooms cannot be negative');
        return;
      }

      // Price validation
      if (parseFloat(cleanedData.pricePerNight) > 2500) {
        alert('Price per night cannot exceed $2,500');
        return;
      }

      if (cleanedData.pricePerNight <= 0) {
        alert('Price per night must be greater than 0');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/hotels', cleanedData);
      
      if (response.data) {
        alert('Hotel added successfully!');
        navigate('/employee-manager/hotels-list');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || 'Failed to add hotel';
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

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                min="0"
                value={formData.availableRooms}
                onChange={(e) => setFormData({...formData, availableRooms: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Price Per Night ($)</label>
              <input
                type="number"
                required
                min="0"
                max="2500"
                step="0.01"
                value={formData.pricePerNight}
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = parseFloat(value);
                  if (value === '') {
                    setFormData({...formData, pricePerNight: ''});
                  } else if (!isNaN(numValue)) {
                    if (numValue > 2500) {
                      alert('Price per night cannot exceed $2,500');
                      setFormData({...formData, pricePerNight: '2500'});
                    } else if (numValue < 0) {
                      alert('Price per night cannot be negative');
                      setFormData({...formData, pricePerNight: '0'});
                    } else {
                      setFormData({...formData, pricePerNight: value});
                    }
                  }
                }}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
                placeholder="Enter price (max: $2,500)"
              />
              <p className="text-sm text-red-400 mt-1">Maximum allowed price is $2,500</p>
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
                required
                pattern="[0-9]{10}"
                maxLength="10"
                placeholder="Enter 10 digit number"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              />
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

export default AddHotel;
