import React from 'react';
import './Loader.css';
import HashLoader from 'react-spinners/HashLoader';

const Loader = ({ text = "loading..." }) => {
  return (
    <div className='loader-container'>
      <div className="loader-content">
        <HashLoader
          color="#e94560"
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        {text && <p className="loader-text">{text}</p>}
      </div>
    </div>
  );
};

export default Loader;