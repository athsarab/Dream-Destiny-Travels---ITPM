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
  
  // Direct axios instance for custom calls
  axios: api
};

export default apiService;
