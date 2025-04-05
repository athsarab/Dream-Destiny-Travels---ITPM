import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PackageForm from '../components/Admin/PackageForm';
import PackageBookingsList from '../components/Admin/PackageBookingsList';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { 
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/packages');
      setPackages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/packages/${id}`);
      setPackages(packages.filter(pkg => pkg._id !== id));
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const handlePackageAdded = (newPackage) => {
    setPackages([...packages, newPackage]);
    setShowForm(false);
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Loading dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 
                      bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl 
                      border border-white/20">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                       drop-shadow-lg">
            Package Management Dashboard 
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/admin/custom-packages')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white 
                       px-6 py-3 rounded-xl shadow-lg hover:shadow-pink-500/50
                       transition-all duration-300 transform hover:scale-105
                       hover:from-pink-500 hover:to-purple-500
                       active:scale-95"
            >
              Manage Custom Packages
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`${
                showForm 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
              } text-white px-6 py-3 rounded-xl shadow-lg
                transition-all duration-300 transform hover:scale-105
                hover:shadow-lg active:scale-95`}
            >
              {showForm ? 'Close Form' : 'Create Package'}
            </button>
          </div>
        </div>
        
        {/* Form Section */}
        {showForm && (
          <div className="transform transition-all duration-300 ease-in-out animate-fade-in"> 
            <PackageForm onPackageAdded={handlePackageAdded} />
          </div>
        )}  

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
          <div className="relative">
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-xl border border-white/20 
                       bg-white/5 text-white placeholder-gray-300
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-300 outline-none backdrop-blur-sm
                       shadow-lg"
            />
            <svg className="w-6 h-6 absolute right-4 top-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <div key={pkg._id} className="group bg-white/10 backdrop-blur-md rounded-xl 
                                      border border-white/20 overflow-hidden 
                                      hover:shadow-xl hover:shadow-purple-500/20
                                      transition-all duration-300 transform 
                                      hover:-translate-y-2">
              {pkg.imageUrl && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={`http://localhost:5000${pkg.imageUrl}`}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 
                             transition-transform duration-500 ease-out"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white 
                           group-hover:text-transparent group-hover:bg-clip-text
                           group-hover:bg-gradient-to-r group-hover:from-pink-500 
                           group-hover:to-purple-500 transition-colors">
                  {pkg.name}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-300"><span className="text-purple-300">Location:</span> {pkg.location}</p>
                  <p className="text-green-400 font-bold">${pkg.price}</p>
                  <p className="text-gray-300"><span className="text-purple-300">Duration:</span> {pkg.duration}</p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => navigate(`/admin/edit/${pkg._id}`)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600
                             hover:from-blue-500 hover:to-indigo-500 text-white 
                             py-2 rounded-lg transition-all duration-300
                             transform hover:scale-105 active:scale-95"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(pkg._id)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-pink-600
                             hover:from-red-500 hover:to-pink-500 text-white 
                             py-2 rounded-lg transition-all duration-300
                             transform hover:scale-105 active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 
                     border border-white/20 hover:shadow-purple-500/20 
                     transition-all duration-300">
          <PackageBookingsList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
