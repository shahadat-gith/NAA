
import { Helmet } from "react-helmet-async";
import Hero from "./Components/Hero/Hero";
import MessageSection from "./Components/MessageSection/MessageSection";
import SalientFeatures from "./Components/SalientFeatures/SalientFeatures";
import Curriculum from "./Components/Curriculum/Curriculum";
import WhyChooseUs from "./Components/WhyChooseUs/WhyChooseUs";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Nashib Ali Academy | Quality Education in Barpeta, Assam</title>
        <meta
          name="description"
          content="Nashib Ali Academy is a reputed educational institution in Barpeta, Assam providing quality education with experienced teachers and modern facilities."
        />
      </Helmet>

      <Hero />
      <MessageSection />
      <SalientFeatures />
      <Curriculum />
      <WhyChooseUs />
    </div>
  )
}

export default Home