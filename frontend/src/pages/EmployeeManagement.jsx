import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployeeManagement = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const managementButtons = [
    {
      id: 'employees',
      title: 'Add Employees',
      description: 'Manage employee records and information',
      path: '/admin/employees',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'hotels',
      title: 'Add Hotels',
      description: 'Manage partner hotels and accommodations',
      path: '/admin/hotels',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'vehicles',
      title: 'Add Vehicles',
      description: 'Manage transportation fleet',
      path: '/admin/vehicles',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          <h1 className="text-4xl font-bold text-white mb-8">
            Resource Management Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {managementButtons.map((button) => (
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
      </div>
    </div>
  );
};

export default EmployeeManagement;
