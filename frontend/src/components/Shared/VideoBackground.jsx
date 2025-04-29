import React, { useState } from 'react';

const VideoBackground = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="fixed inset-0 z-0">
      {isLoading && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
          <div className="text-white">Loading video...</div>
        </div>
      )}
      <video
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={() => setIsLoading(false)}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/homepagevideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
};

export default VideoBackground;
