import { motion } from "framer-motion";

// Hardware-accelerated mobile transitions configurations
const screenVariants = {
  initial: {
    x: "100vw", 
    opacity: 0,
  },
  animate: {
    x: 0, // Slide into perfect viewport alignment
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 35, // Smooth spring curve matching native iOS/Android look
    },
  },
  exit: {
    x: "-30vw", // Subtly slide out to the left on dismissal
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  },
};

const AnimatedScreen = ({ children }) => {
  return (
    <motion.div
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      
    >
      {children}
    </motion.div>
  );
};

export default AnimatedScreen;