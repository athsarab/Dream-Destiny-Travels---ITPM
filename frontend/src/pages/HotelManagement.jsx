import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HotelManagement = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    availableRooms: '',
    roomTypes: [],
    roomPrices: {}, // Object will be populated when room types are selected
    facilities: [],
    contactNumber: '',
    status: 'available'
  });
  const [validationErrors, setValidationErrors] = useState({
    contactNumber: ''
  });

  // Updated room type options with their corresponding maximum prices
  const roomTypeOptions = [
    { value: 'single', label: 'Single', maxPrice: 750 },
    { value: 'double', label: 'Double', maxPrice: 900 },
    { value: 'suite', label: 'Suite', maxPrice: 1000 },
    { value: 'deluxe', label: 'Deluxe', maxPrice: 1500 },
    { value: 'family', label: 'Family Room', maxPrice: 1250 },
    { value: 'executive', label: 'Executive', maxPrice: 1750 }
  ];

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

  const handleRoomTypeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => {
      // If the value is already selected, remove it and its price
      if (prev.roomTypes.includes(value)) {
        const updatedRoomPrices = {...prev.roomPrices};
        delete updatedRoomPrices[value];
        
        return { 
          ...prev, 
          roomTypes: prev.roomTypes.filter(type => type !== value),
          roomPrices: updatedRoomPrices
        };
      } 
      // Important: Set empty string for price when adding a new room type
      return { 
        ...prev, 
        roomTypes: [...prev.roomTypes, value],
        roomPrices: {...prev.roomPrices, [value]: ''}
      };
    });
  };

  const handleRoomPriceChange = (roomType, price) => {
    // Find the maximum price for this room type
    const roomTypeOption = roomTypeOptions.find(opt => opt.value === roomType);
    const maxPrice = roomTypeOption ? roomTypeOption.maxPrice : 750;
    
    // Ensure price doesn't exceed maximum
    let validPrice = price;
    if (parseFloat(price) > maxPrice) {
      alert(`Price for ${roomTypeOption?.label || roomType} cannot exceed $${maxPrice}`);
      validPrice = maxPrice.toString();
    }
    
    setFormData(prev => ({
      ...prev,
      roomPrices: {
        ...prev.roomPrices,
        [roomType]: validPrice
      }
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

      // Check if all selected room types have valid prices
      const missingPrices = [];
      const exceedingMaxPrices = [];
      
      formData.roomTypes.forEach(type => {
        const price = formData.roomPrices[type];
        const roomTypeOption = roomTypeOptions.find(opt => opt.value === type);
        const maxPrice = roomTypeOption ? roomTypeOption.maxPrice : 750;
        
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
          missingPrices.push(type);
        } else if (parseFloat(price) > maxPrice) {
          exceedingMaxPrices.push({type, maxPrice, currentPrice: parseFloat(price)});
        }
      });
      
      if (missingPrices.length > 0) {
        const missingLabels = roomTypeOptions
          .filter(opt => missingPrices.includes(opt.value))
          .map(opt => opt.label)
          .join(', ');
        alert(`Please set valid prices for these room types: ${missingLabels}`);
        return;
      }
      
      if (exceedingMaxPrices.length > 0) {
        const errorMsg = exceedingMaxPrices.map(item => {
          const roomType = roomTypeOptions.find(opt => opt.value === item.type);
          return `${roomType?.label || item.type}: $${item.currentPrice} exceeds maximum of $${item.maxPrice}`;
        }).join('\n');
        
        alert(`Some prices exceed maximum allowed values:\n${errorMsg}`);
        return;
      }

      // Data validation
      const hotelData = {
        ...formData,
        availableRooms: parseInt(formData.availableRooms) || 0,
        // Convert string prices to numbers
        roomPrices: Object.fromEntries(
          Object.entries(formData.roomPrices).map(([key, value]) => [key, parseFloat(value)])
        )
      };

      if (!hotelData.name || !hotelData.location || hotelData.roomTypes.length === 0 || !hotelData.contactNumber) {
        alert('Please fill in all required fields and select at least one room type');
        return;
      }

      if (hotelData.availableRooms <= 0) {
        alert('Available rooms must be greater than 0');
        return;
      }

      console.log('Submitting hotel data:', hotelData);
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

  // Helper function to get the maximum price for a specific room type
  const getMaxPriceForRoomType = (roomType) => {
    const roomTypeOption = roomTypeOptions.find(opt => opt.value === roomType);
    return roomTypeOption ? roomTypeOption.maxPrice : 750;
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
              <label className="block text-gray-400 mb-2">Room Types (Select Multiple)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {roomTypeOptions.map(option => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`room-${option.value}`}
                      value={option.value}
                      checked={formData.roomTypes.includes(option.value)}
                      onChange={handleRoomTypeChange}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor={`room-${option.value}`} className="ml-2 text-sm font-medium text-gray-300">
                      {option.label} (Max: ${option.maxPrice})
                    </label>
                  </div>
                ))}
              </div>
              {formData.roomTypes.length === 0 && (
                <p className="mt-1 text-sm text-red-500">Please select at least one room type</p>
              )}
            </div>

            {/* Room type prices section */}
            {formData.roomTypes.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-4">Room Prices (per night)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.roomTypes.map(roomType => {
                    const option = roomTypeOptions.find(opt => opt.value === roomType);
                    const maxPrice = option?.maxPrice || 750;
                    return (
                      <div key={`price-${roomType}`} className="flex items-center">
                        <label className="w-1/3 text-gray-300">{option?.label || roomType}:</label>
                        <div className="w-2/3 relative">
                          <span className="absolute left-3 top-3 text-gray-400">$</span>
                          <input
                            type="number"
                            min="1"
                            max={maxPrice}
                            required
                            value={formData.roomPrices[roomType]}
                            onChange={(e) => handleRoomPriceChange(roomType, e.target.value)}
                            placeholder="0.00"
                            className="w-full p-3 pl-8 rounded-lg bg-gray-700/50 text-white border border-gray-600"
                          />
                          <p className="text-xs text-amber-400 mt-1">
                            Maximum: ${maxPrice}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
