/**
 * Utility functions for debugging API and server issues
 */

// Report detailed errors to console
export const reportAPIError = (error, context) => {
  console.group(`🔴 API Error: ${context}`);
  console.error('Message:', error.message);
  
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    console.error('Headers:', error.response.headers);
  } else if (error.request) {
    console.error('Request made but no response received');
    console.error(error.request);
  } else {
    console.error('Error setting up request:', error.message);
  }
  
  if (error.stack) {
    console.error('Stack trace:', error.stack);
  }
  
  console.groupEnd();
  
  return {
    type: error.response ? 'SERVER_ERROR' : 'NETWORK_ERROR',
    status: error.response?.status,
    message: error.message,
    serverMessage: error.response?.data?.message
  };
};

// Check server capabilities and debug info
export const checkServerCapabilities = async (api) => {
  try {
    const endpoints = [
      { path: '/api/health', name: 'Health Check' },
      { path: '/api/packages', name: 'Packages API' },
      { path: '/api/packages/public', name: 'Public Packages API' }
    ];
    
    console.group('🔍 Server Diagnostics');
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint.name}`);
        const response = await api.axios.get(endpoint.path, { timeout: 3000 });
        console.log(`✅ ${endpoint.name}: ${response.status}`);
      } catch (err) {
        console.error(`❌ ${endpoint.name}: ${err.message}`);
      }
    }
    
    console.groupEnd();
  } catch (e) {
    console.error('Diagnostics failed:', e);
  }
};

export default {
  reportAPIError,
  checkServerCapabilities
};
