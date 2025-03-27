import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create an axios instance with better default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 15000, // 15 seconds
  withCredentials: false
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  error => {
    // Enhanced error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config.url
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', {
        request: error.request,
        url: error.config?.url,
        message: 'No response received from server'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Health check function
const checkServerHealth = async () => {
  try {
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.data.status === 'Server is running';
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
};

const api = {
  // Server health check
  checkHealth: checkServerHealth,
  
  // Package operations with retry logic
  getPackages: async (retries = 1) => {
    try {
      const response = await apiClient.get('/packages');
      
      // Verify that the response contains valid data
      if (!response || !response.data) {
        console.warn('API response missing data property');
        return { data: [] };
      }
      
      // Validate that data is an array
      if (!Array.isArray(response.data)) {
        console.warn('API response data is not an array:', typeof response.data);
        return { data: [] };
      }
      
      // Filter out any null entries
      const validPackages = response.data.filter(pkg => pkg !== null);
      return { data: validPackages };
    } catch (error) {
      if (retries > 0 && (!error.response || error.response.status >= 500)) {
        console.log(`Retrying getPackages... (${retries} attempts left)`);
        await new Promise(r => setTimeout(r, 1000)); // Wait 1 second
        return api.getPackages(retries - 1);
      }
      throw error;
    }
  },
  getPackage: async (id) => {
    const response = await apiClient.get(`/packages/${id}`);
    // Ensure we never return null
    return response && response.data ? response : { data: {} };
  },
  createPackage: (data) => apiClient.post('/packages', data),
  updatePackage: (id, data) => apiClient.put(`/packages/${id}`, data),
  deletePackage: (id) => apiClient.delete(`/packages/${id}`),
  
  // Test connection with detailed result
  testConnection: async () => {
    try {
      const response = await apiClient.get('/packages');
      return {
        success: true,
        status: response.status,
        data: response.data,
        message: 'Connection successful'
      };
    } catch (error) {
      const errorObj = {
        success: false,
        status: error.response?.status || 'No response',
        error: error.message
      };

      if (error.code === 'ECONNREFUSED') {
        errorObj.message = 'Server is not running. Please start the backend server.';
      } else if (error.code === 'ETIMEDOUT') {
        errorObj.message = 'Connection timed out. Server might be overloaded.';
      } else if (error.response?.status === 404) {
        errorObj.message = 'API endpoint not found. Check your routes.';
      } else if (!error.response) {
        errorObj.message = 'Network error. Check your internet connection and server status.';
      } else {
        errorObj.message = `Server error: ${error.response?.data?.message || error.message}`;
      }

      return errorObj;
    }
  }
};

export default api;
