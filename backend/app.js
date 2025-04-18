const express = require('express');
const path = require('path');
const cors = require('cors');

// ...existing code...

// Ensure uploads directory exists
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS
app.use(cors());

// ...existing code...