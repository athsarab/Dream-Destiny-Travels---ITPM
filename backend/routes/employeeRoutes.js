const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Define role-based salary limits
const SALARY_LIMITS = {
  'Driver': 500,
  'Travel Agent': 1200,
  'Supplier': 450,
  'Worker': 350
};

// Debug middleware for tracking requests
router.use((req, res, next) => {
    console.log(`Employee API Request: ${req.method} ${req.url}`);
    next();
});

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort('-createdAt'); // Add sorting
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update the get single employee route to include error handling
router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching employee with ID:', req.params.id);
        
        // Validate MongoDB ID format
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('Invalid ID format:', req.params.id);
            return res.status(400).json({ 
                message: 'Invalid employee ID format',
                details: 'The provided ID is not a valid MongoDB ObjectId'
            });
        }

        const employee = await Employee.findById(req.params.id);
        
        if (!employee) {
            console.log('No employee found with ID:', req.params.id);
            return res.status(404).json({ 
                message: 'Employee not found',
                details: 'The employee you are looking for does not exist or may have been deleted'
            });
        }
        
        console.log('Successfully found employee:', employee);
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ 
            message: 'Server error while fetching employee',
            details: error.message 
        });
    }
});

// Add new employee
router.post('/', async (req, res) => {
    try {
        const { employeeId, phoneNumber, nic, email, salary, role } = req.body;

        // Check for duplicates
        const duplicateEmployee = await Employee.findOne({
            $or: [
                { employeeId: employeeId },
                { phoneNumber: phoneNumber },
                { nic: nic },
                { email: email }
            ]
        });

        if (duplicateEmployee) {
            let duplicateField = '';
            if (duplicateEmployee.employeeId === employeeId) duplicateField = 'Employee ID';
            else if (duplicateEmployee.phoneNumber === phoneNumber) duplicateField = 'Phone Number';
            else if (duplicateEmployee.nic === nic) duplicateField = 'NIC';
            else if (duplicateEmployee.email === email) duplicateField = 'Email';

            return res.status(400).json({
                message: `${duplicateField} already exists. Please use a different ${duplicateField.toLowerCase()}.`
            });
        }

        // Role-based salary validation
        if (role && SALARY_LIMITS[role]) {
            const maxSalary = SALARY_LIMITS[role];
            if (salary > maxSalary) {
                return res.status(400).json({ 
                    message: `Salary for ${role} cannot exceed $${maxSalary}` 
                });
            }
        } else if (salary > 2500) {
            // Global max if role doesn't have a specific limit
            return res.status(400).json({ 
                message: 'Salary cannot exceed $2,500' 
            });
        }

        if (salary <= 0) {
            return res.status(400).json({ 
                message: 'Salary must be greater than 0' 
            });
        }

        // Phone number validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ 
                message: 'Phone number must be exactly 10 digits' 
            });
        }

        // Create new employee
        const employee = new Employee(req.body);
        const savedEmployee = await employee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        console.error('Error saving employee:', error);
        res.status(400).json({ 
            message: error.message,
            details: error.errors
        });
    }
});

// Update employee
router.put('/:id', async (req, res) => {
    try {
        const { employeeId, phoneNumber, nic, email, salary, role } = req.body;

        // Check for duplicates excluding current employee
        const duplicateEmployee = await Employee.findOne({
            _id: { $ne: req.params.id },
            $or: [
                { employeeId: employeeId },
                { phoneNumber: phoneNumber },
                { nic: nic },
                { email: email }
            ]
        });

        if (duplicateEmployee) {
            let duplicateField = '';
            if (duplicateEmployee.employeeId === employeeId) duplicateField = 'Employee ID';
            else if (duplicateEmployee.phoneNumber === phoneNumber) duplicateField = 'Phone Number';
            else if (duplicateEmployee.nic === nic) duplicateField = 'NIC';
            else if (duplicateEmployee.email === email) duplicateField = 'Email';

            return res.status(400).json({
                message: `${duplicateField} already exists. Please use a different ${duplicateField.toLowerCase()}.`
            });
        }

        // Role-based salary validation
        if (role && SALARY_LIMITS[role]) {
            const maxSalary = SALARY_LIMITS[role];
            if (salary > maxSalary) {
                return res.status(400).json({ 
                    message: `Salary for ${role} cannot exceed $${maxSalary}` 
                });
            }
        } else if (salary > 2500) {
            // Global max if role doesn't have a specific limit
            return res.status(400).json({ 
                message: 'Salary cannot exceed $2,500' 
            });
        }

        if (salary <= 0) {
            return res.status(400).json({ 
                message: 'Salary must be greater than 0' 
            });
        }

        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete employee
router.delete('/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
