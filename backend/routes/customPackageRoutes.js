const express = require('express');
const router = express.Router();
const CustomPackageOption = require('../models/CustomPackageOption');

// Debug middleware
router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await CustomPackageOption.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        console.error('Error in GET /categories:', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/options', async (req, res) => {
    try {
        const { name, options } = req.body;
        
        if (!name || !options || !Array.isArray(options)) {
            return res.status(400).json({ 
                message: 'Invalid request data',
                received: { name, options }
            });
        }

        let packageOption = await CustomPackageOption.findOne({ name: name });
        
        if (packageOption) {
            // Add new options to existing category
            packageOption.options = [...packageOption.options, ...options];
        } else {
            // Create new category with options
            packageOption = new CustomPackageOption({
                name,
                options
            });
        }

        const savedPackage = await packageOption.save();
        console.log('Saved successfully:', savedPackage);
        res.status(201).json(savedPackage);
    } catch (error) {
        console.error('Error saving options:', error);
        res.status(500).json({ 
            message: 'Error saving options',
            error: error.message 
        });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        await CustomPackageOption.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
