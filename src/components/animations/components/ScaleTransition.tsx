"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScaleTransitionProps {
  children: React.ReactNode;
}

export default function ScaleTransition({ children }: ScaleTransitionProps) {
  const variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}


// import ScaleTransition from "../components/animations/ScaleTransition";

// <ScaleTransition>
//   <div>Zooming Component</div>
// </ScaleTransition>;
