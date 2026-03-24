import React, { useState, useEffect, useContext } from "react";
import "./Hero.css";
import { AppContext } from "../../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";

const Hero = () => {
  const { heroImages, serviceSettings } = useContext(AppContext);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = heroImages?.length || 0;

  // Auto-slide logic
  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  if (totalSlides === 0) return null;

  return (
    <div className="hero-container">
      <div className="slider-wrapper">
        {/* Slider Move Logic */}
        <div 
          className="slider" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroImages.map((img, index) => (
            <div key={img._id || index} className="slide">
              <img
                src={img.url}
                alt={`Hero ${index + 1}`}
                className="slide-image"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* This stays centered while slides move underneath */}
        <CountdownTimer />
      </div>

      {/* Admission Notice */}
      {serviceSettings?.admission && (
        <div className="admission-notice" onClick={() => navigate("/admission")}>
          <div className="admission-track">
            <span className="admission-text">
              Admission is going on for the session 2026-2027 
              <span className="admission-cta"> Click here to apply now</span>
            </span>
          </div>
        </div>
      )}

      {/* Dots */}
      <div className="dot-indicators">
        {heroImages.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;