"use client";
import { useEffect } from "react";

export default function Countdown({ count }: { count: number }) {
  useEffect(() => {}, [count]);
  if (count <= 0) return null;
  return <div className="countdown-big">{count}</div>;
}
