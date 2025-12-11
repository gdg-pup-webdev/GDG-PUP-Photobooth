"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FloatingShapes,
  CountdownOverlay,
  ShotProgress,
  CaptureButton,
  FilterModal,
  GDGFooter,
  colors,
  colorArray,
  FILTERS,
} from "./ui";

type Shot = string | null;

export default function CameraBooth() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const snapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  const [shots, setShots] = useState<Shot[]>([null, null, null]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [reshootIndex, setReshootIndex] = useState<number | null>(null);

  // Modal states
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Email states
  const [email, setEmail] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");

  // Initialize camera
  useEffect(() => {
    let mounted = true;
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        videoRef.current?.play().catch(() => {});
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    initCamera();
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, []);

  const playVideo = () => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  };

  const takeSnapshot = (): string | null => {
    if (!videoRef.current || !snapCanvasRef.current) return null;
    const canvas = snapCanvasRef.current;
    const v = videoRef.current;
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.filter = currentFilter || "";
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  };

  const snap = (index: number) => {
    if (countdown !== null) return;

    let n = 3;
    setCountdown(n);

    countdownInterval.current = setInterval(() => {
      n -= 1;
      setCountdown(n > 0 ? n : null);
      if (n <= 0 && countdownInterval.current)
        clearInterval(countdownInterval.current);
    }, 1000);

    setTimeout(() => {
      const data = takeSnapshot();
      setShots((prev) => {
        const next = [...prev];
        const targetIndex = reshootIndex !== null ? reshootIndex : index;
        next[targetIndex] = data;
        return next;
      });
      setCountdown(null);
      setReshootIndex(null);

      setShowReview((prev) => {
        const allTaken = shots
          .map((s, i) => (reshootIndex === i ? data : s))
          .every((s) => s !== null);
        return allTaken;
      });
    }, 3000);
  };

  const startSequence = async () => {
    setShots([null, null, null]);
    setShowReview(false);
    setReshootIndex(null);
    setEmail("");
    setSent(false);

    for (let i = 0; i < 3; i++) {
      await new Promise<void>((resolve) => {
        let n = 3;
        setCountdown(n);
        const t = setInterval(() => {
          n -= 1;
          setCountdown(n > 0 ? n : null);
          if (n <= 0) {
            clearInterval(t);
            const data = takeSnapshot();
            setShots((prev) => {
              const next = [...prev];
              next[i] = data;
              return next;
            });
            setCountdown(null);
            resolve();
          }
        }, 1000);
      });
      await new Promise((r) => setTimeout(r, 400));
    }
    setShowReview(true);
  };

  const retake = (i: number) => {
    setShots((prev) => {
      const next = [...prev];
      next[i] = null;
      return next;
    });
    setShowReview(false);
    setCountdown(null);
    setReshootIndex(i);
    playVideo();
  };

  const retakeAll = () => {
    setShots([null, null, null]);
    setShowReview(false);
    setCountdown(null);
    setReshootIndex(null);
    setEmail("");
    setSent(false);
    setEmailError("");
    playVideo();
  };

  // Generate photostrip
  const loadImg = (src: string) =>
    new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => resolve(img);
    });

  const roundRectPath = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  };

  const generateFinal = async () => {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = 1666;
    finalCanvas.height = 3000;
    const ctx = finalCanvas.getContext("2d")!;
    const frame = await loadImg("/polaroid.png");
    ctx.drawImage(frame, 0, 0, finalCanvas.width, finalCanvas.height);

    const padding = 40;
    const slots = [
      { x: 130, y: 134, w: 1395, h: 801 },
      { x: 130, y: 951, w: 1395, h: 801 },
      { x: 130, y: 1769, w: 1395, h: 801 },
    ];
    const radius = 30;

    for (let i = 0; i < shots.length; i++) {
      if (!shots[i]) continue;
      const img = await loadImg(shots[i]!);
      const sx = slots[i].x + padding;
      const sy = slots[i].y + padding;
      const sw = slots[i].w - padding * 2;
      const sh = slots[i].h - padding * 2;

      ctx.save();
      ctx.beginPath();
      roundRectPath(ctx, sx, sy, sw, sh, radius);
      ctx.clip();

      const ratio = Math.max(sw / img.width, sh / img.height);
      const dw = img.width * ratio;
      const dh = img.height * ratio;
      const dx = sx - (dw - sw) / 2;
      const dy = sy - (dh - sh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = "#1B3444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      roundRectPath(ctx, sx, sy, sw, sh, radius);
      ctx.stroke();
      ctx.restore();
    }

    return finalCanvas.toDataURL("image/jpeg", 0.7);
  };

  const downloadStrip = async () => {
    const url = await generateFinal();
    const a = document.createElement("a");
    a.href = url;
    a.download = "photostrip.png";
    a.click();
  };

  const currentShotIndex = shots.findIndex((s) => s === null);
  const allShotsTaken = shots.every((s) => s !== null);
  const currentFilterObj =
    FILTERS.find((f) => f.value === currentFilter) || FILTERS[0];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)`,
      }}
    >
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px ${colors.blue}40, 0 0 40px ${colors.blue}20;
          }
          25% {
            box-shadow: 0 0 20px ${colors.red}40, 0 0 40px ${colors.red}20;
          }
          50% {
            box-shadow: 0 0 20px ${colors.yellow}40, 0 0 40px ${colors.yellow}20;
          }
          75% {
            box-shadow: 0 0 20px ${colors.green}40, 0 0 40px ${colors.green}20;
          }
        }
        @keyframes countBounce {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <FloatingShapes />

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        currentFilter={currentFilter}
        onSelectFilter={setCurrentFilter}
      />

      <div className="w-full max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-[1fr,420px] gap-8">
          {/* Camera Body - Preview + Controls Side Panel */}
          <div className="flex gap-0">
            {/* Camera Preview (Viewfinder) */}
            <div
              className="relative flex-1 aspect-[3/4] max-h-[85vh] rounded-l-3xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #1a1a2e, #0f0f0f)",
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.5),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
                animation: "glow 8s ease-in-out infinite",
              }}
            >
              {/* Decorative border gradient */}
              <div
                className="absolute inset-0 rounded-l-3xl pointer-events-none z-10"
                style={{
                  background: `linear-gradient(135deg, ${colors.blue}30, ${colors.red}30, ${colors.yellow}30, ${colors.green}30)`,
                  padding: "2px",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />

              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{
                  filter: currentFilter,
                  transform: "scaleX(-1)", // Mirror the video like a selfie camera
                }}
                muted
                playsInline
              />

              {countdown !== null && <CountdownOverlay countdown={countdown} />}

              <ShotProgress shots={shots} currentIndex={currentShotIndex} />

              {showReview && allShotsTaken && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none backdrop-blur-sm z-5">
                  <div
                    className="flex items-center gap-3 px-6 py-3 rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${colors.green}, ${colors.blue})`,
                      boxShadow: `0 10px 30px ${colors.green}50`,
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white font-bold text-lg">
                      All shots captured!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Body Side Panel - Physical Buttons */}
            <div
              className="w-28 rounded-r-3xl flex flex-col items-center justify-center gap-6 py-8"
              style={{
                background: "linear-gradient(180deg, #1f1f35 0%, #151525 100%)",
                borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: `
                  inset -10px 0 30px rgba(0, 0, 0, 0.3),
                  0 25px 50px -12px rgba(0, 0, 0, 0.5)
                `,
              }}
            >
              {/* Camera Grip Texture */}
              <div className="absolute inset-y-0 right-0 w-6 opacity-20 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[5%] w-full"
                    style={{
                      background:
                        i % 2 === 0 ? "rgba(255,255,255,0.1)" : "transparent",
                    }}
                  />
                ))}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105 hover:bg-white/5 group"
              >
                <div
                  className="w-14 h-14 rounded-full overflow-hidden transition-all group-hover:scale-110"
                  style={{
                    border: `2px solid ${currentFilterObj.color}`,
                    boxShadow: `0 0 20px ${currentFilterObj.color}30`,
                  }}
                >
                  <img
                    src="/sparky.webp"
                    alt="Filter preview"
                    className="w-full h-full object-cover"
                    style={{ filter: currentFilter || "none" }}
                  />
                </div>
                <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">
                  Filter
                </span>
              </button>

              {/* Main Capture Button */}
              <div className="my-4">
                {!showReview && reshootIndex === null && (
                  <CaptureButton
                    onClick={startSequence}
                    disabled={countdown !== null}
                    isCapturing={countdown !== null}
                    label="CAPTURE"
                  />
                )}

                {!showReview && reshootIndex !== null && (
                  <CaptureButton
                    onClick={() => snap(reshootIndex)}
                    disabled={countdown !== null}
                    isCapturing={countdown !== null}
                    label={`SHOT ${reshootIndex + 1}`}
                  />
                )}

                {showReview && (
                  <button
                    onClick={retakeAll}
                    className="w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #333, #222)",
                      border: "3px solid #444",
                      boxShadow:
                        "0 8px 25px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1)",
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="text-[10px] font-bold text-zinc-400">
                      RESET
                    </span>
                  </button>
                )}
              </div>

              {/* Gallery/Shots Button */}
              <button
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105 hover:bg-white/5 group"
                onClick={() => allShotsTaken && setShowReview(true)}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center relative overflow-hidden transition-all group-hover:scale-110"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                  }}
                >
                  {shots.filter(Boolean).length > 0 ? (
                    <>
                      {shots[shots.filter(Boolean).length - 1] && (
                        <img
                          src={shots[shots.filter(Boolean).length - 1]!}
                          className="w-full h-full object-cover"
                          alt="Last shot"
                        />
                      )}
                      <div
                        className="absolute bottom-0 right-0 w-5 h-5 rounded-tl-lg flex items-center justify-center text-xs font-bold"
                        style={{
                          background: colors.green,
                          color: "#fff",
                        }}
                      >
                        {shots.filter(Boolean).length}
                      </div>
                    </>
                  ) : (
                    <svg
                      className="w-6 h-6 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">
                  Gallery
                </span>
              </button>

              {/* Shot Counter Display */}
              <div
                className="mt-auto px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex gap-1.5 justify-center">
                  {shots.map((shot, i) => {
                    const dotColor = [colors.blue, colors.red, colors.yellow][
                      i
                    ];
                    return (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full transition-all"
                        style={{
                          background: shot ? dotColor : "rgba(255,255,255,0.2)",
                          boxShadow: shot ? `0 0 8px ${dotColor}` : "none",
                        }}
                      />
                    );
                  })}
                </div>
                <div className="text-[10px] text-center text-zinc-500 mt-1 font-mono">
                  {shots.filter(Boolean).length}/3
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Info & Actions */}
          <div className="space-y-6">
            {/* Header with GDG branding */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-1">
                  {colorArray.map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: color,
                        animation: `twinkle ${
                          2 + i * 0.5
                        }s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-zinc-400 text-sm font-medium tracking-wider uppercase">
                  GDG Photobooth
                </span>
              </div>
              <h1
                className="text-5xl font-black bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${colors.blue}, ${colors.red}, ${colors.yellow}, ${colors.green})`,
                  backgroundSize: "300% 300%",
                  animation: "gradientShift 5s ease infinite",
                }}
              >
                PHOTO BOOTH
              </h1>
              <p className="text-zinc-400 mt-2 flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: colors.green }}
                />
                Shot {Math.min(currentShotIndex + 1, 3)} of 3
              </p>
            </div>

            {/* Quick Filter Preview */}
            <div
              className="p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
              onClick={() => setShowFilterModal(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden"
                    style={{
                      border: `2px solid ${currentFilterObj.color}`,
                    }}
                  >
                    <img
                      src="/sparky.webp"
                      alt="Filter preview"
                      className="w-full h-full object-cover"
                      style={{ filter: currentFilter || "none" }}
                    />
                  </div>
                  <div>
                    <div className="text-white font-bold">
                      {currentFilterObj.name}
                    </div>
                    <div className="text-zinc-500 text-sm">Current filter</div>
                  </div>
                </div>
                <div
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.blue}30, ${colors.green}30)`,
                    color: colors.blue,
                  }}
                >
                  Change
                </div>
              </div>
            </div>

            {/* Review Section */}
            {showReview && (
              <div className="space-y-6">
                <div>
                  <h2
                    className="text-4xl font-black bg-clip-text text-transparent mb-2"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${colors.yellow}, ${colors.red})`,
                    }}
                  >
                    Review
                  </h2>
                  <p className="text-zinc-400">Your three amazing shots</p>
                </div>

                <div className="space-y-4">
                  {shots.map((s, i) => {
                    const shotColor = [colors.blue, colors.red, colors.yellow][
                      i
                    ];
                    return (
                      <div
                        key={i}
                        className="flex gap-4 items-center p-3 rounded-xl transition-all hover:scale-[1.01]"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: `1px solid ${shotColor}30`,
                        }}
                      >
                        <div
                          className="relative w-20 h-28 rounded-lg overflow-hidden shadow-lg flex-shrink-0"
                          style={{
                            border: `2px solid ${shotColor}`,
                            boxShadow: `0 8px 20px ${shotColor}30`,
                          }}
                        >
                          {s && (
                            <img
                              src={s}
                              className="w-full h-full object-cover"
                              alt={`Shot ${i + 1}`}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div
                            className="font-bold mb-1"
                            style={{ color: shotColor }}
                          >
                            Shot {i + 1}
                          </div>
                          <button
                            onClick={() => retake(i)}
                            className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1 group"
                          >
                            <svg
                              className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            Retake this shot
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Download & Email */}
                <div className="space-y-3 pt-4">
                  <button
                    onClick={downloadStrip}
                    className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: `linear-gradient(135deg, ${colors.green}, ${colors.blue})`,
                      boxShadow: `0 15px 35px ${colors.green}40`,
                      color: "#fff",
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Photo Strip
                  </button>

                  {!sent ? (
                    <div className="space-y-3">
                      <div
                        className="relative rounded-xl overflow-hidden"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(""); // Clear error when user types
                          }}
                          placeholder="Enter your email"
                          className="w-full py-4 px-5 bg-transparent text-white placeholder:text-zinc-500 focus:outline-none"
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          style={{
                            background: email
                              ? `linear-gradient(90deg, ${colors.blue}, ${colors.green})`
                              : "transparent",
                          }}
                        />
                      </div>
                      <button
                        disabled={!email || sending}
                        onClick={async () => {
                          setSending(true);
                          setEmailError("");
                          try {
                            const dataUrl = await generateFinal();
                            const blob = await (await fetch(dataUrl)).blob();

                            console.log("Generated blob:", {
                              size: blob.size,
                              type: blob.type,
                            });

                            if (blob.size === 0) {
                              throw new Error("Generated image is empty");
                            }

                            const formData = new FormData();
                            formData.append("email", email);
                            formData.append("file", blob, "photostrip.jpg");

                            const response = await fetch("/api/sendEmail", {
                              method: "POST",
                              body: formData,
                            });

                            const data = await response.json();

                            if (response.ok) {
                              setSent(true);
                            } else {
                              setEmailError(
                                data.message ||
                                  "Failed to send email. Please try again."
                              );
                            }
                          } catch (err) {
                            console.error(err);
                            setEmailError(
                              "Failed to send email. Please check your connection and try again."
                            );
                          } finally {
                            setSending(false);
                          }
                        }}
                        className="w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                        style={{
                          background:
                            !email || sending
                              ? "#444"
                              : `linear-gradient(135deg, ${colors.blue}, ${colors.red})`,
                          boxShadow:
                            !email || sending
                              ? "none"
                              : `0 15px 35px ${colors.blue}40`,
                          color: "#fff",
                        }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {sending ? "Sending..." : "Send to Email"}
                      </button>

                      {/* Error message */}
                      {emailError && (
                        <div
                          className="flex items-start gap-3 p-4 rounded-xl"
                          style={{
                            background: `${colors.red}20`,
                            border: `1px solid ${colors.red}50`,
                          }}
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: colors.red }}
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <div
                              className="font-bold"
                              style={{ color: colors.red }}
                            >
                              Error Sending Email
                            </div>
                            <div className="text-zinc-400 text-sm">
                              {emailError}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-3 p-4 rounded-xl"
                      style={{
                        background: `${colors.green}20`,
                        border: `1px solid ${colors.green}50`,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: colors.green }}
                      >
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <div
                          className="font-bold"
                          style={{ color: colors.green }}
                        >
                          Email Sent!
                        </div>
                        <div className="text-zinc-400 text-sm">
                          Check your inbox
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={retakeAll}
                    className="w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {/* Instructions when not in review */}
            {!showReview && (
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  How it works
                </h3>
                <ol className="space-y-3 text-zinc-400 text-sm">
                  <li className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: colors.blue, color: "#fff" }}
                    >
                      1
                    </span>
                    <span>Choose your favorite filter</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: colors.red, color: "#fff" }}
                    >
                      2
                    </span>
                    <span>Press the capture button to take 3 shots</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: colors.yellow, color: "#fff" }}
                    >
                      3
                    </span>
                    <span>Review and retake if needed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: colors.green, color: "#fff" }}
                    >
                      4
                    </span>
                    <span>Download or email your photo strip!</span>
                  </li>
                </ol>
              </div>
            )}

            <GDGFooter />
          </div>
        </div>
        <canvas ref={snapCanvasRef} className="hidden" />
      </div>
    </div>
  );
}
