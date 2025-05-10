import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CustomPackageAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings'); // Default to bookings tab
  const [formData, setFormData] = useState({
    category: '',
    options: [{ name: '', description: '', price: '' }]
  });
  const [editMode, setEditMode] = useState(false);
  const [editingOption, setEditingOption] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching custom package data...');
      
      // Fetch bookings
      const bookingsRes = await api.getCustomBookings();
      console.log('Raw bookings response:', bookingsRes);
      
      if (bookingsRes?.data) {
        const bookingsArray = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        setBookings(bookingsArray);
      } else {
        setError('No bookings data received');
        setBookings([]);
      }
      
      // Fetch categories with options
      try {
        const categoriesData = await api.getCustomPackageCategories();
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          console.warn('Invalid categories format:', categoriesData);
          setCategories([]);
        }
      } catch (catError) {
        console.error('Error fetching categories:', catError);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to connect to server. Please ensure the backend is running.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Add automatic refresh interval 
  useEffect(() => {
    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle booking status update
  const updateBookingStatus = async (id, newStatus) => {
    if (!id || !newStatus) {
        alert('Invalid booking ID or status');
        return;
    }

    try {
        setLoading(true);
        const response = await api.updateCustomBooking(id, newStatus);
        
        if (response?.data?.success) {
            const booking = response.data.data;
            
            if (newStatus === 'approved' && booking) {
                // Format the selected options text
                let selectedOptionsText = Object.entries(booking.selectedOptions || {})
                    .map(([category, option]) => `${category}: ${option.name} ($${option.price})`)
                    .join('\n');

                // Format message with emojis
                const message = `Dear ${booking.customerName},

🎉 Your Custom Package Booking has been Approved!

📅 Booking Details:
• Travel Date: ${new Date(booking.travelDate).toLocaleDateString()}
• Total Price: $${booking.totalPrice}

🎯  Selected Options:
${selectedOptionsText}

Thank you for choosing Dream Destiny Travel! ✨

Best regards,
Dream Destiny Travel Team`;

                // Clean and format phone number for WhatsApp
                let phoneNumber = booking.phoneNumber.replace(/[^0-9]/g, '');
                if (phoneNumber.startsWith('0')) {
                    phoneNumber = '94' + phoneNumber.substring(1);
                } else if (phoneNumber.startsWith('+94')) {
                    phoneNumber = phoneNumber.substring(1);
                } else if (!phoneNumber.startsWith('94')) {
                    phoneNumber = '94' + phoneNumber;
                }

                // Create WhatsApp URL
                const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
                
                // Open WhatsApp
                window.open(whatsappURL, '_blank');
            }

            await fetchData();
            alert(`${response.data.message || `Booking ${newStatus} successfully!`}`);
        } else {
            throw new Error('Failed to update booking status');
        }
    } catch (err) {
        console.error('Error updating status:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update status';
        alert(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  // Add delete booking function
  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await api.deleteCustomBooking(id);
      fetchData();
      alert('Booking deleted successfully!');
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle form submission for package options
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!formData.category.trim()) {
        alert('Please enter a category name');
        return;
      }
      
      // Validate option data
      for (const option of formData.options) {
        if (!option.name.trim() || !option.description.trim() || !option.price) {
          alert('Please fill in all fields for each option');
          return;
        }
        
        if (isNaN(parseFloat(option.price)) || parseFloat(option.price) <= 0) {
          alert('Price must be a positive number');
          return;
        }
      }
      
      setLoading(true);
      console.log('Submitting form data:', formData);
       
      // Ensure price is properly converted to number
      const formattedOptions = formData.options.map(opt => ({
        name: opt.name.trim(),
        description: opt.description.trim(),
        price: parseFloat(opt.price) || 0 
      }));
      
      let response;
      if (editMode && editingOption) {
        // Update existing option 
        const optionData = formattedOptions[0];
        response = await api.updateCustomPackageOption(
          editingOption.categoryId,
          editingOption.optionId,
          optionData
        );
        alert('Option updated successfully!');
      } else {
        // Creating new options
        const categoryData = {
          name: formData.category.trim(),
          options: formattedOptions
        };
        
        response = await api.createCustomPackageOptions(categoryData);
        alert('Package options saved successfully!');
      }
      
      console.log('Save response:', response);
      
      // Reset form and refresh data
      setFormData({ category: '', options: [{ name: '', description: '', price: '' }] });
      setEditMode(false);
      setEditingOption(null);
      
      // Refresh data to show the new options
      fetchData();
    } catch (err) {
      console.error('Error details:', err);
      alert(`Failed to save options: ${err.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  // Add a new option to the form
  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { name: '', description: '', price: '' }]
    });
  };

  // Handle delete option functionality
  const handleDeleteOption = async (categoryId, optionId) => {
    if (!categoryId || !optionId) {
      console.error('Missing IDs:', { categoryId, optionId });
      alert('Cannot delete: Missing category or option ID');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this option?')) {
      return;
    }
    
    try {
      setLoading(true);
      await api.deleteCustomPackageOption(categoryId, optionId);
      alert('Option deleted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error deleting option:', error);
      alert(`Failed to delete option: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit option functionality
  const handleEditOption = (categoryId, option) => {
    setEditMode(true);
    setEditingOption({
      categoryId,
      optionId: option._id
    });
    
    setFormData({
      category: categories.find(cat => cat._id === categoryId)?.name || '',
      options: [{
        name: option.name || '',
        description: option.description || '',
        price: option.price || 0
      }]
    });
  };

  // Make sure to add a guard for the map function
  const renderBookings = () => {
    if (loading) {
      return <div className="text-center p-4">Loading bookings...</div>;
    }

    if (error) {
      return <div className="text-red-500 p-4">{error}</div>;
    }

    if (!Array.isArray(bookings) || bookings.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <p className="text-gray-400">No booking requests found.</p>
          <button 
            onClick={fetchData} 
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Travel Date</th>
              <th className="px-4 py-3 text-left">Total Price</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-700">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">{booking.customerName}</div>
                    <div className="text-sm text-gray-400">{booking.email}</div>
                    <div className="text-sm text-gray-400">{booking.phoneNumber}</div>
                  </div>
                </td>
                <td className="px-4 py-3">{formatDate(booking.travelDate)}</td>
                <td className="px-4 py-3">${booking.totalPrice.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${booking.status === 'approved' ? 'bg-green-900 text-green-300' :
                      booking.status === 'rejected' ? 'bg-red-900 text-red-300' :
                      'bg-yellow-900 text-yellow-300'}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateBookingStatus(booking._id, 'approved')}
                          className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">
                          Approve
                        </button>
                        <button 
                          onClick={() => updateBookingStatus(booking._id, 'rejected')}
                          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">
                          Reject
                        </button>
                      </>
                    )}
                   
                    <button 
                      onClick={() => deleteBooking(booking._id)}
                      className="px-3 py-1 bg-red-800 rounded hover:bg-red-900">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render categories and options
  const renderCategories = () => {
    if (loading) {
      return <div className="text-center p-4">Loading categories...</div>;
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <p className="text-gray-400">No package options found.</p>
          <button 
            onClick={fetchData} 
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>
      );
    }

    return (
      <div className="mt-6 space-y-6">
        {categories.map(category => (
          <div key={category._id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{category.name}</h3>
            </div>
            
            {category.options && category.options.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.options.map(option => (
                  <div key={option._id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-gray-300">{option.description}</div>
                    <div className="mt-2 text-green-400 font-bold">${parseFloat(option.price).toFixed(2)}</div>
                    <div className="flex mt-4 space-x-2">
                      <button 
                        onClick={() => handleEditOption(category._id, option)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteOption(category._id, option._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No options in this category.</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading && (!bookings.length && !categories.length)) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }
  
  if (error && activeTab === 'bookings') {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 pt-24 bg-dark-100 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Custom Package Management</h1>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-600">
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 font-medium ${activeTab === 'bookings' ? 
            'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Booking Requests
        </button>
        <button 
          onClick={() => setActiveTab('options')}
          className={`px-4 py-2 font-medium ${activeTab === 'options' ? 
            'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Package Options
        </button>
      </div>
      
      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <div className="flex justify-between mb-6 items-center">
            <h2 className="text-2xl font-semibold">Booking Requests</h2>
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          {renderBookings()}
        </div>
      )}
      
      {/* Options Tab */}
      {activeTab === 'options' && (
        <div>
          <div className="flex justify-between mb-6 items-center">
            <h2 className="text-2xl font-semibold">Package Options</h2>
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Options
            </button>
          </div>
          
          {/* Add New Options Form */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? 'Edit Option' : 'Add New Options'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2">Category Name</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
                  placeholder="e.g., Transportation, Accommodation"
                  required
                  disabled={editMode} // Disable category change in edit mode
                />
              </div>

              {formData.options.map((option, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg space-y-4">
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
                      className="w-full p-3 rounded-lg bg-gray-600 text-white"
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
                      className="w-full p-3 rounded-lg bg-gray-600 text-white h-24"
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
                      className="w-full p-3 rounded-lg bg-gray-600 text-white"
                      placeholder="Price in USD"
                      required
                    />
                  </div>
                </div>
              ))}

              <div className="flex space-x-4">
                {!editMode && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Another Option
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editMode ? 'Update Option' : 'Save Options'}
                </button>
                {editMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setEditingOption(null);
                      setFormData({
                        category: '',
                        options: [{ name: '', description: '', price: '' }]
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
          
          
        </div>
      )}
    </div>
  );
};

export default CustomPackageAdmin;