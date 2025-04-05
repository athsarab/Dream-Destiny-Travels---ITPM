import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeManagerDashboard = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [hotelCount, setHotelCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeCount();
    fetchHotelCount();
    fetchVehicleCount();
  }, []);

  const fetchEmployeeCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployeeCount(response.data.length);
    } catch (error) {
      console.error('Error fetching employee count:', error);
    }
  };

  const fetchHotelCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hotels');
      setHotelCount(response.data.length);
    } catch (error) {
      console.error('Error fetching hotel count:', error);
    }
  };

  const fetchVehicleCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicleCount(response.data.length);
    } catch (error) {
      console.error('Error fetching vehicle count:', error);
    }
  };

  const employeeButtons = [
    {
      id: 'view',
      title: 'View Employees',
      description: 'View and manage existing employee records',
      path: '/employee-manager/employee-list',
      color: 'from-emerald-500 to-teal-600',
      icon: '📋'
    },
    {
      id: 'add',
      title: 'Add Employee',
      description: 'Add new employee records',
      path: '/employee-manager/add-employee',
      color: 'from-rose-500 to-pink-600',
      icon: '👥'
    }
  ];

  const resourceButtons = [
    {
      id: 'viewHotels',
      title: 'View Hotels',
      description: 'View and manage existing hotels',
      path: '/employee-manager/hotels-list',
      color: 'from-indigo-500 to-blue-600',
      icon: '📋'
    },
    {
      id: 'addHotel',
      title: 'Add Hotel',
      description: 'Add new partner hotels',
      path: '/employee-manager/hotels',
      color: 'from-violet-500 to-purple-600',
      icon: '🏨'
    }
  ];

  const vehiclesButtons = [
    {
      id: 'viewVehicles',
      title: 'View Vehicles',
      description: 'View and manage existing vehicles',
      path: '/employee-manager/vehicles-list',
      color: 'from-blue-500 to-indigo-600',
      icon: '🚗'
    },
    {
      id: 'addVehicle',
      title: 'Add Vehicle',
      description: 'Add new vehicle records',
      path: '/employee-manager/vehicles',
      color: 'from-emerald-500 to-teal-600',
      icon: '🚛'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
              Travel Agency Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">Welcome back,</span>
              <span className="text-white font-semibold">Manager</span>
            </div>
          </div>

          {/* Employee Management Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Employee Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {employeeButtons.map((button) => (
                <Link
                  key={button.id}
                  to={button.path}
                  className="group relative"
                  onMouseEnter={() => setHoveredButton(button.id)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <div className={`
                    relative rounded-xl overflow-hidden p-6
                    bg-gradient-to-r ${button.color}
                    transform transition-all duration-300
                    hover:scale-105 hover:shadow-2xl
                    ${hoveredButton === button.id ? 'scale-105 shadow-2xl' : ''}
                  `}>
                    <div className="absolute top-4 right-4 text-4xl">
                      {button.icon}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {button.title}
                      </h3>
                      <p className="text-white/80">
                        {button.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Resource Management Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Hotel Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resourceButtons.map((button) => (
                <Link
                  key={button.id}
                  to={button.path}
                  className="group relative"
                  onMouseEnter={() => setHoveredButton(button.id)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <div className={`
                    relative rounded-xl overflow-hidden p-6
                    bg-gradient-to-r ${button.color}
                    transform transition-all duration-300
                    hover:scale-105 hover:shadow-2xl
                    ${hoveredButton === button.id ? 'scale-105 shadow-2xl' : ''}
                  `}>
                    <div className="absolute top-4 right-4 text-4xl">
                      {button.icon}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {button.title}
                      </h3>
                      <p className="text-white/80">
                        {button.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>


          
          {/* Vehicle Management Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Vehicle Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {vehiclesButtons.map((button) => (
                <Link
                  key={button.id}
                  to={button.path}
                  className="group relative"
                  onMouseEnter={() => setHoveredButton(button.id)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <div className={`
                    relative rounded-xl overflow-hidden p-6
                    bg-gradient-to-r ${button.color}
                    transform transition-all duration-300
                    hover:scale-105 hover:shadow-2xl
                    ${hoveredButton === button.id ? 'scale-105 shadow-2xl' : ''}
                  `}>
                    <div className="absolute top-4 right-4 text-4xl">
                      {button.icon}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {button.title}
                      </h3>
                      <p className="text-white/80">
                        {button.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          

          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h4 className="text-gray-400 mb-2">Total Employees</h4>
              <p className="text-3xl font-bold text-white">{employeeCount}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h4 className="text-gray-400 mb-2">Total Hotels</h4>
              <p className="text-3xl font-bold text-white">{hotelCount}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h4 className="text-gray-400 mb-2">Total Vehicles</h4>
              <p className="text-3xl font-bold text-white">{vehicleCount}</p>
            </div>
          </div>

         

        </div>
      </div>
    </div>
  );
};

export default EmployeeManagerDashboard;
