import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const CustomPackageAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [bookings, setBookings] = useState([]); // Ensure this is initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // Default to bookings tab
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    options: [{ name: '', description: '', price: '' }]
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching custom package data...');
      
      // Use new API methods
      const bookingsRes = await api.getCustomBookings();
      console.log('Raw bookings response:', bookingsRes);
      
      if (bookingsRes?.data) {
        const bookingsArray = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        console.log('Processed bookings data:', bookingsArray);
        setBookings(bookingsArray);
      } else {
        setError('No bookings data received');
        setBookings([]);
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
    fetchData(); // Initial fetch
    
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

🎉 *Your Custom Package Booking has been Approved!*

📅 *Booking Details:*
• Travel Date: ${new Date(booking.travelDate).toLocaleDateString()}
• Total Price: $${booking.totalPrice}

🎯  *Selected Options:*
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
            alert(response.data.message || `Booking ${newStatus} successfully!`);
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

  // Handle form submission for package options
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
       
      // Ensure price is properly converted to number
      const formattedOptions = formData.options.map(opt => ({
        name: opt.name,
        description: opt.description,
        price: parseFloat(opt.price) || 0 // Add fallback to prevent NaN
      }));
      
      // Use full URL path like the get method in fetchData
      const response = await api.axios.post('/api/custom-packages/options', {
        name: formData.category,
        options: formattedOptions
      });
      
      console.log('Save response:', response);
      
      // Reset form and refresh data
      setFormData({ category: '', options: [{ name: '', description: '', price: '' }] });
      
      // Show success message
      alert('Package options saved successfully!');
      
      // Refresh data to show the new options
      fetchData();
    } catch (err) {
      console.error('Error details:', err);
      // Show more detailed error message
      alert(`Failed to save options: ${err.response?.data?.message || err.message}`);
    }
  };

  // Add a new option to the form
  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { name: '', description: '', price: '' }]
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
                      onClick={() => {
                        const details = JSON.stringify(booking.selectedOptions, null, 2);
                        alert(`Booking Details:\n${details}`);
                      }}
                      className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">
                      Details
                    </button>
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

  if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // Fix: Add the main return statement for the component
  return (
    <div className="p-8 pt-24 bg-dark-100 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Custom Package Management</h1>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-600">
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 font-medium ${activeTab === 'bookings' ? 
            'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
        >
          Booking Requests
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 font-medium ${activeTab === 'categories' ? 
            'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
        >
          Package Options
        </button>
      </div>
      
      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Custom Package Booking Requests</h2>
          {renderBookings()}
        </div>
      )}
      
      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
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
        </div>
      )}
    </div>
  );
};

export default CustomPackageAdmin;
