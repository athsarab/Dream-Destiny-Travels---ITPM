import axios from 'axios';

const BASE_URL = 'http://localhost:8090/api/reviews';

const reviewService = {
  getAllReviews: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/`);
      return response;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  createReview: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/`, {
        name: data.reviewerName,
        country: data.reviewerCountry,
        comment: data.comment
      });
      return response;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  updateReview: async (id, data) => {
    try {
      console.log('Updating review:', { id, data });
      const response = await axios.put(`${BASE_URL}/${id}`, {
        name: data.name,
        country: data.country,
        comment: data.comment
      });
      return response;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  },

  deleteReview: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
};

export default reviewService;
