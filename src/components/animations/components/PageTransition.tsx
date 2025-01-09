"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
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


// import PageTransition from "../components/animations/PageTransition";

// export default function AboutPage() {
//   return (
//     <PageTransition>
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <h1 className="text-4xl font-bold">About Page</h1>
//       </div>
//     </PageTransition>
//   );
// }
