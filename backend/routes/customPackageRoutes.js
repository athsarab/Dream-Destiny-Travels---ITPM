const express = require('express');
const router = express.Router();
const CustomPackageOption = require('../models/CustomPackageOption');
const CustomPackageBooking = require('../models/CustomPackageBooking');
const nodemailer = require('nodemailer');

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

// Create booking request
router.post('/bookings', async (req, res) => {
    try {
        const {
            customerName,
            email,
            phoneNumber,
            travelDate,
            additionalNotes,
            selectedOptions,
            totalPrice
        } = req.body;

        // Validate required fields
        if (!customerName || !email || !phoneNumber || !travelDate || !selectedOptions) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create booking
        const bookingData = {
            customerName,
            email,
            phoneNumber,
            travelDate: new Date(travelDate),
            additionalNotes: additionalNotes || '',
            selectedOptions,
            totalPrice: parseFloat(totalPrice),
            status: 'pending'
        };

        const booking = new CustomPackageBooking(bookingData);
        const savedBooking = await booking.save();

        // Respond immediately, handle email sending separately
        res.status(201).json(savedBooking);

        // Send email asynchronously
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Custom Package Booking Received',
                text: `Dear ${customerName},\n\nThank you for your booking request.\n\nBooking Details:\nTravel Date: ${new Date(travelDate).toLocaleString()}\nTotal Price: $${totalPrice}\n\nWe will review your request and get back to you soon.\n\nBest regards,\nDream Destiny Travel Team`
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Don't fail the request if email fails
        }
    } catch (error) {
        console.error('Booking error:', error);
        res.status(400).json({ 
            message: 'Error creating booking',
            error: error.message 
        });
    }
});

// Get all booking requests
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await CustomPackageBooking.find().sort('-createdAt');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update booking status
router.put('/bookings/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await CustomPackageBooking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: booking.email,
            subject: `Custom Package Booking ${status}`,
            text: `Dear ${booking.customerName},\n\nYour custom package booking has been ${status}.\n\nTotal Price: $${booking.totalPrice}\nTravel Date: ${booking.travelDate}\n\nThank you for choosing our service!`
        });

        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
