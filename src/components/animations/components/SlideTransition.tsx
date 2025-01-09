"use client";

import React from "react";
import { motion } from "framer-motion";

interface SlideTransitionProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
}

export default function SlideTransition({ children, direction = "left" }: SlideTransitionProps) {
  const variants = {
    initial: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "-100%" : direction === "down" ? "100%" : 0,
    },
    animate: { x: 0, y: 0 },
    exit: {
      x: direction === "left" ? "100%" : direction === "right" ? "-100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "-100%" : 0,
    },
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


// import SlideTransition from "../components/animations/SlideTransition";

// <SlideTransition direction="right">
//   <div>Sliding Component</div>
// </SlideTransition>;
