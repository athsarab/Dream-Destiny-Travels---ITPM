import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
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
              filteredVehicles.map(vehicle => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
