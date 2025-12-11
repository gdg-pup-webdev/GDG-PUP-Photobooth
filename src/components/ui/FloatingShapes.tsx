"use client";

import React from "react";
import { colors, colorArray } from "./GDGColors";

export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated circles */}
      <div
        className="absolute w-64 h-64 rounded-full opacity-20 animate-pulse"
        style={{
          background: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
          top: "-5%",
          right: "-5%",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-48 h-48 rounded-full opacity-15"
        style={{
          background: `linear-gradient(135deg, ${colors.red}, ${colors.yellow})`,
          bottom: "10%",
          left: "-3%",
          animation: "float 6s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-32 h-32 rounded-full opacity-20"
        style={{
          background: `linear-gradient(135deg, ${colors.yellow}, ${colors.blue})`,
          top: "40%",
          right: "5%",
          animation: "float 7s ease-in-out infinite",
        }}
      />
      {/* Small dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 12 + 6 + "px",
            height: Math.random() * 12 + 6 + "px",
            background: colorArray[i % 4],
            opacity: 0.3,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
