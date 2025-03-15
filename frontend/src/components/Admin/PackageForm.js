import React, { useState } from 'react';
import axios from 'axios';

const PackageForm = ({ onPackageAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    location: '',
    maxPax: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/packages', formData);
      onPackageAdded(response.data);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        location: '',
        maxPax: ''
      });
    } catch (error) {
      console.error('Error creating package:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Package</h2>
      <input
        type="text"
        name="name"
        placeholder="Package Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md h-32"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
        <input
          type="number"
          name="maxPax"
          placeholder="Maximum Pax"
          value={formData.maxPax}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-md"
          required
        />
      </div>
      <button 
        type="submit"
        className="w-full mt-6 bg-primary text-white py-3 rounded-md hover:bg-green-600 transition-colors"
      >
        Add Package
      </button>
    </form>
  );
};

export default PackageForm;
