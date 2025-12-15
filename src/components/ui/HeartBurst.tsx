"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { colorArray } from "./GDGColors";

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  color: string;
  scale: number;
  rotation: number;
}

interface HeartBurstProps {
  onBurst?: () => void;
  className?: string;
  iconClassName?: string;
  burstCount?: number;
}

export default function HeartBurst({
  onBurst,
  className = "",
  iconClassName = "w-8 h-8 text-white",
  burstCount = 8,
}: HeartBurstProps) {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  const createHearts = useCallback(() => {
    const newHearts: FloatingHeart[] = [];
    
    for (let i = 0; i < burstCount; i++) {
      newHearts.push({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 200, // Random horizontal spread
        y: -(Math.random() * 150 + 50), // Float upward
        color: colorArray[Math.floor(Math.random() * colorArray.length)],
        scale: Math.random() * 0.5 + 0.5, // Random size between 0.5 and 1
        rotation: (Math.random() - 0.5) * 60, // Random rotation
      });
    }
    
    setHearts((prev) => [...prev, ...newHearts]);
    
    // Clean up hearts after animation
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
    }, 1500);
  }, [burstCount]);

  const handleClick = () => {
    setIsLiked(true);
    createHearts();
    onBurst?.();
    
    // Reset liked state after a delay for re-clicking
    setTimeout(() => setIsLiked(false), 300);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Floating Hearts */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute pointer-events-none z-50"
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{ 
              opacity: [1, 1, 0],
              scale: [0, heart.scale, heart.scale * 0.8],
              x: heart.x,
              y: heart.y,
              rotate: heart.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.2,
              ease: "easeOut",
            }}
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Heart 
              className="w-6 h-6 fill-current" 
              style={{ color: heart.color }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Heart Button */}
      <motion.button
        onClick={handleClick}
        className="relative z-10"
        whileTap={{ scale: 0.8 }}
        animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={isLiked ? { 
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart className={iconClassName} />
        </motion.div>
      </motion.button>
    </div>
  );
}
