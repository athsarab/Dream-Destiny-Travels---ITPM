import React, { useState, useEffect } from 'react';

const PackageCard = ({ packageData }) => {
    const [imageError, setImageError] = useState(false);
    const placeholderImage = '/images/placeholder.jpg'; // Make sure this exists in public/images/

    const handleImageError = (e) => {
        console.error('Image failed to load:', packageData.imageUrl);
        setImageError(true);
        e.target.src = placeholderImage;
        e.target.onerror = null; // Prevent infinite loop if placeholder also fails
    };

    return (
        <div className="bg-dark-200 rounded-lg shadow-lg overflow-hidden">
            <img 
                src={imageError ? placeholderImage : packageData.imageUrl}
                alt={packageData.name || 'Travel Package'}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={handleImageError}
                onLoad={() => console.log('Image loaded successfully:', packageData.imageUrl)}
            />
            <div className="p-4">
                <h3 className="text-xl font-bold text-white">{packageData.name}</h3>
                <p className="text-white/90">{packageData.description}</p>
                <p className="text-primary-400 font-bold mt-2">${packageData.price}</p>
            </div>
        </div>
    );
};

export default PackageCard;