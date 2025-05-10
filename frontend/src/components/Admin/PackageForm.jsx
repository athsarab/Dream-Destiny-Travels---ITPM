import React, { useState } from 'react';
import api from '../../services/api';
import axios from 'axios'; // Add this import

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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError(null);
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (file && !validTypes.includes(file.type)) {
      setImageError('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file && file.size > maxSize) {
      setImageError('Image must be less than 5MB');
      return;
    }
    
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (imageError) {
      setError(imageError);
      setLoading(false);
      return;
    }

    try {
      const packageData = new FormData();
      
      // Add all form fields except those that shouldn't be sent
      Object.keys(formData).forEach(key => {
        packageData.append(key, formData[key]);
      });
      
      // Append image if selected
      if (image) {
        packageData.append('image', image);
      }

      // Use axios directly with the correct headers
      // This should match how EditPackagePage makes the request
      const response = await axios.post('http://localhost:5000/api/packages', packageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Server response:', response);
      
      if (response.data) {
        onPackageAdded(response.data);
        // Clear form
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
      }
    } catch (error) {
      console.error('Error creating package:', error);
      
      // More detailed error handling
      if (error.response?.status === 413) {
        setError('Image file is too large. Please choose a smaller image.');
      } else if (error.response?.data?.errors?.image) {
        setError(`Image error: ${error.response.data.errors.image}`);
      } else {
        setError(error.response?.data?.message || 'Failed to create package. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-dark-200 rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <h2 className="text-3xl font-bold text-white mb-8">Add New Package</h2>
        
        {/* Image Upload Section with error handling */}
        <div className="mb-6">
          <label className="block text-white mb-2">Package Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-dark-300 rounded-lg bg-dark-100 text-white"
          />
          {imageError && (
            <p className="text-red-500 text-sm mt-1">{imageError}</p>
          )}
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
          disabled={loading}
          className={`w-full mt-8 py-4 rounded-lg transition-all duration-300 ${
            loading 
              ? 'bg-primary-400 cursor-not-allowed' 
              : 'bg-primary-600 hover:bg-primary-700'
          } text-white focus:ring-2 focus:ring-primary-400`}
        >
          {loading ? 'Creating Package...' : 'Add Package'}
        </button>
      </form>
    </div>
  );
};

export default PackageForm;
