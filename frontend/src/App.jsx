import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Review from './pages/review';
import Complaint from './pages/complaint';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Review />} />
        <Route path="/complaint" element={<Complaint />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;