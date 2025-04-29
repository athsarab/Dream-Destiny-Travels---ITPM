import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';

// Define role-based salary limits
const SALARY_LIMITS = {
  'Driver': 500,
  'Travel Agent': 1200,
  'Supplier': 450,
  'Worker': 350
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  // Helper function to get salary limit based on role
  const getSalaryLimit = (role) => {
    return SALARY_LIMITS[role] || 2500; // Default to global max if role not found
  };

  // Helper function to get salary color based on percentage of max
  const getSalaryColorClass = (salary, role) => {
    const maxSalary = getSalaryLimit(role);
    const percentage = (salary / maxSalary) * 100;
    
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-amber-400';
    if (percentage >= 50) return 'text-green-400';
    return 'text-blue-400';
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Add title
    doc.setFontSize(18);
    doc.text('Employee Details Report', 20, yPos);
    doc.setFontSize(12);
    yPos += 20;

    // Add date
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 20;

    // Add employee details
    employees.forEach((employee, index) => {
      // Add new page if needed
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text(`Employee ${index + 1}:`, 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Name: ${employee.name}`, 30, yPos); yPos += 8;
      doc.text(`Employee ID: ${employee.employeeId}`, 30, yPos); yPos += 8;
      doc.text(`Role: ${employee.role}`, 30, yPos); yPos += 8;
      doc.text(`Phone: ${employee.phoneNumber}`, 30, yPos); yPos += 8;
      doc.text(`Email: ${employee.email}`, 30, yPos); yPos += 8;
      doc.text(`NIC: ${employee.nic}`, 30, yPos); yPos += 8;
      doc.text(`Salary: $${employee.salary} (Max: $${getSalaryLimit(employee.role)})`, 30, yPos); yPos += 15;
    });

    // Save PDF
    doc.save('employee-details.pdf');
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent mb-2">
                Employee List
              </h1>
              <p className="text-gray-400">Manage your employees</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={generatePDF}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Download PDF
              </button>
              <button
                onClick={() => navigate('/employee-manager/add-employee')}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-colors"
              >
                Add New Employee
              </button>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid gap-6">
            {loading ? (
              <p className="text-white text-center">Loading...</p>
            ) : filteredEmployees.length === 0 ? (
              <p className="text-white text-center">No employees found</p>
            ) : (
              filteredEmployees.map(employee => (
                <div key={employee._id} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{employee.name}</h3>
                      <p className="text-gray-300">ID: {employee.employeeId}</p>
                      <p className="text-gray-300">Role: {employee.role}</p>
                      <p className="text-gray-300">Phone: {employee.phoneNumber}</p>
                      <p className="text-gray-300">Email: {employee.email}</p>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${getSalaryColorClass(employee.salary, employee.role)}`}>
                          Salary: ${employee.salary}
                        </p>
                        <span className="text-xs text-gray-400">
                          (Max: ${getSalaryLimit(employee.role)})
                        </span>
                        {employee.salary >= getSalaryLimit(employee.role) * 0.9 && (
                          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
                            At Limit
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => navigate(`/employee-manager/edit-employee/${employee._id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
