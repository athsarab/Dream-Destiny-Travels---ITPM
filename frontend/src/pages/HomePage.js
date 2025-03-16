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

  return (
    <div className="flex-1 bg-dark-100">
      <div className="container mx-auto h-full flex flex-col px-4 py-6">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Discover Your Next Adventure
        </h1>
        <div className="max-w-xl mx-auto w-full mb-8">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-dark-300 bg-dark-200 text-white placeholder-dark-400 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto">
          {loading ? (
            <div className="col-span-full text-center text-dark-500">
              Loading amazing destinations...
            </div>
          ) : (
            filteredPackages.map(pkg => (
              <PackageCard key={pkg._id} package={pkg} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
