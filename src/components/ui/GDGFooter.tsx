"use client";

import { colorArray } from "./GDGColors";

export default function GDGFooter() {
  return (
    <div className="pt-6 border-t border-zinc-800">
      <div className="flex lg:flex-row flex-col items-center justify-center gap-2 text-zinc-500 text-sm">
        <span>Powered by</span>
        <div className="flex gap-1">
          {colorArray.map((color, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="font-bold text-zinc-400">Web Development Team '25-26</span>
        <span className="font-semibold text-zinc-300">Google Developer Groups on Campus PUP</span>
      </div>
    </div>
  );
}
