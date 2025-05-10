import React, { useState, useEffect } from 'react';

const VideoBackground = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Check if video can play
    const video = document.createElement('video');
    if (video.canPlayType('video/mp4') === '') {
      setUseFallback(true);
    }
  }, []);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setUseFallback(true);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
      {/* Gradient overlay with smooth transition */}
      <div className={`absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-black/70 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
      
      {useFallback ? (
        // Fallback image if video fails to load
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/fallback-homepage-image.jpg')" }}
        />
      ) : (
        // Video element with loading optimization
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={handleLoadedData}
          onError={handleError}
          className={`absolute top-1/2 left-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Background video showing travel destinations"
        >
          <source src="/homepagevideo.mp4" type="video/mp4" />
          <source src="/homepagevideo.webm" type="video/webm" /> {/* Alternative format */}
          Your browser does not support HTML5 video.
        </video>
      )}
      
      {/* Loading indicator (only shown briefly) */}
      {!isLoaded && !useFallback && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
  );
};

export default React.memo(VideoBackground);