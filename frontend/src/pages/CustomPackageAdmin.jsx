import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomBookingList from '../components/Admin/CustomBookingList';

const CustomPackageAdmin = () => {
  const [formData, setFormData] = useState({
    category: '',
    options: [{ name: '', description: '', price: '' }]
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => { 
    fetchCategories();   
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/custom-packages/categories');
      console.log('Fetched categories:', response.data); // Add debug log
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error.response || error);
    }
  };

  const handleSubmit = async (e) => {   
    e.preventDefault();
    try {
      // Validate and clean data
      const validOptions = formData.options.filter(opt => 
        opt.name && opt.description && opt.price
      );

      if (validOptions.length === 0) {
        alert('Please fill in all fields for at least one option');
        return;
      }

      const data = {
        name: formData.category.trim(), // Changed from category to name
        options: validOptions.map(opt => ({
          name: opt.name.trim(),
          description: opt.description.trim(),
          price: Number(opt.price)
        }))
      };

      console.log('Sending data:', data);
      const response = await axios.post(
        'http://localhost:5000/api/custom-packages/options', 
        data
      );

      if (response.data) {
        alert('Options added successfully!');
        setFormData({
          category: '',
          options: [{ name: '', description: '', price: '' }]
        });
        fetchCategories();
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error);
      alert('Failed to add options: ' + (error.response?.data?.message || error.message));
    }
  };  

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { name: '', description: '', price: '' }]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 
                      bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl 
                      border border-white/20">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                       drop-shadow-lg">
            Custom Package Management
          </h1>
        </div>
        
        {/* Options Management Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 
                     border border-white/20 hover:shadow-purple-500/20 
                     transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-8">Package Options</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-6 py-4 rounded-xl border border-white/20 
                       bg-white/5 text-white placeholder-gray-300
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-300 outline-none backdrop-blur-sm
                       shadow-lg"
                placeholder="e.g., Transportation, Accommodation"
                required
              />
            </div>

            {formData.options.map((option, index) => (
              <div key={index} className="space-y-4 p-6 bg-white/5 backdrop-blur-md 
                                      rounded-xl border border-white/20">
                <div>
                  <label className="block text-white mb-2">Option Name</label>
                  <input
                    type="text"
                    value={option.name}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index].name = e.target.value;
                      setFormData({...formData, options: newOptions});
                    }}
                    className="w-full px-6 py-4 rounded-xl border border-white/20 
                           bg-white/5 text-white placeholder-gray-300
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300 outline-none backdrop-blur-sm
                           shadow-lg"
                    placeholder="e.g., Economy Car, Luxury Hotel"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Description</label>
                  <textarea
                    value={option.description}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index].description = e.target.value;
                      setFormData({...formData, options: newOptions});
                    }}
                    className="w-full px-6 py-4 rounded-xl border border-white/20 
                           bg-white/5 text-white placeholder-gray-300
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300 outline-none backdrop-blur-sm
                           shadow-lg"
                    placeholder="Description of the option"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Price</label>
                  <input
                    type="number"
                    value={option.price}
                    onChange={(e) => {
                      const newOptions = [...formData.options];
                      newOptions[index].price = e.target.value;
                      setFormData({...formData, options: newOptions});
                    }}
                    className="w-full px-6 py-4 rounded-xl border border-white/20 
                           bg-white/5 text-white placeholder-gray-300
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300 outline-none backdrop-blur-sm
                           shadow-lg"
                    placeholder="Price in USD"
                    required
                  />
                </div>
              </div>
            ))}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={addOption}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                       px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/50
                       transition-all duration-300 transform hover:scale-105
                       hover:from-blue-500 hover:to-indigo-500
                       active:scale-95"
              >
                Add Another Option
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white 
                       px-6 py-3 rounded-xl shadow-lg hover:shadow-pink-500/50
                       transition-all duration-300 transform hover:scale-105
                       hover:from-pink-500 hover:to-purple-500
                       active:scale-95"
              >
                Save Options
              </button>
            </div>
          </form>
        </div>

        {/* Bookings Management Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 
                     border border-white/20 hover:shadow-purple-500/20 
                     transition-all duration-300">
          <CustomBookingList />
        </div>
      </div>
    </div>
  );
};

export default CustomPackageAdmin;
