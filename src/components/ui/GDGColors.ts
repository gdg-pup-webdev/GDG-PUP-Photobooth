import { LucideIcon, Sparkles, CircleOff, Sun, Palette, Snowflake, Camera } from "lucide-react";

// GDG Brand Colors
export const colors = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

export const colorArray = Object.values(colors);

export interface Filter {
  name: string;
  value: string;
  color: string;
  icon: LucideIcon;
}

export const FILTERS: Filter[] = [
  { name: "Normal", value: "", color: colors.blue, icon: Sparkles },
  { name: "B&W", value: "grayscale(100%)", color: colors.red, icon: CircleOff },
  { name: "Warm", value: "sepia(100%)", color: colors.yellow, icon: Sun },
  { name: "Vivid", value: "contrast(1.2) saturate(1.4)", color: colors.green, icon: Palette },
  { name: "Cool", value: "hue-rotate(180deg) saturate(0.8)", color: colors.blue, icon: Snowflake },
  { name: "Vintage", value: "sepia(50%) contrast(1.1) brightness(0.9)", color: colors.red, icon: Camera },
];
