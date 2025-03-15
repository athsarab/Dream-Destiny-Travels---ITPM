const Package = require('../models/Package');

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
        const package = new Package(req.body);
        const newPackage = await package.save();
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a package
exports.updatePackage = async (req, res) => {
    try {
        const package = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(package);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a package
exports.deletePackage = async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);
        res.json({ message: 'Package deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
