import React, { useRef, useState } from "react";
import { Car } from "../data/cars";
import { CarPhoto } from "./CarPhoto";
import { Icon } from "./Icon";

/** Swipeable media carousel with page dots + 360/audio affordances (PRD §7.4 Media). */
export function CarMedia({
  car,
  height = "100%",
  onOpen,
}: {
  car: Car;
  height?: string | number;
  onOpen?: () => void;
}) {
  const total = Math.max(1, car.photos);
  const [frame, setFrame] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== frame) setFrame(i);
  };

  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={ref} className="hcarousel" onScroll={onScroll}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            className="hslide"
            key={i}
            onClick={onOpen}
            role={onOpen ? "button" : undefined}
            style={{ cursor: onOpen ? "pointer" : undefined }}
          >
            <CarPhoto car={car} frame={i} height="100%" />
          </div>
        ))}
      </div>

      {/* page dots */}
      <div
        style={{ position: "absolute", top: 14, left: 0, right: 0 }}
        className="flex items-center justify-center gap-1.5"
      >
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); go(i); }}
            style={{
              width: i === frame ? 18 : 6,
              height: 6,
              borderRadius: 3,
              border: "none",
              padding: 0,
              background: i === frame ? "#fff" : "rgba(255,255,255,0.55)",
              transition: "width 0.2s",
              boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
            }}
          />
        ))}
      </div>

      {/* swipe hint + media-type chips */}
      <div style={{ position: "absolute", bottom: 12, right: 12 }} className="flex gap-2">
        {car.has360 && (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-label-4-semibold" style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}>
            <Icon name="rotate" size={13} /> 360°
          </span>
        )}
        {car.hasAudio && (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-label-4-semibold" style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}>
            <Icon name="audio" size={13} /> Engine
          </span>
        )}
      </div>
    </div>
  );
}
