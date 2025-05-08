import React, { useState } from 'react';
import api from '../../services/api';
import WeatherAlert from '../Weather/WeatherAlert';

const PackageBookingForm = ({ packageDetails, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phoneNumber: '',
    travelDate: '',
    numberOfPeople: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        ...formData,
        packageId: packageDetails._id,
        totalPrice: packageDetails.price * formData.numberOfPeople,
        // Ensure date is properly formatted
        travelDate: new Date(formData.travelDate).toISOString()
      };

      console.log('Submitting booking:', bookingData); // Debug log

      const response = await api.submitPackageBooking(bookingData);
      
      if (response.data) {
        alert('Booking submitted successfully!');
        onSubmit(response.data); // Pass the booking data to parent
        onCancel(); // Close the form
      }
    } catch (error) {
      console.error('Error details:', error);
      alert('Failed to submit booking: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-200 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Book Package: {packageDetails.name}</h2>
        
        {/* Add Weather Alert based on location */}
        {packageDetails.location && (
          <WeatherAlert
            location={packageDetails.location}
            travelDate={formData.travelDate}
          />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              className="w-full p-3 rounded-lg bg-dark-300 text-white"
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 rounded-lg bg-dark-300 text-white"
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="w-full p-3 rounded-lg bg-dark-300 text-white"
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Travel Date & Time</label>
            <input
              type="datetime-local"
              required
              value={formData.travelDate}
              onChange={(e) => setFormData({...formData, travelDate: e.target.value})}
              className="w-full p-3 rounded-lg bg-dark-300 text-white"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          
          <div>
            <label className="block text-white mb-2">Number of People</label>
            <input
              type="number"
              required
              min="1"
              max={packageDetails.maxPax}
              value={formData.numberOfPeople}
              onChange={(e) => setFormData({...formData, numberOfPeople: parseInt(e.target.value)})}
              className="w-full p-3 rounded-lg bg-dark-300 text-white"
            />
          </div>
          
          <div className="pt-4">
            <p className="text-white mb-4">
              Total Price: ${packageDetails.price * formData.numberOfPeople}
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-dark-300 text-white py-3 rounded-lg hover:bg-dark-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageBookingForm;
