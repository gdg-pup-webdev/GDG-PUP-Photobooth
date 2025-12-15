"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, useInView, AnimatePresence, type Easing } from "framer-motion";
import { useRef } from "react";
import { Camera, Sparkles, Download, Share2, Clock, Users, Zap, Heart } from "lucide-react";
import { FloatingShapes, GDGFooter, HeartBurst, colors, colorArray } from "@/components/ui";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Floating animation for photo strips
const floatAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as Easing,
  },
};

const floatAnimation2 = {
  y: [0, -20, 0],
  transition: {
    duration: 7,
    repeat: Infinity,
    ease: "easeInOut" as Easing,
    delay: 1,
  },
};

// Pulse animation for CTA button
const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as Easing,
  },
};

// Twinkle animation for dots
const twinkleAnimation = (delay: number) => ({
  scale: [1, 1.2, 1],
  opacity: [0.5, 1, 0.5],
  transition: {
    duration: 2 + delay * 0.3,
    repeat: Infinity,
    ease: "easeInOut" as Easing,
    delay: delay * 0.15,
  },
});

export default function Home() {
  const [currentStat, setCurrentStat] = useState(0);
  
  // Refs for scroll-triggered animations
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const galleryRef = useRef(null);
  const funFactsRef = useRef(null);
  const ctaRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });
  const funFactsInView = useInView(funFactsRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: "150+", label: "Photos Taken", icon: Camera, color: colors.blue },
    { number: "∞", label: "Happy Sparkmates", icon: Users, color: colors.red },
    { number: "3", label: "Shots Per Strip", icon: Sparkles, color: colors.yellow },
    { number: "∞", label: "Memories Made", icon: Heart, color: colors.green },
  ];

  const steps = [
    {
      step: 1,
      title: "Strike a Pose",
      description: "Get ready for 3 awesome shots! The camera will countdown before each snap.",
      icon: Camera,
      color: colors.blue,
    },
    {
      step: 2,
      title: "Choose Your Filter",
      description: "Pick from fun filters like B&W, Vintage, Vivid, and more to style your photos.",
      icon: Sparkles,
      color: colors.red,
    },
    {
      step: 3,
      title: "Review & Retake",
      description: "Not happy with a shot? No worries! Retake any photo until it's perfect.",
      icon: Zap,
      color: colors.yellow,
    },
    {
      step: 4,
      title: "Download & Share",
      description: "Get your beautiful photo strip instantly. Share it or keep it as a memory!",
      icon: Download,
      color: colors.green,
    },
  ];

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)`,
      }}
    >
      {/* Keep gradient shift for text - CSS animation */}
      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <FloatingShapes />

      {/* Navigation */}
      <motion.nav 
        className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {colorArray.map((color, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
                animate={twinkleAnimation(i)}
              />
            ))}
          </div>
          <span className="text-white font-bold text-lg hidden sm:block">GDG PUP Photo Booth</span>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/photobooth"
            className="px-6 py-2.5 rounded-full font-bold text-sm"
            style={{
              background: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
              boxShadow: `0 8px 25px ${colors.blue}40`,
            }}
          >
            Open Booth
          </Link>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 px-6 md:px-12 py-12 md:py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-30 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem}>
              <motion.div 
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: `${colors.green}20`,
                    color: colors.green,
                    border: `1px solid ${colors.green}40`,
                  }}
                >
                  🎉 Now Live!
                </span>
              </motion.div>
              <motion.h1
                className="text-5xl md:text-7xl font-black leading-tight"
                style={{
                  background: `linear-gradient(135deg, ${colors.blue}, ${colors.red}, ${colors.yellow}, ${colors.green})`,
                  backgroundSize: "300% 300%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradientShift 5s ease infinite",
                }}
                variants={fadeInUp}
              >
                GDG
                <br />
                PhotoBooth
              </motion.h1>
              <motion.p 
                className="text-zinc-400 text-lg md:text-xl mt-6 max-w-md leading-relaxed"
                variants={fadeInUp}
              >
                Capture your favorite moments at GDG events! Take fun photos, apply cool filters, 
                and download your photo strip instantly.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={staggerItem}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/photobooth"
                  className="group relative px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
                    boxShadow: `0 15px 40px ${colors.blue}50`,
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      background: `linear-gradient(135deg, ${colors.green}, ${colors.blue})`,
                    }}
                  />
                  <Camera className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Start Photo Booth</span>
                </Link>
              </motion.div>
              <motion.a
                href="#how-it-works"
                className="px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5" style={{ color: colors.yellow }} />
                How it Works
              </motion.a>
            </motion.div>

            {/* Stats Bar */}
            <motion.div 
              className="flex flex-wrap gap-6 pt-6 border-t border-zinc-800"
              variants={staggerItem}
            >
              {stats.map((stat, i) => (
                <AnimatePresence key={i} mode="wait">
                  <motion.div
                    className="flex items-center gap-3"
                    animate={{
                      opacity: currentStat === i ? 1 : 0.5,
                      scale: currentStat === i ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${stat.color}20`,
                        border: `1px solid ${stat.color}40`,
                      }}
                    >
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">{stat.number}</div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Diagonal Photo Strips */}
          <motion.div
            className="relative h-[500px] md:h-[600px]"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInRight}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Photo Strip 1 */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 md:left-auto md:right-20 md:translate-x-0 w-48 md:w-56 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                rotate: -12,
                boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${colors.blue}30`,
                border: `3px solid ${colors.blue}`,
              }}
              animate={floatAnimation}
            >
              <div className="bg-white p-3">
                <div className="space-y-2">
                  <Image
                    src="/sample/sample1.webp"
                    alt="Sample photo 1"
                    width={200}
                    height={150}
                    loading="lazy"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Image
                    src="/sample/sample2.webp"
                    alt="Sample photo 2"
                    width={200}
                    height={150}
                    loading="lazy"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Image
                    src="/sample/sample2.webp"
                    alt="Sample photo 3"
                    width={200}
                    height={150}
                    loading="lazy"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="mt-3 text-center">
                  <div className="flex justify-center gap-1 mb-1">
                    {colorArray.map((color, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 font-medium">GDG on Campus PUP</p>
                </div>
              </div>
            </motion.div>

            {/* Photo Strip 2 */}
            <motion.div
              className="absolute bottom-10 left-10 md:left-20 w-44 md:w-52 rounded-2xl overflow-hidden shadow-2xl hidden md:block"
              style={{
                rotate: 8,
                boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${colors.red}30`,
                border: `3px solid ${colors.red}`,
              }}
              animate={floatAnimation2}
            >
              <div className="bg-white p-3">
                <div className="space-y-2">
                  <Image
                    src="/sample/sample2.webp"
                    alt="Sample photo 1"
                    width={200}
                    height={150}
                    loading="lazy"
                    className="w-full h-28 object-cover rounded-lg"
                  />
                  <Image
                    src="/sample/sample1.webp"
                    alt="Sample photo 2"
                    width={200}
                    height={150}
                    loading="lazy"
                    className="w-full h-28 object-cover rounded-lg"
                  />
                  <Image
                    src="/sample/sample2.webp"
                    alt="Sample photo 3"
                    width={200}
                    height={150}
                    loading="lazy"
                    className="w-full h-28 object-cover rounded-lg"
                  />
                </div>
                <div className="mt-3 text-center">
                  <div className="flex justify-center gap-1 mb-1">
                    {colorArray.map((color, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 font-medium">GDG on Campus PUP</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute top-20 left-10 w-20 h-20 rounded-full blur-3xl"
              style={{ background: colors.blue, opacity: 0.3 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as Easing }}
            />
            <motion.div
              className="absolute bottom-40 right-10 w-24 h-24 rounded-full blur-3xl"
              style={{ background: colors.yellow, opacity: 0.3 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as Easing, delay: 1 }}
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                background: `linear-gradient(135deg, ${colors.yellow}, ${colors.red})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              How It Works
            </h2>
            <p className="text-zinc-400 text-lg max-w-md mx-auto">
              It's super easy! Just follow these simple steps to get your photo strip.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="group relative p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Step number badge */}
                <motion.div
                  className="absolute -top-3 -left-3 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg text-white"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}CC)`,
                    boxShadow: `0 8px 20px ${step.color}40`,
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {step.step}
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: `${step.color}15`,
                    border: `1px solid ${step.color}30`,
                  }}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <step.icon className="w-8 h-8" style={{ color: step.color }} />
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>

                {/* Connecting line for desktop */}
                {i < steps.length - 1 && (
                  <div 
                    className="hidden lg:flex items-center absolute top-1/2 -translate-y-1/2 z-10" 
                    style={{ 
                      left: '100%',
                      width: '1.5rem',
                      paddingLeft: '2px',
                      paddingRight: '2px',
                    }}
                  >
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-zinc-600 to-zinc-500" />
                    <div 
                      className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] ml-0"
                      style={{ borderLeftColor: steps[i + 1]?.color || colors.green }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section ref={galleryRef} className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={galleryInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                background: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Photo Gallery
            </h2>
            <p className="text-zinc-400 text-lg max-w-md mx-auto">
              Check out some amazing moments captured at our previous GDG events!
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial="hidden"
            animate={galleryInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="group relative aspect-square rounded-2xl overflow-hidden"
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src={`/sample/sample${i + 1}.webp`}
                  alt={`Gallery photo ${i + 1}`}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    background: `linear-gradient(135deg, ${colorArray[i % 4]}80, transparent)`,
                  }}
                >
                  <HeartBurst 
                    iconClassName="w-8 h-8 text-white drop-shadow-lg"
                    burstCount={6}
                  />
                </motion.div>
                {/* Border glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    boxShadow: `inset 0 0 0 3px ${colorArray[i % 4]}`,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Fun Facts / Stats Section */}
      <section ref={funFactsRef} className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative p-8 md:p-12 rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            initial="hidden"
            animate={funFactsInView ? "visible" : "hidden"}
            variants={scaleIn}
            transition={{ duration: 0.6 }}
          >
            {/* Background decoration */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ background: colors.blue }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as Easing }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-20"
              style={{ background: colors.green }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as Easing, delay: 2 }}
            />

            <div className="relative z-10 text-center">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: `${colors.yellow}20`,
                  border: `1px solid ${colors.yellow}40`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={funFactsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4" style={{ color: colors.yellow }} />
                <span className="text-sm font-bold" style={{ color: colors.yellow }}>
                  Fun Fact
                </span>
              </motion.div>

              <motion.h3 
                className="text-3xl md:text-5xl font-black text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={funFactsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                <span
                  style={{
                    background: `linear-gradient(135deg, ${colors.blue}, ${colors.red})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  150+
                </span>{" "}
                Photos Taken
              </motion.h3>
              <motion.p 
                className="text-zinc-400 text-lg mb-8 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={funFactsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                During our last GDG event! Be part of the next batch of amazing memories.
              </motion.p>

              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                initial="hidden"
                animate={funFactsInView ? "visible" : "hidden"}
                variants={staggerContainer}
              >
                {[
                  { icon: Clock, text: "Instant Download", color: colors.blue },
                  { icon: Share2, text: "Easy to Share", color: colors.red },
                  { icon: Sparkles, text: "6 Fun Filters", color: colors.yellow },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    variants={staggerItem}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    <span className="text-zinc-300">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={ctaRef} className="relative z-10 px-6 md:px-12 py-20">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-black mb-6"
            style={{
              background: `linear-gradient(135deg, ${colors.green}, ${colors.blue}, ${colors.yellow})`,
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 4s ease infinite",
            }}
            variants={fadeInUp}
          >
            Ready to Strike a Pose?
          </motion.h2>
          <motion.p 
            className="text-zinc-400 text-xl mb-10 max-w-lg mx-auto"
            variants={fadeInUp}
          >
            Jump into the booth and create your perfect photo strip. It only takes a minute!
          </motion.p>

          <motion.div
            variants={fadeInUp}
            animate={pulseAnimation}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/photobooth"
                className="group inline-flex items-center gap-4 px-12 py-5 rounded-2xl font-bold text-xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
                  boxShadow: `0 20px 50px ${colors.blue}50`,
                }}
              >
                <motion.div
                  whileHover={{ rotate: 12 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Camera className="w-7 h-7" />
                </motion.div>
                <span className="hidden md:block">Start Photo Booth</span>
                <motion.span 
                  className="text-2xl"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Decorative dots */}
          <motion.div 
            className="flex justify-center gap-2 mt-10"
            variants={staggerContainer}
          >
            {colorArray.map((color, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
                animate={twinkleAnimation(i)}
                variants={staggerItem}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 px-6 md:px-12 py-8 border-t border-zinc-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto">
          <GDGFooter />
        </div>
      </motion.footer>
    </main>
  );
}
