"use client";

import React from "react";
import { colors } from "./GDGColors";

interface CountdownOverlayProps {
  countdown: number;
}

export default function CountdownOverlay({ countdown }: CountdownOverlayProps) {
  const colorSequence = [colors.red, colors.yellow, colors.green];
  const currentColor = colorSequence[3 - countdown] || colors.blue;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
      {/* Subtle vignette effect - very transparent */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle, transparent 30%, rgba(0,0,0,0.3) 100%)",
        }}
      />
      
      {/* Countdown circle - compact and centered */}
      <div className="relative">
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: currentColor,
            opacity: 0.4,
            transform: "scale(1.3)",
          }}
        />
        
        {/* Pulse ring animation */}
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            background: currentColor,
            opacity: 0.3,
          }}
        />
        
        {/* Main countdown circle */}
        <div
          className="relative w-28 h-28 rounded-full flex items-center justify-center"
          style={{
            background: currentColor,
            boxShadow: `0 0 40px ${currentColor}80`,
          }}
        >
          <span
            className="text-white text-6xl font-black"
            style={{
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              animation: "countPop 1s ease-out",
            }}
          >
            {countdown}
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes countPop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
