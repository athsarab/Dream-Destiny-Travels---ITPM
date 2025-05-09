import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AddEmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    phoneNumber: '',
    nic: '',
    role: '',
    email: '',
    salary: '',
  });

  const roles = ['Travel Agent', 'Driver', 'Worker', 'Supplier'];

  // Fetch employee data if in edit mode
  useEffect(() => {
    const fetchEmployee = async () => {
      if (id) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching employee:', error);
          const errorResponse = error.response?.data;
          
          setError({
            title: errorResponse?.message || 'Failed to Fetch Employee',
            message: errorResponse?.details || 
              (error.response?.status === 404 ? 'Employee not found' : 'Failed to load employee data. Please try again.'),
            status: error.response?.status || 500
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEmployee();
  }, [id]);

  // Add retry function
  const retryFetch = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Update error display component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24 flex items-center justify-center">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700 text-center max-w-lg w-full">
          <div className="text-rose-500 mb-4 text-5xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {typeof error === 'string' ? 'Error' : error.title}
          </h2>
          <p className="text-red-400 mb-6">
            {typeof error === 'string' ? error : error.message}
          </p>
          <div className="flex gap-4 justify-center">
            {(!error.status || error.status !== 404) && (
              <button
                onClick={retryFetch}
                className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors duration-200"
              >
                Retry
              </button>
            )}
            <button
              onClick={() => navigate('/employee-manager/employee-list')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting employee data:', formData);
      
      let response;
      if (id) {
        // Update existing employee
        response = await axios.put(`http://localhost:5000/api/employees/${id}`, formData, {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        // Create new employee
        response = await axios.post('http://localhost:5000/api/employees', formData, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      console.log('Server response:', response.data);
      alert(id ? 'Employee updated successfully!' : 'Employee added successfully!');
      navigate('/employee-manager/employee-list');
    } catch (error) {
      console.error('Error details:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(`Failed to ${id ? 'update' : 'add'} employee: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent mb-8">
            {id ? 'Edit Employee' : 'Add New Employee'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Employee ID</label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">NIC</label>
              <input
                type="text"
                required
                value={formData.nic}
                onChange={(e) => setFormData({...formData, nic: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Role</label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Salary</label>
              <input
                type="number"
                required
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/employee-manager')}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-colors"
              >
                {id ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
