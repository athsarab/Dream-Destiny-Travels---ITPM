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
      // ...existing validation code...

      const response = await axios.post('http://localhost:5000/api/hotels', formData);

      if (response.data) {
        alert('Hotel added successfully!');
        navigate('/employee-manager/hotels-list');
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert(error.response?.data?.message || 'Failed to add hotel');
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

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ...existing form fields... */}
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
