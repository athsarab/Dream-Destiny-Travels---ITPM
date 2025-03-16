import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="min-h-screen bg-dark-100 py-12 px-4 pt-24">
      <div className="max-w-4xl mx-auto bg-dark-200 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-8">Custom Package Options</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 bg-dark-300 text-white rounded-lg"
              placeholder="e.g., Transportation, Accommodation"
              required
            />
          </div>

          {formData.options.map((option, index) => (
            <div key={index} className="space-y-4 p-4 bg-dark-300 rounded-lg">
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
                  className="w-full p-3 bg-dark-400 text-white rounded-lg"
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
                  className="w-full p-3 bg-dark-400 text-white rounded-lg"
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
                  className="w-full p-3 bg-dark-400 text-white rounded-lg"
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
              className="px-6 py-3 bg-dark-400 text-white rounded-lg hover:bg-dark-500"
            >
              Add Another Option
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Save Options
            </button>
          </div>
        </form>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">Existing Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <div key={category._id || index} className="bg-dark-300 p-4 rounded-lg">
                <h4 className="text-xl font-semibold text-white mb-4">{category.name}</h4>
                <ul className="space-y-2">
                  {category.options?.map((option, optIndex) => (
                    <li key={optIndex} className="text-gray-300">
                      {option.name} - ${option.price}
                      <p className="text-sm text-gray-400">{option.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPackageAdmin;
