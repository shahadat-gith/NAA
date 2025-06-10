import React from 'react';
import './Loader.css';
import HashLoader from 'react-spinners/HashLoader';

const Loader = ({ text = "loading..." }) => {
  return (
    <div className='loader-container-admin'>
      <div className="loader-content-admin">
        <HashLoader
          color="#e94560"
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        {text && <div className="loader-text-admin">{text}</div>}
      </div>
    </div>
  );
};

export default Loader;