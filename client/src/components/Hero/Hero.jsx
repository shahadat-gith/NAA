import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';
import { heroImages } from '../../assets/images'; // Adjust the path to match your file structure

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Transform heroImages object into slides array
  const slides = Object.keys(heroImages).map((key, index) => ({
    src: heroImages[key],
  }));

  const totalSlides = slides.length;

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.clientWidth;
      sliderRef.current.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  };

  useEffect(() => {
    const autoSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const interval = setInterval(autoSlide, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [totalSlides]);

  useEffect(() => {
    goToSlide(currentSlide);
  }, [currentSlide]);

  return (
    <div className="hero-container">
      <div className="slider-wrapper">
        <div ref={sliderRef} className="slider">
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <img
                src={slide.src}
                className="slide-image"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="dot-indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Hero;