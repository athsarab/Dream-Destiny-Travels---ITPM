import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CustomPackageCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    email: '',
    phoneNumber: '',
    travelDate: '',
    additionalNotes: ''
  });
  const [step, setStep] = useState(1); // 1: Details, 2: Package Selection

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedOptions]);

  const fetchCategories = async () => {
    try {
      const response = await api.axios.get('/api/custom-packages/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOptionSelect = (categoryName, option) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev };
      
      if (newOptions[categoryName]?.id === option._id) {
        // Deselect if already selected
        delete newOptions[categoryName];
      } else {
        // Select new option
        newOptions[categoryName] = {
          id: option._id,
          name: option.name,
          price: option.price
        };
      }
       
      return newOptions;
    });
  };

  const calculateTotalPrice = () => {
    const total = Object.values(selectedOptions).reduce((sum, option) => sum + option.price, 0);
    setTotalPrice(total);
  };

  const handleCustomerDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async () => {
    try {
      if (Object.keys(selectedOptions).length === 0) {
        alert('Please select at least one option');
        return;
      }

      // Convert date to ISO string
      const travelDate = new Date(customerDetails.travelDate);
      if (isNaN(travelDate.getTime())) {
        alert('Please select a valid travel date');
        return;
      }

      const bookingData = {
        customerName: customerDetails.customerName.trim(),
        email: customerDetails.email.trim(),
        phoneNumber: customerDetails.phoneNumber.trim(),
        travelDate: travelDate.toISOString(),
        additionalNotes: customerDetails.additionalNotes.trim(),
        selectedOptions,
        totalPrice: parseFloat(totalPrice),
      };

      // Validate required fields
      if (!bookingData.customerName || !bookingData.email || !bookingData.phoneNumber) {
        alert('Please fill in all required fields');
        setStep(1);
        return;
      }

      console.log('Submitting booking:', bookingData);

      const response = await api.axios.post(
        '/api/custom-packages/bookings',
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        alert('Booking request submitted successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert('Failed to submit booking: ' + errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 py-12 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        {step === 1 ? (
          <div className="bg-dark-200 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8">Enter Your Details</h2>
            <form onSubmit={handleCustomerDetailsSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerDetails.customerName}
                  onChange={(e) => setCustomerDetails({...customerDetails, customerName: e.target.value})}
                  className="w-full p-3 rounded-lg bg-dark-300 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                  className="w-full p-3 rounded-lg bg-dark-300 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customerDetails.phoneNumber}
                  onChange={(e) => setCustomerDetails({...customerDetails, phoneNumber: e.target.value})}
                  className="w-full p-3 rounded-lg bg-dark-300 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Travel Date</label>
                <input
                  type="datetime-local"
                  required
                  value={customerDetails.travelDate}
                  onChange={(e) => setCustomerDetails({...customerDetails, travelDate: e.target.value})}
                  className="w-full p-3 rounded-lg bg-dark-300 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Additional Notes</label>
                <textarea
                  value={customerDetails.additionalNotes}
                  onChange={(e) => setCustomerDetails({...customerDetails, additionalNotes: e.target.value})}
                  className="w-full p-3 rounded-lg bg-dark-300 text-white h-32"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
              >
                Continue to Package Selection
              </button>
            </form>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-white mb-8">Create Your Custom Package</h2>
            <div className="grid gap-8 mb-24">
              {categories.map((category) => (
                <div key={category._id} className="bg-dark-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">{category.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.options.map((option) => (
                      <div
                        key={option._id}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedOptions[category.name]?.id === option._id
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-300 hover:bg-dark-400'
                        }`}
                        onClick={() => handleOptionSelect(category.name, option)}
                      >
                        <div className="font-medium mb-2">{option.name}</div>
                        <div className="text-sm opacity-90">{option.description}</div>
                        <div className="mt-2 font-bold">${option.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-dark-200 p-4 shadow-lg">
              <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="text-white">
                  <span className="text-lg">Total Price: </span>
                  <span className="text-2xl font-bold text-primary-400">${totalPrice}</span>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-lg font-semibold bg-dark-300 hover:bg-dark-400"
                  >
                    Back to Details
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedOptions).length === 0}
                    className={`px-6 py-3 rounded-lg font-semibold ${
                      Object.keys(selectedOptions).length === 0
                        ? 'bg-dark-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700'
                    }`}
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomPackageCreate;
