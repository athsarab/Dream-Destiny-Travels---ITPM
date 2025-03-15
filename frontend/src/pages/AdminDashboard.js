import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PackageForm from '../components/Admin/PackageForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading dashboard11...</div>;

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>
      <PackageForm onPackageAdded={(newPackage) => {
        setPackages([...packages, newPackage]);
      }} />
      <div className="packages-section">
        <h2 className="section-title">Existing Packages ({filteredPackages.length})</h2>
        <div className="packages-grid">
          {filteredPackages.map(pkg => (
            <div key={pkg._id} className="package-card">
              <h3 className="package-title">{pkg.name}</h3>
              <p className="package-location">Location: {pkg.location}</p>
              <p className="package-price">Price: ${pkg.price}</p>
              <p className="package-duration">Duration: {pkg.duration}</p>
              <div className="package-actions">
                <button 
                  className="btn btn-edit"
                  onClick={() => navigate(`/admin/edit/${pkg._id}`)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => handleDelete(pkg._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
