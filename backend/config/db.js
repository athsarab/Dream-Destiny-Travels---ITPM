const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        // Try to clean up the URI in case it wasn't properly formatted
        let uri = process.env.MONGODB_URI;
        
        // If it doesn't start with mongodb://, add it
        if (!uri.startsWith('mongodb')) {
            uri = `mongodb+srv://${uri}`;
        }
        
        console.log('Attempting to connect to MongoDB...');
        
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority'
        };

        const conn = await mongoose.connect(uri, options);
        
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

        return conn;

    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.error('Please check your MongoDB URI and credentials');
        console.log('\nIMPORTANT: You need to whitelist your IP address in MongoDB Atlas:');
        console.log('1. Log in to https://cloud.mongodb.com');
        console.log('2. Select your cluster');
        console.log('3. Click on "Network Access" in the left menu');
        console.log('4. Click "Add IP Address"');
        console.log('5. Click "Add Current IP Address" or enter 0.0.0.0/0 to allow access from anywhere (not recommended for production)\n');
        
        // For development purposes, let's suggest using a local MongoDB
        console.log('Alternatively, for development you could:');
        console.log('1. Install MongoDB Community Edition locally: https://www.mongodb.com/try/download/community');
        console.log('2. Update your .env file to use: MONGODB_URI=mongodb://localhost:27017/dream-destiny\n');
        
        // Don't exit process in production, let it retry
        if (process.env.NODE_ENV === 'production') {
            console.log('Retrying connection in 5 seconds...');
            setTimeout(connectDB, 5000);
        } else {
            // Don't exit immediately for development
            console.log('Using fallback solution for development...');
            
            try {
                // Try to use a simpler connection string with no authentication for local development
                const localUri = 'mongodb://localhost:27017/dream-destiny';
                console.log('Attempting to connect to local MongoDB at:', localUri);
                
                return mongoose.connect(localUri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }).then(conn => {
                    console.log('Connected to local MongoDB');
                    return conn;
                }).catch(err => {
                    console.error('Failed to connect to local MongoDB:', err.message);
                    console.error('Application will exit now');
                    process.exit(1);
                });
            } catch (localError) {
                console.error('Failed to connect to local MongoDB:', localError.message);
                process.exit(1);
            }
        }
    }
};

module.exports = connectDB;
