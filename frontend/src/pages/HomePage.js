import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PackageCard from '../components/Client/PackageCard';

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
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
    fetchPackages();
  }, []);

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(search.toLowerCase()) ||
    pkg.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading packages...</div>;

  return (
    <div className="home-page">
      <h1>Welcome to Dream Destiny Travel</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="packages-grid">
        {filteredPackages.map(pkg => (
          <PackageCard key={pkg._id} package={pkg} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
