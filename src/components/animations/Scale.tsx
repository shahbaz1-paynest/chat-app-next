"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScaleProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
}

export default function Scale({ children, scale = 1.1, duration = 0.3 }: ScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
}
