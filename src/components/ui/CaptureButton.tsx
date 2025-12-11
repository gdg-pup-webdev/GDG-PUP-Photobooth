"use client";

import React from "react";
import { colors } from "./GDGColors";

interface CaptureButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isCapturing?: boolean;
  label?: string;
}

export default function CaptureButton({
  onClick,
  disabled = false,
  isCapturing = false,
  label = "CAPTURE",
}: CaptureButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative group"
      aria-label={label}
    >
      {/* Outer ring with rotating gradient */}
      <div
        className="w-24 h-24 rounded-full p-1 transition-all duration-300"
        style={{
          background: disabled
            ? "#444"
            : `conic-gradient(${colors.blue}, ${colors.red}, ${colors.yellow}, ${colors.green}, ${colors.blue})`,
          animation: disabled ? "none" : "spin 3s linear infinite",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {/* Middle ring */}
        <div
          className="w-full h-full rounded-full p-1 bg-black/80"
          style={{
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {/* Inner capture button */}
          <div
            className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-200 ${
              disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-95 active:scale-90"
            }`}
            style={{
              background: disabled
                ? "#555"
                : isCapturing
                ? `linear-gradient(135deg, ${colors.red}, ${colors.yellow})`
                : `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
              boxShadow: disabled
                ? "none"
                : `0 0 30px ${isCapturing ? colors.red : colors.blue}60`,
            }}
          >
            {isCapturing ? (
              <div className="w-6 h-6 rounded-sm bg-white animate-pulse" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/90 group-hover:bg-white transition-all" />
            )}
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold tracking-wider transition-all"
        style={{
          color: disabled ? "#666" : "#fff",
        }}
      >
        {label}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  );
}
