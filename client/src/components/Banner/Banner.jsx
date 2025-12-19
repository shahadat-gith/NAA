import React from 'react';
import './Banner.css';

const Banner = ({image }) => {
  return (
    <div
      className="banner-container"
      style={{
        backgroundImage: image ? `url(${image})` : 'none',
        backgroundColor: image ? 'transparent' : '#f0f0f0', // Fallback background color
      }}
    >
    </div>
  );
};

export default Banner;