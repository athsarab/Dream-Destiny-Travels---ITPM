const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Set up connection error handler
        conn.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        conn.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });

        conn.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });

    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.error('Please check your MongoDB URI and credentials');
        // Don't exit process in production, let it retry
        if (process.env.NODE_ENV === 'production') {
            console.log('Retrying connection in 5 seconds...');
            setTimeout(connectDB, 5000);
        } else {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
