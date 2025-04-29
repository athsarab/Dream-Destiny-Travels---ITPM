import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Define role-based salary limits
const SALARY_LIMITS = {
  'Driver': 500,
  'Travel Agent': 1200,
  'Supplier': 450,
  'Worker': 350
};

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
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    nic: '',
    phoneNumber: '',
    salary: ''
  });

  const roles = ['Travel Agent', 'Driver', 'Worker', 'Supplier'];

  // Helper function to get max salary for a role
  const getMaxSalaryForRole = (role) => {
    return SALARY_LIMITS[role] || 2500; // Default to global max if role not found
  };

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

  const validateField = (name, value) => {
    switch (name) {
      case 'nic':
        // Fixed NIC validation: 12 digits OR 9 digits followed by V/v
        const nicRegex = /^(\d{12}|\d{9}[vV])$/;
        return !nicRegex.test(value) ? 
          'NIC must be either 12 digits or 9 digits followed by V/v' : '';
      case 'email':
        return !value.includes('@') ? 
          'Please enter a valid email address' : '';
      case 'phoneNumber':
        const phoneRegex = /^\d{10}$/;
        return !phoneRegex.test(value) ? 
          'Phone number must be exactly 10 digits' : '';
      case 'salary':
        if (!formData.role) {
          return '';
        }
        const maxSalary = getMaxSalaryForRole(formData.role);
        if (parseFloat(value) > maxSalary) {
          return `Salary cannot exceed $${maxSalary} for ${formData.role} role`;
        }
        if (parseFloat(value) <= 0) {
          return 'Salary must be greater than 0';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for salary to enforce role-based limits
    if (name === 'salary' && formData.role) {
      const maxSalary = getMaxSalaryForRole(formData.role);
      
      // For empty input, allow clearing the field
      if (value === '') {
        setFormData(prev => ({...prev, [name]: ''}));
        setValidationErrors(prev => ({...prev, salary: ''}));
        return;
      }
      
      // Only allow numeric input
      if (!/^\d*\.?\d*$/.test(value)) {
        return; // Don't update for non-numeric input
      }
      
      const numValue = parseFloat(value);
      
      // Check if the value would exceed maximum
      if (numValue > maxSalary || value.length > maxSalary.toString().length + 4) {
        // Don't update state if value exceeds maximum
        return;
      }
      
      // Allow the input if it's within limits
      setFormData(prev => ({...prev, [name]: value}));
      
      // Validate the new value
      if (numValue <= 0) {
        setValidationErrors(prev => ({...prev, salary: 'Salary must be greater than 0'}));
      } else if (numValue > maxSalary) {
        setValidationErrors(prev => ({
          ...prev, 
          salary: `Maximum salary for ${formData.role} is $${maxSalary}`
        }));
      } else {
        setValidationErrors(prev => ({...prev, salary: ''}));
      }
      return;
    }
    
    // For other fields, use the existing logic
    setFormData(prev => ({...prev, [name]: value}));
    setValidationErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  // Handle role changes - reset salary
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData(prev => ({
      ...prev, 
      role: role,
      // Reset salary when role changes to enforce new limits
      salary: ''
    }));
    
    // Clear any salary validation errors
    setValidationErrors(prev => ({
      ...prev,
      salary: ''
    }));
  };

  const validateForm = () => {
    // Add salary validation based on role
    if (!formData.salary) {
      alert('Please enter a salary amount');
      return false;
    }

    const salary = parseFloat(formData.salary);
    if (formData.role) {
      const maxSalary = getMaxSalaryForRole(formData.role);
      if (salary > maxSalary) {
        alert(`Salary cannot exceed $${maxSalary} for ${formData.role} role`);
        return false;
      }
    } else if (salary > 2500) {
      alert('Salary cannot exceed $2,500');
      return false;
    }

    if (salary <= 0) {
      alert('Salary must be greater than 0');
      return false;
    }

    // Other validations
    if (!formData.name || !formData.employeeId || !formData.role || !formData.salary) {
      alert('Please fill in all required fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      alert('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setValidationErrors(prev => ({
        ...prev,
        phoneNumber: 'Phone number must be exactly 10 digits'
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fixed NIC validation regex here too
      const nicRegex = /^(\d{12}|\d{9}[vV])$/;
      if (!nicRegex.test(formData.nic)) {
        setValidationErrors(prev => ({
          ...prev,
          nic: 'NIC must be either 12 digits or 9 digits followed by V/v'
        }));
        return;
      }

      if (!validateForm()) {
        return;
      }
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
      
      // Force reload of employee list by adding timestamp parameter
      navigate('/employee-manager/employee-list?t=' + new Date().getTime());

    } catch (error) {
      console.error('Error details:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(errorMessage); // Show the specific duplicate field error
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
                name="nic"
                required
                placeholder="Enter 9 digits with V/v or 12 digits"
                value={formData.nic}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-gray-700/50 text-white border ${
                  validationErrors.nic ? 'border-red-500' : 'border-gray-600'
                } focus:border-pink-500 focus:ring-2 focus:ring-pink-500`}
              />
              {validationErrors.nic && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.nic}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                required
                placeholder="Enter 10 digit phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-gray-700/50 text-white border ${
                  validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-600'
                } focus:border-pink-500 focus:ring-2 focus:ring-pink-500`}
              />
              {validationErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.phoneNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-gray-700/50 text-white border ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-600'
                } focus:border-pink-500 focus:ring-2 focus:ring-pink-500`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Role</label>
              <select
                required
                value={formData.role}
                onChange={handleRoleChange}
                className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role} (Max Salary: ${getMaxSalaryForRole(role)})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Salary ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">$</span>
                <input
                  type="text" // Changed from "number" to "text" for better control
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  name="salary"
                  required
                  value={formData.salary}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    // Prevent users from using up/down arrows to bypass max value
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                      e.preventDefault();
                    }
                  }}
                  onBlur={(e) => {
                    // On blur, ensure value is a proper number and within limits
                    if (formData.role && formData.salary) {
                      const maxSalary = getMaxSalaryForRole(formData.role);
                      let numValue = parseFloat(formData.salary);
                      
                      if (isNaN(numValue)) {
                        setFormData(prev => ({...prev, salary: ''}));
                      } else if (numValue > maxSalary) {
                        setFormData(prev => ({...prev, salary: maxSalary.toString()}));
                      } else if (numValue <= 0) {
                        setFormData(prev => ({...prev, salary: '1'}));
                      } else {
                        // Format to 2 decimal places if needed
                        setFormData(prev => ({...prev, salary: numValue.toString()}));
                      }
                    }
                  }}
                  className={`w-full p-3 pl-8 rounded-lg bg-gray-700/50 text-white border ${
                    validationErrors.salary ? 'border-red-500' : 'border-gray-600'
                  } focus:border-pink-500 focus:ring-2 focus:ring-pink-500`}
                  placeholder={formData.role ? 
                    `Maximum: $${getMaxSalaryForRole(formData.role)}` : 
                    "Select a role first"
                  }
                  disabled={!formData.role}
                />
                {formData.role && (
                  <p className="text-xs text-amber-400 mt-1">
                    Maximum salary for {formData.role}: ${getMaxSalaryForRole(formData.role)}
                  </p>
                )}
                {validationErrors.salary && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.salary}</p>
                )}
              </div>
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
