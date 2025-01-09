"use client";

import React from "react";
import { motion } from "framer-motion";

interface FlipProps {
  children: React.ReactNode;
  duration?: number;
}

export default function Flip({ children, duration = 0.5 }: FlipProps) {
  return (
    <motion.div
      initial={{ rotateY: 0 }}
      whileHover={{ rotateY: 180 }}
      transition={{ duration }}
      style={{
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
}


// import Flip from "../components/animations/Flip";

// <Flip>
//   <div className="bg-gray-200 w-32 h-32 flex items-center justify-center">
//     <p>Flip Me</p>
//   </div>
// </Flip>;
