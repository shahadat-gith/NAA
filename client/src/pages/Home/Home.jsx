import React from 'react'
import Header from '../../components/Header/Header'
import Curriculum from '../../components/Curriculum/Curriculum'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'
import MessageSection from '../../components/MessageSection/MessageSection'
import TeachersSection from '../../components/TeachersSection/TeachersSection'
import SalientFeatures from '../../components/SalientFeatures/SalientFeatures'
import Hero from '../../components/Hero/Hero'

const Home = () => {
  return (
    <div>
     
      <Hero/>
      <MessageSection/>
      <TeachersSection/>
      <SalientFeatures/>
      <Curriculum/>
      <WhyChooseUs/>
    </div>
  )
}

export default Home