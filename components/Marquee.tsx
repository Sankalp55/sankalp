"use client";

import { useEffect, useRef } from "react";

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const mqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const mq = mqRef.current;
    if (!track || !mq) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      track.style.transform = "none";
      return;
    }

    // duplicate content for seamless loop
    track.innerHTML += track.innerHTML;

    let x = 0;
    const base = parseFloat(mq.dataset.speed || "0.7");
    const dir = mq.dataset.dir === "rev" ? 1 : -1;
    let extra = 0;
    let half = track.scrollWidth / 2;
    let raf = 0;

    function onResize() {
      half = track!.scrollWidth / 2;
    }
    window.addEventListener("resize", onResize);

    const lenis = (window as unknown as {
      __lenis?: { on: (e: string, cb: (e: { velocity?: number }) => void) => void };
    }).__lenis;
    const onScroll = (e: { velocity?: number }) => {
      extra = (e.velocity || 0) * 0.6;
    };
    if (lenis) lenis.on("scroll", onScroll);

    function tick() {
      x += dir * (base + Math.abs(extra));
      if (dir < 0 && x <= -half) x += half;
      if (dir > 0 && x >= 0) x -= half;
      track!.style.transform = `translate3d(${x}px,0,0)`;
      extra *= 0.9;
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="marquee" ref={mqRef} data-speed="0.7" data-dir="fwd">
      <div className="marquee-track" ref={trackRef}>
        <span className="marquee-item">
          REACT <span className="star">✦</span>
        </span>
        <span className="marquee-item fill">
          NEXT.JS <span className="star">✦</span>
        </span>
        <span className="marquee-item">
          FRAMER MOTION <span className="star">✦</span>
        </span>
        <span className="marquee-item fill">
          TYPESCRIPT <span className="star">✦</span>
        </span>
        <span className="marquee-item">
          INTERACTION DESIGN <span className="star">✦</span>
        </span>
      </div>
    </div>
  );
}
