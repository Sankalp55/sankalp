"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

type WipeLabel = "HOME" | "WORK" | "ABOUT";

type Ctx = {
  registerBars: (bars: HTMLSpanElement[]) => void;
  registerLabel: (el: HTMLDivElement | null) => void;
  registerWipe: (el: HTMLDivElement | null) => void;
  navigateWithWipe: (href: string, label: WipeLabel, anchor?: string) => void;
  wipeOut: () => void;
  pendingAnchor: string | null;
  clearPendingAnchor: () => void;
};

const TransitionContext = createContext<Ctx | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const barsRef = useRef<HTMLSpanElement[]>([]);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const wipeRef = useRef<HTMLDivElement | null>(null);
  const animatingRef = useRef(false);
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  const registerBars = useCallback((bars: HTMLSpanElement[]) => {
    barsRef.current = bars;
  }, []);
  const registerLabel = useCallback((el: HTMLDivElement | null) => {
    labelRef.current = el;
  }, []);
  const registerWipe = useCallback((el: HTMLDivElement | null) => {
    wipeRef.current = el;
  }, []);
  const clearPendingAnchor = useCallback(() => setPendingAnchor(null), []);

  const navigateWithWipe = useCallback(
    (href: string, label: WipeLabel, anchor?: string) => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const bars = barsRef.current;
      const labelEl = labelRef.current;
      const wipe = wipeRef.current;

      if (anchor) setPendingAnchor(anchor);

      if (reduce || !bars.length || !labelEl || !wipe) {
        router.push(href);
        animatingRef.current = false;
        return;
      }

      const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } })
        .__lenis;
      if (lenis) lenis.stop();

      labelEl.textContent = label;

      const tl = gsap.timeline({
        onComplete: () => {
          animatingRef.current = false;
          if (lenis) lenis.start();
        },
      });
      tl.set(wipe, { pointerEvents: "auto" });
      tl.to(bars, {
        scaleY: 1,
        transformOrigin: "bottom",
        duration: 0.5,
        ease: "expo.inOut",
        stagger: { each: 0.05, from: "start" },
      });
      tl.to(labelEl, { opacity: 1, duration: 0.25 }, "-=0.35");
      tl.add(() => {
        router.push(href);
      });
      // wait for path mount, then continue (Chrome's pathname effect will also fire,
      // but we still need to play out the exit here as a fallback)
    },
    [router]
  );

  const wipeOut = useCallback(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bars = barsRef.current;
    const labelEl = labelRef.current;
    const wipe = wipeRef.current;
    if (reduce || !bars.length || !labelEl || !wipe) return;

    // ensure bars are visible (covered) before reverse
    gsap.set(bars, { scaleY: 1, transformOrigin: "bottom" });
    gsap.set(labelEl, { opacity: 1 });

    const tl = gsap.timeline();
    tl.to(labelEl, { opacity: 0, duration: 0.2, delay: 0.1 });
    tl.to(
      bars,
      {
        scaleY: 0,
        transformOrigin: "top",
        duration: 0.5,
        ease: "expo.inOut",
        stagger: { each: 0.05, from: "end" },
      },
      "-=0.05"
    );
    tl.set(wipe, { pointerEvents: "none" });
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        registerBars,
        registerLabel,
        registerWipe,
        navigateWithWipe,
        wipeOut,
        pendingAnchor,
        clearPendingAnchor,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition outside provider");
  return ctx;
}
