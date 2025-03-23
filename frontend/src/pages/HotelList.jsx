import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hotels');
      setHotels(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await axios.delete(`http://localhost:5000/api/hotels/${id}`);
        setHotels(hotels.filter(hotel => hotel._id !== id));
        alert('Hotel deleted successfully!');
      } catch (error) {
        alert('Failed to delete hotel');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              Hotels List
            </h1>
            <button
              onClick={() => navigate('/employee-manager/hotels')}
              className="bg-violet-500 text-white px-6 py-2 rounded-lg hover:bg-violet-600"
            >
              Add New Hotel
            </button>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <p className="text-white text-center">Loading hotels...</p>
            ) : (
              hotels.map(hotel => (
                <div key={hotel._id} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{hotel.name}</h3>
                      <p className="text-gray-300">Location: {hotel.location}</p>
                      <p className="text-gray-300">Available Rooms: {hotel.availableRooms}</p>
                      <p className="text-gray-300">Price per Night: ${hotel.pricePerNight}</p>
                      <p className="text-gray-300">Room Type: {hotel.roomType}</p>
                      <p className="text-gray-300">Contact: {hotel.contactNumber}</p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate(`/employee-manager/edit-hotel/${hotel._id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hotel._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelList;
