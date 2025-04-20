import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Define room type options with their corresponding maximum prices
  const roomTypeOptions = [
    { value: 'single', label: 'Single', maxPrice: 750 },
    { value: 'double', label: 'Double', maxPrice: 900 },
    { value: 'suite', label: 'Suite', maxPrice: 1000 },
    { value: 'deluxe', label: 'Deluxe', maxPrice: 1500 },
    { value: 'family', label: 'Family Room', maxPrice: 1250 },
    { value: 'executive', label: 'Executive', maxPrice: 1750 }
  ];
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    roomTypes: [],
    roomPrices: {},
    roomQuantities: {},
    contactNumber: '',
    status: 'available'
  });

  const [validationErrors, setValidationErrors] = useState({
    contactNumber: ''
  });

  const validateField = (name, value) => {
    if (name === 'contactNumber') {
      const phoneRegex = /^\d{10}$/;
      return !phoneRegex.test(value)
        ? 'Contact number must be exactly 10 digits'
        : '';
    }
    return '';
  };

  useEffect(() => {
    fetchHotelData();
  }, [id]);

  const fetchHotelData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`http://localhost:5000/api/hotels/${id}`);

      let roomTypes = [];
      if (Array.isArray(response.data.roomTypes)) {
        roomTypes = [...response.data.roomTypes];
      } else if (response.data.roomType) {
        roomTypes = [response.data.roomType];
      }

      let roomPrices = {};
      if (response.data.roomPrices && typeof response.data.roomPrices === 'object') {
        roomPrices = { ...response.data.roomPrices };
      } else if (response.data.roomType && response.data.pricePerNight) {
        roomPrices[response.data.roomType] = response.data.pricePerNight;
      }

      roomTypes.forEach(type => {
        if (!roomPrices[type] || roomPrices[type] === '') {
          roomPrices[type] = '100';
        }
      });

      let roomQuantities = {};
      if (response.data.roomQuantities && typeof response.data.roomQuantities === 'object') {
        roomQuantities = { ...response.data.roomQuantities };
      } else {
        // Default quantity of 0 for each room type if not specified
        roomTypes.forEach(type => {
          roomQuantities[type] = '0';
        });
      }

      const formattedData = {
        name: response.data.name || '',
        location: response.data.location || '',
        availableRooms: response.data.availableRooms?.toString() || '0',
        roomTypes,
        roomPrices,
        roomQuantities,
        contactNumber: response.data.contactNumber || '',
        status: response.data.status || 'available'
      };

      setFormData(formattedData);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch hotel details'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoomTypeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => {
      if (prev.roomTypes.includes(value)) {
        const updatedRoomPrices = { ...prev.roomPrices };
        const updatedRoomQuantities = { ...prev.roomQuantities };
        delete updatedRoomPrices[value];
        delete updatedRoomQuantities[value];
        return {
          ...prev,
          roomTypes: prev.roomTypes.filter(type => type !== value),
          roomPrices: updatedRoomPrices,
          roomQuantities: updatedRoomQuantities
        };
      } else {
        return {
          ...prev,
          roomTypes: [...prev.roomTypes, value],
          roomPrices: {
            ...prev.roomPrices,
            [value]: ''
          },
          roomQuantities: {
            ...prev.roomQuantities,
            [value]: '0'
          }
        };
      }
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

  const handleRoomQuantityChange = (roomType, quantity) => {
    // Ensure quantity is non-negative
    let validQuantity = quantity;
    if (parseInt(quantity) < 0) {
      validQuantity = '0';
    }
    
    setFormData(prev => ({
      ...prev,
      roomQuantities: {
        ...prev.roomQuantities,
        [roomType]: validQuantity
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.contactNumber)) {
        setValidationErrors(prev => ({
          ...prev,
          contactNumber: 'Contact number must be exactly 10 digits'
        }));
        return;
      }

      if (formData.roomTypes.length === 0) {
        alert('Please select at least one room type');
        return;
      }

      if (!formData.name.trim() || !formData.location.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      const validRoomPrices = {};
      const missingPrices = [];
      const exceedingMaxPrices = [];

      formData.roomTypes.forEach((type) => {
        const price = formData.roomPrices[type];
        const roomTypeOption = roomTypeOptions.find(opt => opt.value === type);
        const maxPrice = roomTypeOption ? roomTypeOption.maxPrice : 750;
        
        if (!price || isNaN(price) || parseFloat(price) <= 0) {
          missingPrices.push(type);
        } else if (parseFloat(price) > maxPrice) {
          exceedingMaxPrices.push({type, maxPrice, currentPrice: parseFloat(price)});
        } else {
          validRoomPrices[type] = parseFloat(price);
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

      // Validate room quantities
      const validRoomQuantities = {};
      const missingQuantities = [];

      formData.roomTypes.forEach((type) => {
        const quantity = formData.roomQuantities[type];
        
        if (quantity === undefined || quantity === '' || parseInt(quantity) < 0) {
          missingQuantities.push(type);
        } else {
          validRoomQuantities[type] = parseInt(quantity);
        }
      });

      if (missingQuantities.length > 0) {
        const missingLabels = roomTypeOptions
          .filter(opt => missingQuantities.includes(opt.value))
          .map(opt => opt.label)
          .join(', ');
        alert(`Please set valid quantities for these room types: ${missingLabels}`);
        return;
      }

      // Calculate total rooms
      const totalRooms = Object.values(validRoomQuantities).reduce(
        (sum, qty) => sum + parseInt(qty), 0
      );

      const submitData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        availableRooms: totalRooms, // This is calculated as the sum of all room quantities
        roomTypes: formData.roomTypes,
        roomPrices: validRoomPrices,
        roomQuantities: validRoomQuantities,
        contactNumber: formData.contactNumber.trim(),
        status: formData.status || 'available'
      };

      await axios.put(
        `http://localhost:5000/api/hotels/${id}`,
        submitData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      alert('Hotel updated successfully!');
      navigate('/employee-manager/hotels-list');
    } catch (error) {
      let errorMessage = 'Failed to update hotel. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      alert(errorMessage);
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
          <p className="text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate('/employee-manager/hotels-list')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Hotel List
          </button>
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
              <label className="block text-gray-400 mb-2">Hotel Contact No</label>
              <input
                type="tel"
                name="contactNumber"
                required
                pattern="\d{10}"
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

            {/* Room Prices and Quantities Section */}
            {formData.roomTypes.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-4">Room Details</label>
                <div className="grid grid-cols-1 gap-4">
                  {formData.roomTypes.map(roomType => {
                    const option = roomTypeOptions.find(opt => opt.value === roomType);
                    const maxPrice = option?.maxPrice || 750;
                    return (
                      <div key={`room-details-${roomType}`} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                        <h3 className="text-white font-medium mb-3">{option?.label || roomType}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-400 mb-2">Price per Night</label>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-400">$</span>
                              <input
                                type="number"
                                min="1"
                                max={maxPrice}
                                required
                                value={formData.roomPrices[roomType] || ''}
                                onChange={(e) => handleRoomPriceChange(roomType, e.target.value)}
                                className="w-full p-3 pl-8 rounded-lg bg-gray-700/50 text-white border border-gray-600"
                              />
                              <p className="text-xs text-amber-400 mt-1">
                                Maximum: ${maxPrice}
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="block text-gray-400 mb-2">Quantity Available</label>
                            <input
                              type="number"
                              min="0"
                              required
                              value={formData.roomQuantities[roomType] || '0'}
                              onChange={(e) => handleRoomQuantityChange(roomType, e.target.value)}
                              className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Summary section showing total rooms */}
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 mt-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-medium">Total Available Rooms:</h3>
                      <span className="text-lg font-bold text-white">
                        {Object.values(formData.roomQuantities).reduce(
                          (sum, qty) => sum + (parseInt(qty) || 0), 0
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      This is calculated automatically as the sum of all room quantities
                    </p>
                  </div>
                </div>
              </div>
            )}

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
