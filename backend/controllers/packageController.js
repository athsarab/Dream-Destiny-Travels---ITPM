const Package = require('../models/Package');
const fs = require('fs').promises;
const path = require('path');

// Get all packages
exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single package
exports.getPackage = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(package);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a package
exports.createPackage = async (req, res) => {
    try {
        const packageData = req.body;
        if (req.file) {
            // Store the path relative to the uploads directory
            packageData.imageUrl = `/uploads/${req.file.filename}`;
        }
        
        const package = new Package(packageData);
        const newPackage = await package.save();
        res.status(201).json(newPackage);
    } catch (error) {
        // Delete uploaded file if package creation fails
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        res.status(400).json({ message: error.message });
    }
};

// Update a package
exports.updatePackage = async (req, res) => {
    try {
        const packageData = req.body;
        const oldPackage = await Package.findById(req.params.id);
        
        if (!oldPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        if (req.file) {
            // Delete old image if exists
            if (oldPackage.imageUrl) {
                const oldImagePath = path.join(__dirname, '..', oldPackage.imageUrl);
                await fs.unlink(oldImagePath).catch(() => {});
            }
            // Store the new image path
            packageData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const package = await Package.findByIdAndUpdate(
            req.params.id,
            packageData,
            { new: true }
        );
        res.json(package);
    } catch (error) {
        // Delete uploaded file if update fails
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        res.status(400).json({ message: error.message });
    }
};

// Delete a package
exports.deletePackage = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (package.imageUrl) {
            const imagePath = path.join(__dirname, '..', package.imageUrl);
            await fs.unlink(imagePath).catch(() => {});
        }
        await Package.findByIdAndDelete(req.params.id);
        res.json({ message: 'Package deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
