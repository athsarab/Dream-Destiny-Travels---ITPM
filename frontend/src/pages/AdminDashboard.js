import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PackageForm from '../components/Admin/PackageForm';

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

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-dark-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Package Management Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {showForm ? 'Close Form' : 'Create Package'}
          </button>
        </div>
        
        {showForm && (
          <div className="mb-8">
            <PackageForm onPackageAdded={handlePackageAdded} />
          </div>
        )}

        <div className="bg-dark-200 rounded-lg shadow-md p-6 mb-8">
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-dark-300 bg-dark-100 text-white placeholder-dark-400 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <div key={pkg._id} className="bg-dark-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {pkg.imageUrl && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={`http://localhost:5000${pkg.imageUrl}`}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">{pkg.name}</h3>
                <div className="space-y-2 mb-6">
                  <p className="text-dark-500">Location: {pkg.location}</p>
                  <p className="text-accent font-bold">Price: ${pkg.price}</p>
                  <p className="text-dark-500">Duration: {pkg.duration}</p>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => navigate(`/admin/edit/${pkg._id}`)}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(pkg._id)}
                    className="flex-1 bg-error text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
