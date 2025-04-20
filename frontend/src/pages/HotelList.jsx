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

  const formatRoomDetails = (hotel) => {
    if (!hotel.roomPrices || Object.keys(hotel.roomPrices).length === 0) {
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
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          {hotel.roomTypes && hotel.roomTypes.map((type) => {
            const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
            let quantity = 0;
            if (hotel.roomQuantities && hotel.roomQuantities[type]) {
              quantity = hotel.roomQuantities[type];
            }
            
            return (
              <div key={type} className="bg-gray-700/30 p-2 rounded border border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">{formattedType}</span>
                  <span className="text-gray-300">${hotel.roomPrices[type] || 'N/A'}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Quantity: {quantity} rooms
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-right">
          <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-sm">
            Total Rooms: {hotel.availableRooms}
          </span>
        </div>
      </div>
    );
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(18);
    doc.text('Hotel Details Report', 20, yPos);
    doc.setFontSize(12);
    yPos += 20;

    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 20;

    hotels.forEach((hotel, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text(`Hotel ${index + 1}: ${hotel.name}`, 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Location: ${hotel.location}`, 30, yPos); yPos += 8;
      doc.text(`Contact Number: ${hotel.contactNumber}`, 30, yPos); yPos += 8;
      doc.text(`Total Available Rooms: ${hotel.availableRooms}`, 30, yPos); yPos += 12;
      
      doc.text('Room Details:', 30, yPos); yPos += 8;
      
      if (hotel.roomTypes && hotel.roomPrices) {
        doc.setFillColor(240, 240, 240);
        doc.rect(30, yPos - 5, 150, 10, 'F');
        doc.setTextColor(0, 0, 0);
        doc.text('Room Type', 35, yPos);
        doc.text('Price per Night', 85, yPos);
        doc.text('Quantity', 140, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 8;
        
        hotel.roomTypes.forEach(type => {
          const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
          let quantity = 0;
          if (hotel.roomQuantities && hotel.roomQuantities[type]) {
            quantity = hotel.roomQuantities[type];
          }
          
          doc.text(formattedType, 35, yPos);
          doc.text(`$${hotel.roomPrices[type] || 'N/A'}`, 85, yPos);
          doc.text(`${quantity}`, 140, yPos);
          yPos += 8;
        });
      } else if (hotel.roomType) {
        doc.text(`${hotel.roomType}: $${hotel.pricePerNight || 'N/A'} (Quantity: ${hotel.availableRooms || 0})`, 40, yPos);
        yPos += 8;
      }
      
      doc.text(`Status: ${hotel.status}`, 30, yPos); yPos += 15;
    });

    doc.save('hotel-details.pdf');
  };

  const filteredHotels = hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <div className="w-full">
                      <h3 className="text-xl font-semibold text-white mb-2">{hotel.name}</h3>
                      <div className="flex justify-between mb-4">
                        <p className="text-gray-300">Location: {hotel.location}</p>
                        <p className="text-gray-300">Contact: {hotel.contactNumber}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 mb-3">
                        <p className="font-medium text-white mb-2">Room Details:</p>
                        {formatRoomDetails(hotel)}
                      </div>
                    </div>
                    <div className="flex gap-4 ml-4">
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
