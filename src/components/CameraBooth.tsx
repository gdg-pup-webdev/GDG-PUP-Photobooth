"use client";

import React, { useEffect, useRef, useState } from "react";

type Shot = string | null;

const FILTERS = [
  { name: "Normal", value: "" },
  { name: "Grayscale", value: "grayscale(100%)" },
  { name: "Sepia", value: "sepia(100%)" },
  { name: "Vintage", value: "contrast(1.2) saturate(0.8)" },
];

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

  // Email states
  const [email, setEmail] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

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

      // Show review if all shots filled
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

    return finalCanvas.toDataURL("image/png");
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Camera Preview */}
          <div className="relative w-full aspect-[3/4] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl bg-zinc-900">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{ filter: currentFilter }}
              muted
              playsInline
            />
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-white text-[160px] font-black animate-pulse">
                  {countdown}
                </div>
              </div>
            )}
            <div className="absolute top-6 left-6 right-6">
              <div className="flex gap-3">
                {shots.map((shot, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1.5 rounded-full transition-all ${
                      shot
                        ? "bg-emerald-400"
                        : i === currentShotIndex
                        ? "bg-white/50 animate-pulse"
                        : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
            {showReview && allShotsTaken && (
              <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-8 pointer-events-none">
                <div className="text-emerald-400 font-bold text-lg mb-2">
                  ✓ All shots captured!
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-black text-white mb-2">BOOTH</h1>
              <p className="text-zinc-400">
                Shot {Math.min(currentShotIndex + 1, 3)} of 3
              </p>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                Filters
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setCurrentFilter(f.value)}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                      currentFilter === f.value
                        ? "bg-white text-black"
                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Capture / Review */}
            {!showReview ? (
              <>
                {/* Sequence button only visible if not retaking */}
                {reshootIndex === null && (
                  <button
                    onClick={() => startSequence()}
                    disabled={countdown !== null}
                    className="w-full py-6 bg-white hover:bg-gray-100 disabled:bg-gray-400 text-black rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed shadow-2xl"
                  >
                    START 3-SHOT SEQUENCE
                  </button>
                )}

                <div className="flex gap-2">
                  {shots.map((_, i) => {
                    if (reshootIndex === null) return null; // hide single-shot buttons at start
                    if (reshootIndex !== i) return null; // only show the specific retake
                    return (
                      <button
                        key={i}
                        onClick={() => snap(i)}
                        disabled={countdown !== null}
                        className="flex-1 py-3 bg-zinc-800 text-white rounded-xl"
                      >
                        Take Shot {i + 1}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <h2 className="text-4xl font-black text-white mb-2">Review</h2>
                <p className="text-zinc-400">Your three shots</p>

                <div className="space-y-4">
                  {shots.map((s, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="relative w-20 h-28 bg-zinc-900 rounded-lg overflow-hidden shadow-lg border-2 border-zinc-800 flex-shrink-0">
                        {s && (
                          <img
                            src={s}
                            className="w-full h-full object-cover"
                            alt={`Shot ${i + 1}`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold mb-1">
                          Shot {i + 1}
                        </div>
                        <button
                          onClick={() => retake(i)}
                          className="text-sm text-zinc-400 hover:text-white transition-colors underline"
                        >
                          Retake this shot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Download & Email */}
                <div className="space-y-3 pt-4">
                  <button
                    onClick={downloadStrip}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl"
                  >
                    Download Strip
                  </button>

                  {!sent ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full py-3 px-4 rounded-xl bg-zinc-800 text-white placeholder:text-zinc-400"
                      />
                      <button
                        disabled={!email || sending}
                        onClick={async () => {
                          setSending(true);
                          try {
                            const dataUrl = await generateFinal();
                            await fetch("/api/sendEmail", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email, image: dataUrl }),
                            });
                            setSent(true);
                          } catch (err) {
                            console.error(err);
                            alert("Failed to send email.");
                          } finally {
                            setSending(false);
                          }
                        }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:bg-gray-400"
                      >
                        {sending ? "Sending..." : "Send to Email"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-green-400 font-bold">
                      Sent! Check your inbox.
                    </div>
                  )}

                  <button
                    onClick={retakeAll}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-all"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <canvas ref={snapCanvasRef} className="hidden" />
      </div>
    </div>
  );
}
