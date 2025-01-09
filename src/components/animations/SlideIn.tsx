"use client";

import React from "react";
import { motion } from "framer-motion";

interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
}

export default function SlideIn({
  children,
  direction = "left",
  delay = 0,
  duration = 0.5,
}: SlideInProps) {
  const variants = {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "-100%" : direction === "down" ? "100%" : 0,
    },
    visible: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ delay, duration }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}


// <SlideIn direction="right" delay={0.3}>
//   <div>Sliding Content</div>
// </SlideIn>;