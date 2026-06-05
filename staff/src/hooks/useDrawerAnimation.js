import { useState, useEffect } from "react";

/**
 * Reusable layout engine hook for butter-smooth mobile sheet drawers.
 * @param {boolean} visible - Parent trigger monitoring presentation lifecycle.
 * @param {number} duration - Sliding frame timeout length matching CSS configuration tracks (ms).
 */
export const useDrawerAnimation = (visible, duration = 300) => {
  const [render, setRender] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (visible) {
      setRender(true);
      document.body.style.overflow = "hidden";
      // Step into slide transition frame right after DOM element mount phase paint
      const frameTimeout = setTimeout(() => setAnimate(true), 30);
      return () => clearTimeout(frameTimeout);
    } else {
      setAnimate(false);
      document.body.style.overflow = "";
      // Block unmount track run until downward transition slides out completely
      const unmountTimeout = setTimeout(() => setRender(false), duration - 20);
      return () => clearTimeout(unmountTimeout);
    }
  }, [visible, duration]);

  return { render, animate };
};