"use client";

import React from "react";
import { motion } from "framer-motion";

interface StaggerProps {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
}

export default function Stagger({ children, delay = 0, stagger = 0.2 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay,
            staggerChildren: stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}


// import Stagger from "../components/animations/Stagger";

// <Stagger>
//   {[1, 2, 3].map((item) => (
//     <motion.div
//       key={item}
//       variants={{
//         hidden: { opacity: 0, y: 10 },
//         visible: { opacity: 1, y: 0 },
//       }}
//     >
//       <p>Item {item}</p>
//     </motion.div>
//   ))}
// </Stagger>;
