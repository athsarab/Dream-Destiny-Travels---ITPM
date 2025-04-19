import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Update PDF generation to include room quantities
  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Add title
    doc.setFontSize(18);
    doc.text('Hotel Details Report', 20, yPos);
    doc.setFontSize(12);
    yPos += 20;

    // Add date
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 20;

    // Add hotel details
    hotels.forEach((hotel, index) => {
      // Add new page if needed
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text(`Hotel ${index + 1}:`, 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Name: ${hotel.name}`, 30, yPos); yPos += 8;
      doc.text(`Location: ${hotel.location}`, 30, yPos); yPos += 8;
      doc.text(`Available Rooms: ${hotel.availableRooms}`, 30, yPos); yPos += 8;
      
      // Room types, prices, and quantities
      doc.text('Room Types, Prices & Quantities:', 30, yPos); yPos += 8;
      if (hotel.roomTypes && hotel.roomPrices) {
        hotel.roomTypes.forEach(type => {
          doc.text(`  - ${type}: $${hotel.roomPrices[type] || 'N/A'} (Quantity: ${hotel.roomQuantities?.[type] || 0})`, 40, yPos); 
          yPos += 8;
        });
      } else if (hotel.roomType) {
        // Fallback for legacy data
        doc.text(`  - ${hotel.roomType}: $${hotel.pricePerNight || 'N/A'} (Quantity: ${hotel.availableRooms || 0})`, 40, yPos);
        yPos += 8;
      }
      
      doc.text(`Contact Number: ${hotel.contactNumber}`, 30, yPos); yPos += 8;
      doc.text(`Status: ${hotel.status}`, 30, yPos); yPos += 15;
    });

    // Save PDF
    doc.save('hotel-details.pdf');
  };

  // Add filtered hotels logic
  const filteredHotels = hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // This function formats room details for display
  const formatRoomPrices = (hotel) => {
    if (!hotel.roomPrices || Object.keys(hotel.roomPrices).length === 0) {
      // Handle legacy data
      if (hotel.roomType && hotel.pricePerNight) {
        return (
          <div className="space-y-1">
            <div>{hotel.roomType}: ${hotel.pricePerNight} (Qty: {hotel.availableRooms || 0})</div>
          </div>
        );
      }
      return 'No details available';
    }
    
    return (
      <div className="space-y-1">
        {hotel.roomTypes && hotel.roomTypes.map((type) => (
          <div key={type} className="flex items-center justify-between">
            <span className="capitalize">{type}:</span> 
            <span>
              <span className="font-medium">${hotel.roomPrices[type] || 'N/A'}</span>
              <span className="ml-2 text-gray-400">(Qty: {hotel.roomQuantities?.[type] || 0})</span>
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent mb-2">
                Hotels List
              </h1>
              <p className="text-gray-400">View and manage all registered hotels</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={generatePDF}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Download PDF
              </button>
              <button
                onClick={() => navigate('/employee-manager/hotels')}
                className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-violet-600 hover:to-purple-700"
              >
                Add New Hotel
              </button>
            </div>
          </div>

          {/* Add Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by hotel name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid gap-6">
            {loading ? (
              <p className="text-white text-center">Loading hotels...</p>
            ) : filteredHotels.length === 0 ? (
              <p className="text-white text-center">No hotels found</p>
            ) : (
              filteredHotels.map(hotel => (
                <div key={hotel._id} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{hotel.name}</h3>
                      <p className="text-gray-300">Location: {hotel.location}</p>
                      <p className="text-gray-300">Available Rooms: {hotel.availableRooms}</p>
                      <div className="text-gray-300 mt-2">
                        <p className="font-medium mb-1">Room Types & Prices:</p>
                        {formatRoomPrices(hotel)}
                      </div>
                      <p className="text-gray-300 mt-2">Contact: {hotel.contactNumber}</p>
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
