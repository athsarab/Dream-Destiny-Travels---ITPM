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
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const packageData = new FormData();
      Object.keys(formData).forEach(key => {
        packageData.append(key, formData[key]);
      });
      if (image) {
        packageData.append('image', image);
      }

      const response = await axios.post('http://localhost:5000/api/packages', packageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Clear form and preview after successful submission
      onPackageAdded(response.data);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        location: '',
        maxPax: ''
      });
      setImage(null);
      setPreviewUrl(null);
      
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Failed to create package. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-dark-200 rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-white mb-8">Add New Package</h2>
        
        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-white mb-2">Package Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-dark-300 rounded-lg bg-dark-100 text-white"
          />
          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <input
          type="text"
          name="name"
          placeholder="Package Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-4 mb-4 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-4 mb-4 border border-dark-300 rounded-lg h-32 focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-4 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
              required
            />
            <span className="absolute right-4 top-4 text-dark-400">$</span>
          </div>
          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-4 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
            required
          />
<select
  name="location"
  value={formData.location}
  onChange={handleChange}
  className="w-full p-4 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
  required
>
  <option value="">Select Location</option>
  <option value="Colombo">Colombo</option>
  <option value="Kandy">Kandy</option>
  <option value="Galle">Galle</option>
  <option value="Nuwara Eliya">Nuwara Eliya</option>
  <option value="Jaffna">Jaffna</option>
  <option value="Trincomalee">Trincomalee</option>
  <option value="Matale">Matale</option>
</select>

          <input
            type="number"
            name="maxPax"
            placeholder="Maximum Participants"
            value={formData.maxPax}
            onChange={handleChange}
            className="w-full p-4 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full mt-8 bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition-all duration-300 focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-dark-200"
        >
          Add Package
        </button>
      </form>
    </div>
  );
};

export default PackageForm;
