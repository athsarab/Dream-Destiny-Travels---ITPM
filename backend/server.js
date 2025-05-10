try {
  require('dotenv').config();
} catch (err) {
  console.error('Error loading dotenv. Make sure to run "npm install dotenv"');
  console.error('Using default environment variables instead');
  // Set default values if .env fails to load
  process.env.PORT = process.env.PORT || 5000;
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/custom-packages', require('./routes/customPackageRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });