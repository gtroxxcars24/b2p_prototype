import React, { useState } from "react";
import { Car, carImgFor } from "../data/cars";

/**
 * A single "photo" frame: real model-aware car render (imagin.studio) floated
 * over a tinted studio gradient. Falls back to a silhouette if the image fails.
 */
export function CarPhoto({
  car,
  frame = 0,
  rounded = false,
  height = "100%",
  showSilhouette = true,
  width = 760,
  fit = "default",
}: {
  car: Car;
  frame?: number;
  rounded?: boolean;
  height?: string | number;
  showSilhouette?: boolean;
  width?: number;
  fit?: "default" | "thumb";
}) {
  const [failed, setFailed] = useState(false);
  const h = car.hue;
  const a = (h + frame * 4) % 360;
  const compact = fit === "thumb";
  const bg = compact
    ? `linear-gradient(145deg, hsl(${a} 32% 92%) 0%, hsl(${(a + 16) % 360} 24% 78%) 100%)`
    : `radial-gradient(120% 90% at 50% 18%, hsl(${a} 36% 95%) 0%, hsl(${a} 28% 88%) 45%, hsl(${(a + 18) % 360} 24% 76%) 100%)`;

  return (
    <div
      style={{ background: bg, height, borderRadius: rounded ? 16 : 0 }}
      className="relative w-full overflow-hidden flex items-center justify-center"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(70% 60% at 50% 38%, rgba(255,255,255,0.45), transparent 72%)",
        }}
      />
      {!failed ? (
        <img
          src={carImgFor(car, frame, width)}
          alt={`${car.make} ${car.model}`}
          onError={() => setFailed(true)}
          style={{
            position: "relative",
            width: compact ? "150%" : "92%",
            height: compact ? "125%" : "92%",
            objectFit: "contain",
            transform: compact ? "translateX(7%) scale(1.04)" : undefined,
            filter: compact
              ? "drop-shadow(0 12px 12px rgba(0,0,0,0.22))"
              : "drop-shadow(0 18px 18px rgba(0,0,0,0.28))",
          }}
          loading="lazy"
        />
      ) : showSilhouette ? (
        <Silhouette car={car} frame={frame} />
      ) : null}
    </div>
  );
}

function Silhouette({ car, frame }: { car: Car; frame: number }) {
  return (
    <svg viewBox="0 0 240 110" width="74%" style={{ opacity: 0.85, position: "relative" }} aria-hidden>
      <path
        d="M18 78 C20 60 30 54 48 50 L70 36 C80 30 96 28 120 28 C150 28 172 32 188 44 L210 52 C224 56 230 64 230 78 L230 84 L18 84 Z"
        fill="rgba(40,40,60,0.55)"
      />
      <circle cx="68" cy="84" r="15" fill="#15131c" />
      <circle cx="186" cy="84" r="15" fill="#15131c" />
    </svg>
  );
}
