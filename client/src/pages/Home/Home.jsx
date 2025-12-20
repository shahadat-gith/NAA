
import Curriculum from '../Curriculum/Curriculum'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'
import MessageSection from '../../components/MessageSection/MessageSection'
import TeachersSection from '../../components/TeachersSection/TeachersSection'
import SalientFeatures from '../../components/SalientFeatures/SalientFeatures'
import Hero from '../../components/Hero/Hero'
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Nashib Ali Academy | Quality Education in Assam</title>
        <meta
          name="description"
          content="Nashib Ali Academy is a reputed educational institution in Barpeta, Assam providing quality education with experienced teachers and modern facilities."
        />
      </Helmet>

      <Hero />
      <MessageSection />
      <TeachersSection />
      <SalientFeatures />
      <Curriculum />
      <WhyChooseUs />
    </div>
  )
}

export default Home