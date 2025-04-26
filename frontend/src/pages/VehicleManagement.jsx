import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const VehicleManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [drivers, setDrivers] = useState([]);
  
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
    fuelType: '',
    assignedDriver: ''
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
    fetchDrivers();
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
      console.log('Fetched vehicle data for editing:', vehicle);
      
      // Check driver information
      if (vehicle.assignedDriver) {
        console.log('Driver assigned to this vehicle:', vehicle.assignedDriver);
      }
      
      // Set form data with fetched vehicle
      setFormData({
        vehicleId: vehicle.vehicleId,
        type: vehicle.type,
        model: vehicle.model,
        seats: vehicle.seats,
        licenseInsuranceUpdated: vehicle.licenseInsuranceUpdated.split('T')[0],
        licenseInsuranceExpiry: vehicle.licenseInsuranceExpiry.split('T')[0],
        status: vehicle.status,
        fuelType: vehicle.fuelType,
        // Handle both object and string driver IDs
        assignedDriver: vehicle.assignedDriver ? 
          (typeof vehicle.assignedDriver === 'object' ? vehicle.assignedDriver._id : vehicle.assignedDriver) 
          : ''
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

  const fetchDrivers = async () => {
    try {
      // Fetch drivers from employee API who have a role of driver
      const response = await axios.get('http://localhost:5000/api/employees?role=driver');
      console.log('Available drivers for assignment:', response.data);
      
      // Debug driver data to see what fields are available
      if (response.data && response.data.length > 0) {
        console.log('Sample driver data:', response.data[0]);
      }
      
      // Store full driver info including phone numbers
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
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
        status: formData.status || 'available',
        assignedDriver: formData.assignedDriver || null
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

            {/* Enhanced Driver Assignment Field with better display */}
            <div className="md:col-span-2 bg-gray-700/20 p-4 rounded-lg border border-indigo-500/20">
              <label className="block text-indigo-300 font-semibold mb-3">Assign Driver to Vehicle</label>
              <select
                value={formData.assignedDriver}
                onChange={(e) => setFormData({...formData, assignedDriver: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/70 text-white border border-indigo-500/30 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select a driver --</option>
                {drivers.map(driver => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name} - {driver.phoneNumber || 'No phone number'}
                  </option>
                ))}
              </select>
              
              {/* Display selected driver details with highlighted phone number */}
              {formData.assignedDriver && (
                <div className="mt-3 p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/30">
                  {(() => {
                    const selectedDriver = drivers.find(d => d._id === formData.assignedDriver);
                    if (!selectedDriver) return <p className="text-gray-400">Loading driver details...</p>;
                    
                    // Debug to see what fields the selected driver has
                    console.log('Selected driver details:', selectedDriver);
                    
                    return (
                      <>
                        <div className="flex items-center mb-2">
                          <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-white">
                            {selectedDriver.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-400 bg-indigo-900/40 p-2 rounded">
                          <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-yellow-300 font-medium">
                            {selectedDriver.phoneNumber || 'No phone number available'}
                          </span>
                        </div>
                        
                        {/* Add email display */}
                        <div className="flex items-center text-sm text-gray-400 bg-indigo-900/40 p-2 rounded mt-2">
                          <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-blue-300 font-medium">
                            {selectedDriver.email || 'No email available'}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
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
