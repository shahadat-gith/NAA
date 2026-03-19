import { useEffect, useState } from "react";
import "./Countdown.css";

const Countdown = ({ targetDate }) => {

  const calculateTimeLeft = () => {
    const diff = new Date(targetDate) - new Date();

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // 🔥 update every second

    return () => clearInterval(timer);
  }, [targetDate]);

  const format = (val) => String(val).padStart(2, "0");

  if (!timeLeft) {
    return (
      <span className="live-badge">
        <i className="fas fa-circle live-dot"></i> Live Now
      </span>
    );
  }

  return (
    <span className="countdown-badge">
      <i className="fas fa-clock"></i>

      {timeLeft.days > 0 && (
        <span className="cd-part">{timeLeft.days}d</span>
      )}

      <span className="cd-part">{format(timeLeft.hours)}h</span>
      <span className="cd-part">{format(timeLeft.minutes)}m</span>
      <span className="cd-part">{format(timeLeft.seconds)}s</span>
    </span>
  );
};

export default Countdown;