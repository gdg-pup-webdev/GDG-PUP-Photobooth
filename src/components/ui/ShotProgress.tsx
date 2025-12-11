"use client";

import React from "react";
import { colors } from "./GDGColors";

type Shot = string | null;

interface ShotProgressProps {
  shots: Shot[];
  currentIndex: number;
}

export default function ShotProgress({ shots, currentIndex }: ShotProgressProps) {
  const shotColors = [colors.blue, colors.red, colors.yellow];

  return (
    <div className="absolute top-6 left-6 right-6 z-10">
      <div className="flex gap-3">
        {shots.map((shot, i) => {
          const color = shotColors[i];
          return (
            <div
              key={i}
              className="flex-1 h-2 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{
                background: shot
                  ? color
                  : i === currentIndex
                  ? `${color}50`
                  : "rgba(255,255,255,0.15)",
                boxShadow: shot ? `0 0 12px ${color}80` : "none",
              }}
            >
              {i === currentIndex && !shot && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    animation: "shimmer 1.5s infinite",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
