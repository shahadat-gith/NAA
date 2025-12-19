import React, { useState, useEffect, useRef, useContext } from "react";
import "./Hero.css";
import { AppContext } from "../../context/AppContext";

const Hero = () => {
  const { heroImages } = useContext(AppContext);

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const totalSlides = heroImages.length;

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.clientWidth;
      sliderRef.current.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  };

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (totalSlides === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  /* ================= MOVE SLIDE ================= */
  useEffect(() => {
    if (totalSlides === 0) return;
    goToSlide(currentSlide);
  }, [currentSlide, totalSlides]);

  if (totalSlides === 0) {
    return null; 
  }

  return (
    <div className="hero-container">
      <div className="slider-wrapper">
        <div ref={sliderRef} className="slider">
          {heroImages.map((img, index) => (
            <div key={img._id} className="slide">
              <img
                src={img.url}
                alt={`Hero ${index + 1}`}
                className="slide-image"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* DOT INDICATORS */}
      <div className="dot-indicators">
        {heroImages.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Hero;
