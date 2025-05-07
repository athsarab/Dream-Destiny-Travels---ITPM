import axios from 'axios';

const BASE_URL = 'http://localhost:8090/api/complaints';

const complaintService = {
  createComplaint: async (data) => {
    try {
      // Store complaint in localStorage since backend isn't ready
      const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      const newComplaint = {
        id: Date.now(),
        ...data,
        date: new Date().toISOString()
      };
      complaints.push(newComplaint);
      localStorage.setItem('complaints', JSON.stringify(complaints));
      return { data: newComplaint };
    } catch (error) {
      console.error('Error saving complaint:', error);
      throw error;
    }
  },

  getAllComplaints: async () => {
    try {
      // Retrieve complaints from localStorage
      const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      return { data: complaints };
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  }
};

export default complaintService;
