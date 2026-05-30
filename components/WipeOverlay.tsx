"use client";

import { useEffect, useRef } from "react";
import { useTransition } from "./TransitionProvider";

export default function WipeOverlay() {
  const wipeRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const barRefs = useRef<HTMLSpanElement[]>([]);
  const { registerBars, registerLabel, registerWipe } = useTransition();

  useEffect(() => {
    registerBars(barRefs.current);
    registerLabel(labelRef.current);
    registerWipe(wipeRef.current);
  }, [registerBars, registerLabel, registerWipe]);

  return (
    <>
      <div className="wipe" aria-hidden ref={wipeRef}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) barRefs.current[i] = el;
            }}
          />
        ))}
      </div>
      <div className="wipe-label" aria-hidden ref={labelRef} />
    </>
  );
}
