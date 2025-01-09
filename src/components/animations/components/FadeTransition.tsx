"use client";

import React from "react";
import { motion } from "framer-motion";

interface FadeTransitionProps {
  children: React.ReactNode;
}

export default function FadeTransition({ children }: FadeTransitionProps) {
  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

// import FadeTransition from "../components/animations/FadeTransition";

// <FadeTransition>
//   <div>Component to Fade In and Out</div>
// </FadeTransition>;

