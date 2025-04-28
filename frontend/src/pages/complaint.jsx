import React, { useState } from 'react';

const Complaint = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    complaintType: 'service',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto max-w-2xl p-6 font-poppins">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Submit a Complaint
          </h1>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4"></div>
          <p className="text-center text-gray-600">
            We take your concerns seriously. Please fill out the form below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complaint Type
            </label>
            <select
              name="complaintType"
              value={formData.complaintType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="service">Service Quality</option>
              <option value="staff">Staff Behavior</option>
              <option value="facility">Facility Issues</option>
              <option value="booking">Booking Problems</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complaint Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default Complaint;