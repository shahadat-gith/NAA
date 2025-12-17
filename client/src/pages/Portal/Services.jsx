import React from 'react';
import { useParams } from 'react-router-dom';
import Search from './Components/Search/Search';
import Result from './Result/Result';
import Admission from './Admission/Admission';

const Services = () => {
  const { type } = useParams();
  return (
    <div>
      {(type === "admit-card") && <Search type={type} />}
      {type === "result" && <Result/>}
      {type === "admission" && <Admission/>}
    </div>
  );
};

export default Services;