"use client";

import React from "react";
import { motion } from "framer-motion";

interface RotateProps {
  children: React.ReactNode;
  angle?: number;
  duration?: number;
}

export default function Rotate({ children, angle = 360, duration = 0.5 }: RotateProps) {
  return (
    <motion.div
      whileHover={{ rotate: angle }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}

// import Rotate from "../components/animations/Rotate";

// <Rotate>
//   <button>Rotate Me</button>
// </Rotate>;
