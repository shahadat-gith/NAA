import React, { useState, useEffect } from "react";
import "./CountdownTimer.css";
import { Link } from "react-router-dom";

const countdownDetails = {
  title: "Annual Result Declaration",
  description: "Results for session 2025–2026 will be live on the portal.",
  date: "2026-03-27",
  time: "10:00 AM",
  onCompleteMessage: "Result is Live",
  linkUrl: "/result",
  linkBtntext: "Check Your Result",
};

const getTimeLeft = (date, time) => {
  const target = new Date(`${date} ${time}`);
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const pad = (n) => String(n ?? 0).padStart(2, "0");

const CountdownTimer = () => {
  const {
    title,
    description,
    date,
    time,
    onCompleteMessage,
    linkUrl,
    linkBtntext,
  } = countdownDetails;

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(date, time));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(date, time));
    }, 1000);

    return () => clearInterval(timer);
  }, [date, time]);

  const units = [
    { label: "Days", value: timeLeft?.days },
    { label: "Hrs", value: timeLeft?.hours },
    { label: "Min", value: timeLeft?.minutes },
    { label: "Sec", value: timeLeft?.seconds },
  ];

  const isLive = timeLeft === null;

  return (
    <div className="ct-overlay">
      <div className="ct-card">
        {/* Badge */}
        <div className="ct-badge-wrapper">
          <span className="ct-badge">
            <i className="fa-solid fa-bullhorn ct-icon"></i>
            {isLive ? " Live Now" : " Upcoming"}
          </span>
        </div>

        {/* Title */}
        <h3 className="ct-title">
          {isLive ? onCompleteMessage : title}
        </h3>

        {/* Description */}
        {!isLive && <p className="ct-desc">{description}</p>
        }
        {/* Timer / Result Button */}
        <div className="ct-timer-box">
          {isLive ? (
            <div className="ct-live-wrapper">
              <Link to={linkUrl} className="ct-result-link">
                <i className="fa-solid fa-circle-check ct-icon"></i>
                {linkBtntext}
              </Link>
            </div>
          ) : (
            <div className="ct-grid">
              {units.map(({ label, value }, i) => (
                <React.Fragment key={label}>
                  <div className="ct-unit">
                    <span className="ct-number">{pad(value)}</span>
                    <span className="ct-label">{label}</span>
                  </div>
                  {i < units.length - 1 && (
                    <span className="ct-separator">:</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;