"use client";

import React from "react";
import { motion } from "framer-motion";

interface HoverEffectProps {
  children: React.ReactNode;
  duration?: number;
}

export default function HoverEffect({ children, duration = 0.3 }: HoverEffectProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        x: 10,
        color: "#FF5733",
      }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}

// import HoverEffect from "../components/animations/HoverEffect";

// <HoverEffect>
//   <p>Hover over me</p>
// </HoverEffect>;
