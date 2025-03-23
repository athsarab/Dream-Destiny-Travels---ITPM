const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Debug middleware for tracking requests
router.use((req, res, next) => {
    console.log(`Employee API Request: ${req.method} ${req.url}`);
    next();
});

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
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
        const { phoneNumber } = req.body;

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
