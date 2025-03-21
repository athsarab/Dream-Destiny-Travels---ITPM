import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = {
  // Package APIs 
  getPackages: () => axios.get(`${API_URL}/packages`),
  getPackage: (id) => axios.get(`${API_URL}/packages/${id}`),
  createPackage: (data) => axios.post(`${API_URL}/packages`, data),
  updatePackage: (id, data) => axios.put(`${API_URL}/packages/${id}`, data),
  deletePackage: (id) => axios.delete(`${API_URL}/packages/${id}`),

  // Custom Package APIs
  getCategories: () => axios.get(`${API_URL}/custom-packages/categories`),
  createCustomPackage: (data) => axios.post(`${API_URL}/custom-packages/options`, data),
  deleteCategory: (id) => axios.delete(`${API_URL}/custom-packages/categories/${id}`),
  
  // Booking APIs
  submitBooking: (data) => axios.post(`${API_URL}/custom-packages/bookings`, data, {
    headers: { 'Content-Type': 'application/json' }
  }),
  getBookings: () => axios.get(`${API_URL}/custom-packages/bookings`),
  updateBookingStatus: (id, status) => axios.put(`${API_URL}/custom-packages/bookings/${id}`, { status }),

  // Package Booking APIs
  submitPackageBooking: (data) => axios.post(`${API_URL}/packages/bookings`, data),
  getPackageBookings: () => axios.get(`${API_URL}/packages/bookings`),
  updatePackageBookingStatus: (id, status) => axios.put(`${API_URL}/packages/bookings/${id}`, { status })
};

export default api;
