import React from 'react';
import { useParams } from 'react-router-dom';
import Search from './Components/Search/Search';

const Payment = () => {
  const { type } = useParams();
  return (
    <div>
      <Search type={type} />
    </div>
  );
};

export default Payment;