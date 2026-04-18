"use client";
import { motion, Variants } from "framer-motion";
import React from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = "",
  delay = 0,
  duration = 0.8,
}) => {
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration,
      },
    },
    hidden: {
      opacity: 0,
      filter: "blur(20px)",
      y: 20,
    },
  };

  const MotionTag = motion.div as any;

  return (
    <MotionTag
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {words.map((word, index) => (
        <motion.span variants={child} className="mr-2 lg:mr-3" key={index}>
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
};
