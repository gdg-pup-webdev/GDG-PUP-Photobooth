"use client";

import React, { useEffect, useRef } from "react";
import { colors, FILTERS, Filter } from "./GDGColors";
import { X, Check } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: string;
  onSelectFilter: (filter: string) => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  currentFilter,
  onSelectFilter,
}: FilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        style={{
          animation: "fadeIn 0.2s ease-out",
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1a1a2e, #0f0f0f)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            0 0 80px ${colors.blue}20
          `,
          animation: "slideUp 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div
          className="p-6 border-b"
          style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-2xl font-black bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
                }}
              >
                Choose Filter
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Preview filters on Sparky the Android
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Filter Grid */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {FILTERS.map((filter: Filter, index: number) => {
              const isSelected = currentFilter === filter.value;
              
              return (
                <button
                  key={filter.name}
                  onClick={() => {
                    onSelectFilter(filter.value);
                    onClose();
                  }}
                  className="relative group rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  {/* Preview with Sparky image */}
                  <div
                    className="aspect-square rounded-2xl overflow-hidden relative"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: isSelected
                        ? `3px solid ${filter.color}`
                        : "3px solid transparent",
                      boxShadow: isSelected
                        ? `0 0 20px ${filter.color}50`
                        : "none",
                    }}
                  >
                    {/* Sparky image with filter applied */}
                    <img
                      src="/sparky.webp"
                      alt={`${filter.name} filter preview`}
                      className="w-full h-full object-cover"
                      style={{ 
                        filter: filter.value || "none",
                        transition: "filter 0.3s ease",
                      }}
                    />

                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${filter.color}40, ${filter.color}20)`,
                      }}
                    >
                      {isSelected && (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: filter.color }}
                        >
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: filter.color }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center">
                    <span
                      className="font-bold text-sm transition-colors"
                      style={{
                        color: isSelected ? filter.color : "#888",
                      }}
                    >
                      {filter.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-6 border-t flex justify-between items-center"
          style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <img 
              src="/sparky.webp" 
              alt="Sparky" 
              className="w-6 h-6 object-contain"
            />
            <span>Previewing with Sparky</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${colors.blue}, ${colors.green})`,
              color: "#fff",
              boxShadow: `0 10px 25px ${colors.blue}40`,
            }}
          >
            Done
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
