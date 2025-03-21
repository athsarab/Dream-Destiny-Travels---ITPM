import React from 'react';

const VideoBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute inset-0 bg-black/50 z-10" /> {/* Overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 min-h-full min-w-full object-cover"
      >
        <source src="/homepagevideo.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoBackground;
