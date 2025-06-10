import React from 'react';
import { useParams } from 'react-router-dom';
import Search from './Components/Search/Search';
import Result from './Result/Result';
import IdCard from './ID/IdCard';

const Services = () => {
  const { type } = useParams();
  return (
    <div>
      {(type === "admit-card") && <Search type={type} />}
      {type === "result" && <Result/>}
      {type === "id-card" && <IdCard/>}
    </div>
  );
};

export default Services;