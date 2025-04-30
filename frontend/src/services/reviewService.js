import axios from 'axios';

const BASE_URL = 'http://localhost:8090/api/review';

const reviewService = {
  getAllReviews: async () => {
    return await axios.get(`${BASE_URL}/getall`);
  },

  createReview: async (data) => {
    return await axios.post(`${BASE_URL}/add`, {
      type: data.type,
      name: data.name,
      country: data.country,
      rating: data.rating,
      comment: data.comment,
      date: data.date
    });
  },

  updateReview: async (id, data) => {
    return await axios.put(`${BASE_URL}/update/${id}`, data);
  },

  deleteReview: async (id) => {
    return await axios.delete(`${BASE_URL}/delete/${id}`);
  }
};

export default reviewService;
