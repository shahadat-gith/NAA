import React from 'react';
import { useParams } from 'react-router-dom';
import Result from './Result/Result';
import Admission from './Admission/Admission';

const Services = () => {
  const { type } = useParams();
  return (
    <div>
      {type === "result" && <Result/>}
      {type === "admission" && <Admission/>}
    </div>
  );
};

export default Services;