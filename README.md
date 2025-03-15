# Dream Destiny Travel Agency

A MERN stack application for managing travel packages with admin and client functionalities.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Create .env file in backend directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   PORT=5000
   ```

3. Start the application:
   ```bash
   npm start
   ```

This will run both frontend (port 3000) and backend (port 5000) concurrently.

## Features

- Admin package management (CRUD operations)
- Client package viewing and booking
- Custom package creation
- Photo upload functionality
- Dynamic pricing based on pax count
