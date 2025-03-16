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

        {loading ? (
          <div className="text-center text-dark-500">
            Loading amazing destinations...
          </div>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6">Featured Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.slice(0, 3).map(pkg => (
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
                      <button 
                        className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                        onClick={() => window.location.href = `/package/${pkg._id}`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-6">All Destinations</h2>
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
                      <button 
                        className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                        onClick={() => window.location.href = `/package/${pkg._id}`}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
