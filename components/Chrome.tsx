"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Cursor from "./Cursor";
import WipeOverlay from "./WipeOverlay";
import { TransitionProvider, useTransition } from "./TransitionProvider";

function ChromeInner({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const { wipeOut, pendingAnchor, clearPendingAnchor } = useTransition();
  const firstPathRef = useRef(true);

  // init Lenis + GSAP once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    if (!reduce) {
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      let rafId = requestAnimationFrame(raf);

      lenis.on("scroll", ScrollTrigger.update);

      // expose globally for marquee + button scrolls
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      };
    }
    return;
  }, []);

  // On path change, play wipe-out and scroll to top (or anchor)
  useEffect(() => {
    if (firstPathRef.current) {
      firstPathRef.current = false;
      return;
    }
    // reset scroll, then if there is a pending anchor scroll to it, then wipe out
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);

    if (pendingAnchor) {
      // give DOM a tick to render
      const id = pendingAnchor;
      clearPendingAnchor();
      setTimeout(() => {
        const el = document.querySelector(id);
        if (el) {
          if (lenis) lenis.scrollTo(el as HTMLElement, { immediate: true });
          else (el as HTMLElement).scrollIntoView();
        }
      }, 30);
    }

    // refresh scroll triggers for new route
    setTimeout(() => ScrollTrigger.refresh(), 60);

    // wipe out animation
    wipeOut();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="grain" aria-hidden />
      <Cursor />
      <WipeOverlay />
      <Nav />
      {children}
    </>
  );
}

export default function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <TransitionProvider>
      <ChromeInner>{children}</ChromeInner>
    </TransitionProvider>
  );
}
