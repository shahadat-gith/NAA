import React from 'react'
import Header from '../../components/Header/Header'
import Curriculum from '../../components/Curriculum/Curriculum'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'
import MessageSection from '../../components/MessageSection/MessageSection'
import TeachersSection from '../../components/TeachersSection/TeachersSection'
import TestimonialsSection from '../../components/TestimonialSection/TestimonialsSection'

const Home = () => {
  return (
    <div>
      <Header 
      title = {"Nashib Ali Academy"}
      tagline={ "Excellence in Education"}
      />
      <Curriculum/>
      <WhyChooseUs/>
      <MessageSection/>
      <TeachersSection/>
      <TestimonialsSection/>
    </div>
  )
}

export default Home