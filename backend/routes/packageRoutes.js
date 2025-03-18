const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    getPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage
} = require('../controllers/packageController');

router.get('/', getPackages);
router.get('/:id', getPackage);
router.post('/', upload.single('image'), createPackage);
router.put('/:id', upload.single('image'), updatePackage);
router.delete('/:id', deletePackage);

module.exports = router;
