"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let rx = mx,
      ry = my;
    let raf = 0;

    function onMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
      dot!.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      label!.style.transform = `translate(${mx}px, ${my + 26}px) translate(-50%, -50%)`;
    }

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring!.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    }
    loop();

    const hoverSel = "a, button, .magnetic, input, textarea, .proj, .skill-row";

    function onOver(e: PointerEvent) {
      const t = (e.target as Element).closest(hoverSel);
      if (!t) return;
      ring!.classList.add("hover");
      const lab = t.getAttribute("data-cursor");
      if (lab) {
        label!.textContent = lab;
        label!.style.opacity = "1";
        ring!.classList.add("drag");
      }
    }
    function onOut(e: PointerEvent) {
      const t = (e.target as Element).closest(hoverSel);
      if (!t) return;
      ring!.classList.remove("hover");
      ring!.classList.remove("drag");
      label!.style.opacity = "0";
    }

    // MAGNETIC effect via event delegation so it survives route changes
    let activeMagnet: HTMLElement | null = null;
    function onMagnetEnter(e: PointerEvent) {
      const t = (e.target as Element).closest(".magnetic") as HTMLElement | null;
      if (!t) return;
      activeMagnet = t;
    }
    function onMagnetMove(e: PointerEvent) {
      if (!activeMagnet) return;
      const r = activeMagnet.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      if (!inside) {
        activeMagnet.style.transform = "translate(0,0)";
        activeMagnet = null;
        return;
      }
      const strength = parseFloat(activeMagnet.getAttribute("data-strength") || "0.4");
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      activeMagnet.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    }
    function onMagnetLeave(e: PointerEvent) {
      const t = (e.target as Element).closest(".magnetic") as HTMLElement | null;
      if (!t) return;
      t.style.transform = "translate(0,0)";
      if (activeMagnet === t) activeMagnet = null;
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointermove", onMagnetMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerover", onMagnetEnter);
    document.addEventListener("pointerout", onMagnetLeave);
    window.addEventListener("blur", () => {
      label!.style.opacity = "0";
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", onMagnetMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerover", onMagnetEnter);
      document.removeEventListener("pointerout", onMagnetLeave);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" aria-hidden ref={dotRef} />
      <div className="cursor-ring" aria-hidden ref={ringRef} />
      <div className="cursor-label" aria-hidden ref={labelRef} />
    </>
  );
}
