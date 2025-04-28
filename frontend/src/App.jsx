// App.jsx
import React from 'react';
import Review from './pages/review';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Review />
    </BrowserRouter>
  );
};

export default App;
