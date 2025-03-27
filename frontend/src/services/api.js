import axios from 'axios';

const baseURL = 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 8000
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    // Check for specific error types
    if (error.code === 'ECONNREFUSED' || !error.response) {
      throw new Error('Unable to connect to server. Please check if the server is running.');
    }
    if (error.response?.status === 404) {
      throw new Error('The requested resource was not found.');
    }
    throw error;
  }
);

const apiService = {
  // Health check
  checkHealth: async () => {
    try {
      const response = await api.get('/api/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  // Updated package methods with better error handling and retry capability
  getPackages: async (retryCount = 0) => {
    try {
      console.log('Fetching packages from:', `${baseURL}/api/packages`);
      
      // Try alternate endpoint if we're retrying
      const endpoint = retryCount > 0 ? '/api/packages/public' : '/api/packages';
      const response = await api.get(endpoint);
      
      // Validate response
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      // Ensure we have an array
      const packages = Array.isArray(response.data) ? response.data : [];
      console.log('Packages received:', packages.length);
      
      return {
        data: packages,
        status: response.status,
        source: endpoint
      };
    } catch (error) {
      console.error('API Error Details:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : 'No response',
        stack: error.stack
      });
      
      // Try fallback if this is the first attempt
      if (retryCount === 0) {
        console.log('Retrying with alternate endpoint...');
        try {
          return await apiService.getPackages(retryCount + 1);
        } catch (fallbackError) {
          console.error('Fallback attempt also failed:', fallbackError.message);
        }
      }
      
      if (error.response?.status === 404) {
        throw new Error('Package service not found');
      } else if (error.response?.status === 500) {
        throw new Error('Server error occurred. The backend might be experiencing issues.');
      }
      
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch packages. Please try again later.'
      );
    }
  },

  getPublicPackages: async () => {
    try {
      const response = await api.get('/api/packages/public');
      return response.data;
    } catch (error) {
      console.error('Error fetching public packages:', error);
      throw new Error('Unable to load packages. Please try again later.');
    }
  },

  getPackage: (id) => api.get(`/api/packages/${id}`),
  createPackage: (data) => api.post('/api/packages', data),
  updatePackage: (id, data) => api.put(`/api/packages/${id}`, data),
  deletePackage: (id) => api.delete(`/api/packages/${id}`),
  
  // Custom package methods
  getCustomBookings: () => api.get('/api/custom-packages/bookings'),
  updateCustomBooking: (id, status) => api.put(`/api/custom-packages/bookings/${id}`, { status }),
  deleteCustomBooking: (id) => api.delete(`/api/custom-packages/bookings/${id}`),

  // Update package booking methods to use the api instance instead of axios directly
  submitPackageBooking: (bookingData) => {
    return api.post('/api/packages/bookings', bookingData);
  },

  getPackageBookings: () => {
    return api.get('/api/packages/bookings');
  },

  updatePackageBookingStatus: (bookingId, status) => {
    return api.put(`/api/packages/bookings/${bookingId}`, { status });
  },

  // Improved delete method with better error handling for 404s
  deletePackageBooking: async (bookingId) => {
    if (!bookingId) {
        throw new Error('Booking ID is required');
    }

    try {
        console.log(`Attempting to delete booking with ID: ${bookingId}`);
        
        // The issue is with the URL path - it should be a direct path without /api prefix
        // since the axios instance already has baseURL set to include that
        const response = await api.delete(`/api/packages/bookings/${bookingId}`);
        
        console.log('Delete response:', response);
        
        if (!response.data?.success) {
            console.error('Delete operation returned without success flag');
            throw new Error('Delete operation failed on server');
        }

        return response;
    } catch (error) {
        console.error('Delete request failed:', error);
        
        // This is a special case - we're getting a 404 which means the endpoint is wrong
        if (error.message && error.message.includes('not found')) {
            // Try alternative URL format as a fallback
            try {
                console.log('Trying alternative URL format...');
                const altResponse = await api.delete(`/packages/bookings/${bookingId}`);
                console.log('Alternative delete response:', altResponse);
                return altResponse;
            } catch (altError) {
                console.error('Alternative request also failed:', altError);
                throw new Error(`Cannot delete booking: ${altError.message}`);
            }
        }
        
        // Better error handling with specific messages
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 404) {
                throw new Error('The booking was not found or has already been deleted');
            } else if (error.response.status === 400) {
                throw new Error('Invalid booking ID format');
            } else {
                throw new Error(`Server error: ${error.response.data?.message || error.message}`);
            }
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from server. Please check your connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Request setup error: ${error.message}`);
        }
    }
  },
  
  // Direct axios instance for custom calls
  axios: api
};

export default apiService;
