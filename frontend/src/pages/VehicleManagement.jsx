import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const VehicleManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Vehicle type and model mapping
  const vehicleModels = {
    car: ['Honda Fit', 'Suzuki Alto', 'Wagon R'],
    van: ['Toyota Hiace', 'Suzuki Every'],
    jeep: ['Toyota Prado', 'Pajero'],
    'tuk-tuk': ['Bajaj RE', 'TVS King'],
    motorcycle: ['Honda DIIO', 'Yamaha RayZR', 'Hero Pleasure']
  };
  
  const [formData, setFormData] = useState({
    vehicleId: '',
    type: '',
    model: '',
    seats: '',
    licenseInsuranceUpdated: '',
    licenseInsuranceExpiry: '',
    status: 'available',
    fuelType: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    vehicleId: '',
    type: '',
    model: '',
    fuelType: ''
  });
  
  // Available models based on selected type
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchVehicleData();
    }
  }, [id]);
  
  // Update available models when vehicle type changes
  useEffect(() => {
    if (formData.type) {
      setAvailableModels(vehicleModels[formData.type] || []);
      // Reset model if changing to a type that doesn't include current model
      if (!vehicleModels[formData.type]?.includes(formData.model)) {
        setFormData(prev => ({...prev, model: ''}));
      }
    } else {
      setAvailableModels([]);
      setFormData(prev => ({...prev, model: ''}));
    }
  }, [formData.type]);

  const fetchVehicleData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
      const vehicle = response.data;
      
      // Set form data with fetched vehicle
      setFormData({
        vehicleId: vehicle.vehicleId,
        type: vehicle.type,
        model: vehicle.model,
        seats: vehicle.seats,
        licenseInsuranceUpdated: vehicle.licenseInsuranceUpdated.split('T')[0],
        licenseInsuranceExpiry: vehicle.licenseInsuranceExpiry.split('T')[0],
        status: vehicle.status,
        fuelType: vehicle.fuelType
      });
      
      // Ensure available models are set based on the type
      if (vehicle.type) {
        setAvailableModels(vehicleModels[vehicle.type] || []);
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      alert('Failed to fetch vehicle details');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.vehicleId) errors.vehicleId = 'Vehicle ID is required';
    if (!formData.type) errors.type = 'Vehicle type is required';
    if (!formData.model) errors.model = 'Vehicle model is required';
    if (!formData.seats || formData.seats < 1) errors.seats = 'Valid number of seats is required';
    if (!formData.fuelType) errors.fuelType = 'Fuel type is required';
    if (!formData.licenseInsuranceUpdated) errors.licenseInsuranceUpdated = 'License update date is required';
    if (!formData.licenseInsuranceExpiry) errors.licenseInsuranceExpiry = 'License expiry date is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!validateForm()) {
        alert('Please fill in all required fields correctly');
        return;
      }

      const vehicleData = {
        vehicleId: formData.vehicleId,
        type: formData.type,
        model: formData.model,
        seats: Number(formData.seats),
        licenseInsuranceUpdated: formData.licenseInsuranceUpdated,
        licenseInsuranceExpiry: formData.licenseInsuranceExpiry,
        fuelType: formData.fuelType,
        status: formData.status || 'available'
      };

      let response;
      if (isEditing) {
        // Update existing vehicle
        response = await axios.put(`http://localhost:5000/api/vehicles/${id}`, vehicleData);
        alert('Vehicle updated successfully!');
      } else {
        // Add new vehicle
        response = await axios.post('http://localhost:5000/api/vehicles', vehicleData);
        alert('Vehicle added successfully!');
      }

      navigate('/employee-manager/vehicles-list');
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} vehicle`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div>
              <label className="block text-gray-400 mb-2">Vehicle ID</label>
              <input
                type="text"
                required
                value={formData.vehicleId}
                onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              />
              {validationErrors.vehicleId && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.vehicleId}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Vehicle Type</label>
              <select
                required
                value={formData.type}
                onChange={(e) => {
                  setFormData({...formData, type: e.target.value, model: ''});
                  setValidationErrors(prev => ({...prev, type: '', model: ''}));
                }}
                className={`w-full p-3 rounded-lg bg-gray-700/50 text-white border ${
                  validationErrors.type ? 'border-red-500' : 'border-gray-600'
                }`}
              >
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="van">Van</option>
                <option value="jeep">Jeep</option>
                <option value="tuk-tuk">Tuk-Tuk</option>
                <option value="motorcycle">Motorcycle</option>
              </select>
              {validationErrors.type && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.type}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Vehicle Model</label>
              <select
                required
                value={formData.model}
                onChange={(e) => {
                  setFormData({...formData, model: e.target.value});
                  setValidationErrors(prev => ({...prev, model: ''}));
                }}
                disabled={!formData.type}
                className={`w-full p-3 rounded-lg bg-gray-700/50 text-white border ${
                  validationErrors.model ? 'border-red-500' : 'border-gray-600'
                } ${!formData.type ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <option value="">Select Vehicle Model</option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              {validationErrors.model && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.model}</p>
              )}
              {!formData.type && (
                <p className="mt-1 text-sm text-amber-400">Please select a vehicle type first</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Number of Seats</label>
              <input
                type="number"
                required
                min="1"
                value={formData.seats}
                onChange={(e) => setFormData({...formData, seats: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">License Insurance Last Updated</label>
              <input
                type="date"
                required
                value={formData.licenseInsuranceUpdated}
                onChange={(e) => setFormData({...formData, licenseInsuranceUpdated: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">License Insurance Expiry</label>
              <input
                type="date"
                required
                value={formData.licenseInsuranceExpiry}
                onChange={(e) => setFormData({...formData, licenseInsuranceExpiry: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">
                Fuel Type <span className="text-red-500"></span>
              </label>
              <select
                required
                value={formData.fuelType}
                onChange={(e) => {
                  setFormData({...formData, fuelType: e.target.value});
                  setValidationErrors(prev => ({...prev, fuelType: ''}));
                }}
                className={`w-full p-3 rounded-lg bg-gray-700/50 text-white border ${
                  validationErrors.fuelType ? 'border-red-500' : 'border-gray-600'
                } focus:border-pink-500 focus:ring-2 focus:ring-pink-500`}
              >
                <option value="">Select Fuel Type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
              </select>
              {validationErrors.fuelType && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.fuelType}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-lg hover:from-violet-600 hover:to-purple-700"
              >
                {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
