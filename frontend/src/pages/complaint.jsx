import React, { useState, useEffect } from 'react';
import complaintService from '../services/complaintService';

const Complaint = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    complaintType: 'service',
    description: ''
  });

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const response = await complaintService.getAllComplaints();
      setComplaints(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading complaints:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await complaintService.createComplaint(formData);
      await loadComplaints();
      // Reset form
      setFormData({
        name: '',
        email: '',
        complaintType: 'service',
        description: ''
      });
      alert('Complaint submitted successfully!');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto max-w-6xl p-6 font-poppins">
      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
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

      {/* Complaints List Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Recent Complaints
        </h2>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center">Loading complaints...</div>
          ) : (
            complaints.map((complaint) => (
              <div key={complaint._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{complaint.name}</h3>
                    <p className="text-sm text-gray-500">{complaint.email}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    {complaint.complaintType}
                  </span>
                </div>
                <p className="text-gray-700">{complaint.description}</p>
                <div className="mt-4 text-xs text-gray-500">
                  Submitted on: {new Date(complaint.date).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Complaint;