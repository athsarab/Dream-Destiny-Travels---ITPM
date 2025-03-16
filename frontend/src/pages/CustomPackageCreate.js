import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomPackageCreate = () => {
  const [categories, setCategories] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedOptions]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/custom-packages/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOptionSelect = (categoryName, option) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev };
      
      if (newOptions[categoryName]?.id === option._id) {
        // Deselect if already selected
        delete newOptions[categoryName];
      } else {
        // Select new option
        newOptions[categoryName] = {
          id: option._id,
          name: option.name,
          price: option.price
        };
      }
      
      return newOptions;
    });
  };

  const calculateTotalPrice = () => {
    const total = Object.values(selectedOptions).reduce((sum, option) => sum + option.price, 0);
    setTotalPrice(total);
  };

  const handleSubmit = () => {
    // This is where you would handle the booking process
    const selectedPackage = {
      options: selectedOptions,
      totalPrice: totalPrice
    };
    console.log('Selected package:', selectedPackage);
    alert('Your custom package has been created! Total: $' + totalPrice);
  };

  return (
    <div className="min-h-screen bg-dark-100 py-12 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Create Your Custom Package</h2>
        
        <div className="grid gap-8">
          {categories.map((category) => (
            <div key={category._id} className="bg-dark-200 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">{category.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.options.map((option) => (
                  <div
                    key={option._id}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedOptions[category.name]?.id === option._id
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-300 hover:bg-dark-400'
                    }`}
                    onClick={() => handleOptionSelect(category.name, option)}
                  >
                    <div className="font-medium mb-2">{option.name}</div>
                    <div className="text-sm opacity-90">{option.description}</div>
                    <div className="mt-2 font-bold">${option.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-dark-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="text-white">
              <span className="text-lg">Total Price: </span>
              <span className="text-2xl font-bold text-primary-400">${totalPrice}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedOptions).length === 0}
              className={`px-6 py-3 rounded-lg font-semibold ${
                Object.keys(selectedOptions).length === 0
                  ? 'bg-dark-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              Create Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPackageCreate;
