import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      console.log('Fetched vehicles data:', response.data);
      
      // Check if driver data is properly populated
      response.data.forEach(vehicle => {
        if (vehicle.assignedDriver) {
          console.log('Driver for vehicle', vehicle.vehicleId, ':', vehicle.assignedDriver);
        }
      });
      
      setVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees?role=driver');
      console.log('Available drivers:', response.data);
      
      // More detailed driver data logging
      if (response.data && response.data.length > 0) {
        console.log('Sample driver data:', JSON.stringify(response.data[0]));
        console.log('Phone number field:', response.data[0].phoneNumber);
      }
      
      const driverMap = {};
      response.data.forEach(driver => {
        console.log(`Processing driver ${driver.name}, phone: ${driver.phoneNumber}`);
        
        driverMap[driver._id] = {
          name: driver.name,
          contactNumber: driver.phoneNumber || 'Not Available',
          email: driver.email || 'No email provided'
        };
      });
      console.log('Driver map created:', driverMap);
      setDrivers(driverMap);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
        setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
        alert('Vehicle deleted successfully!');
      } catch (error) {
        alert('Failed to delete vehicle');
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Add title
    doc.setFontSize(18);
    doc.text('Vehicle Details Report', 20, yPos);
    doc.setFontSize(12);
    yPos += 20;

    // Add date
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 20;

    // Add vehicle details
    vehicles.forEach((vehicle, index) => {
      // Add new page if needed
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text(`Vehicle ${index + 1}:`, 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Vehicle ID: ${vehicle.vehicleId}`, 30, yPos); yPos += 8;
      doc.text(`Type: ${vehicle.type}`, 30, yPos); yPos += 8;
      doc.text(`Model: ${vehicle.model || 'Not specified'}`, 30, yPos); yPos += 8;
      doc.text(`Number of Seats: ${vehicle.seats}`, 30, yPos); yPos += 8;
      doc.text(`Fuel Type: ${vehicle.fuelType}`, 30, yPos); yPos += 8;
      doc.text(`License Updated: ${new Date(vehicle.licenseInsuranceUpdated).toLocaleDateString()}`, 30, yPos); yPos += 8;
      doc.text(`License Expiry: ${new Date(vehicle.licenseInsuranceExpiry).toLocaleDateString()}`, 30, yPos); yPos += 8;
      
      // Add assigned driver information with proper checking
      const driverInfo = getDriverInfo(vehicle);
      if (driverInfo) {
        doc.text(`Assigned Driver: ${driverInfo.name}`, 30, yPos); yPos += 8;
        doc.text(`Driver Contact: ${driverInfo.contactNumber}`, 40, yPos); yPos += 8;
      } else {
        doc.text('Assigned Driver: Not assigned', 30, yPos); yPos += 8;
      }
      
      doc.text(`Status: ${vehicle.status}`, 30, yPos); yPos += 15;
    });

    // Save PDF
    doc.save('vehicle-details.pdf');
  };

  // Add filtered vehicles logic
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Function to determine license status with conditional styling
  const getLicenseStatus = (expiryDate) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    const daysRemaining = Math.floor((expiry - currentDate) / (1000 * 60 * 60 * 24));

    if (expiry < currentDate) {
        return <span>| <span style={{ color: 'red' }}>Expired</span></span>;
      } else if (daysRemaining <= 3) {
        return <span>| <span style={{ color: 'yellow' }}>{daysRemaining} Days left</span></span>;
      } else if (daysRemaining <= 7) {
        return <span>| {daysRemaining} Days left</span>;
      }
      
  };

  // Revised getDriverInfo function with better debugging and field handling
  const getDriverInfo = (vehicle) => {
    // Case 1: No driver assigned
    if (!vehicle.assignedDriver) {
      console.log('No driver assigned for vehicle:', vehicle.vehicleId);
      return null;
    }
    
    // Case 2: Driver data is directly populated from backend (object format)
    if (typeof vehicle.assignedDriver === 'object') {
      console.log('Driver info from backend:', JSON.stringify(vehicle.assignedDriver));
      
      if (vehicle.assignedDriver && vehicle.assignedDriver.name) {
        // Extract the correct phone number field (API route returns 'contactNumber' instead of 'phoneNumber')
        let phoneNumber = null;
        
        // Check all possible field names (more logging for debugging)
        console.log('Checking contactNumber:', vehicle.assignedDriver.contactNumber);
        console.log('Checking phoneNumber:', vehicle.assignedDriver.phoneNumber);
        
        if (vehicle.assignedDriver.contactNumber) {
          phoneNumber = vehicle.assignedDriver.contactNumber;
        } else if (vehicle.assignedDriver.phoneNumber) {
          phoneNumber = vehicle.assignedDriver.phoneNumber;
        }
        
        console.log('Final phone number used:', phoneNumber);
        
        return {
          name: vehicle.assignedDriver.name,
          contactNumber: phoneNumber || 'Not Available',
          email: vehicle.assignedDriver.email || 'No email provided'
        };
      }
    }
    
    // Case 3: Driver is just an ID, look it up in our local driver cache
    const driverId = typeof vehicle.assignedDriver === 'object' ? 
      vehicle.assignedDriver._id : vehicle.assignedDriver;
    
    console.log('Looking up driver ID in local cache:', driverId);
    
    if (drivers[driverId]) {
      console.log('Found driver in cache:', drivers[driverId]);
      return drivers[driverId];
    }
    
    // If we get here, we couldn't find driver info
    console.log('Could not find driver info for:', vehicle.assignedDriver);
    return {
      name: 'Unknown Driver',
      contactNumber: 'Contact information not available',
      email: 'No email provided'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              Vehicles List
            </h1>
            <div className="flex gap-4">
              <button
                onClick={generatePDF}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Download PDF
              </button>
              <button
                onClick={() => navigate('/employee-manager/vehicles')}
                className="bg-violet-500 text-white px-6 py-2 rounded-lg hover:bg-violet-600"
              >
                Add New Vehicle
              </button>
            </div>
          </div>

          {/* Add Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by vehicle ID, type or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid gap-6">
            {loading ? (
              <p className="text-white text-center">Loading vehicles...</p>
            ) : filteredVehicles.length === 0 ? (
              <p className="text-white text-center">No vehicles found</p>
            ) : (
              filteredVehicles.map(vehicle => {
                const driverInfo = getDriverInfo(vehicle);
                console.log('Driver info for vehicle display:', vehicle.vehicleId, driverInfo);
                
                return (
                  <div key={vehicle._id} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">ID: {vehicle.vehicleId}</h3>
                        <p className="text-gray-300">Type: {vehicle.type}</p>
                        <p className="text-gray-300">Model: {vehicle.model || 'Not specified'}</p>
                        <p className="text-gray-300">Seats: {vehicle.seats}</p>
                        <p className="text-gray-300">Fuel Type: {vehicle.fuelType}</p>
                        <p className="text-gray-300">License Updated: {new Date(vehicle.licenseInsuranceUpdated).toLocaleDateString()}</p>
                        <p className="text-gray-300">License Expiry: {new Date(vehicle.licenseInsuranceExpiry).toLocaleDateString()} {getLicenseStatus(vehicle.licenseInsuranceExpiry)}</p>
                        
                        {/* Improved driver display with highlighted phone number and email */}
                        {driverInfo ? (
                          <div className="mt-3 mb-3 bg-gray-800/70 p-4 rounded-lg border border-indigo-900/50">
                            <p className="text-indigo-300 font-medium">Assigned Driver:</p>
                            <p className="text-white text-lg">{driverInfo.name}</p>
                            <p className="text-gray-300 flex items-center mt-1">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-yellow-300 font-medium">{driverInfo.contactNumber}</span>
                            </p>
                            <p className="text-gray-300 flex items-center mt-1">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-blue-300 font-medium">{driverInfo.email}</span>
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-300 mt-3 mb-3">
                            <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded">
                              No Driver Assigned
                            </span>
                          </p>
                        )}
                        
                        <p className="text-gray-300">Status: {vehicle.status}</p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => navigate(`/employee-manager/edit-vehicle/${vehicle._id}`)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
