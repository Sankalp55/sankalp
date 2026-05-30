"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroShader from "./HeroShader";
import Btn from "./Btn";

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const title = titleRef.current;
    const grid = gridRef.current;

    function fitHeroTitle() {
      if (!title || !grid) return;
      const cs = getComputedStyle(grid);
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const avail = grid.clientWidth - padL - padR;
      if (avail <= 0) return;
      const ref = 200;
      title.style.fontSize = ref + "px";
      let maxW = 0;
      title.querySelectorAll<HTMLSpanElement>(".line span").forEach((s) => {
        maxW = Math.max(maxW, s.scrollWidth);
      });
      if (maxW <= 0) {
        title.style.fontSize = "";
        return;
      }
      const size = Math.floor(ref * (avail / maxW) * 0.985);
      title.style.fontSize = size + "px";
    }
    let fitRAF = 0;
    function scheduleFit() {
      cancelAnimationFrame(fitRAF);
      fitRAF = requestAnimationFrame(fitHeroTitle);
    }
    scheduleFit();
    window.addEventListener("resize", scheduleFit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleFit);

    // hero intro timeline
    const lines = document.querySelectorAll<HTMLSpanElement>(".hero-title .line span");
    if (reduce) {
      gsap.set(lines, { yPercent: 0 });
      gsap.set([".hero-sub", ".hero-cta", ".hero-top", ".scroll-cue"], { opacity: 1 });
    } else {
      gsap.set(lines, { yPercent: 120 });
      gsap.set([".hero-sub", ".hero-cta", ".hero-top", ".scroll-cue"], { opacity: 0, y: 20 });
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(lines, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.1 })
        .to(".hero-top", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.7")
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.7")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.7")
        .to(".scroll-cue", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

      const parallaxTl1 = gsap.to(".hero-grid", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      const parallaxTl2 = gsap.to("#gl", {
        yPercent: 8,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      return () => {
        cancelAnimationFrame(fitRAF);
        window.removeEventListener("resize", scheduleFit);
        parallaxTl1.scrollTrigger?.kill();
        parallaxTl2.scrollTrigger?.kill();
        tl.kill();
      };
    }
    return () => {
      cancelAnimationFrame(fitRAF);
      window.removeEventListener("resize", scheduleFit);
    };
  }, []);

  return (
    <section className="hero" data-screen-label="Hero">
      <HeroShader />
      <div className="hero-top">
        <div>
          FRONTEND FOCUSED
          <br />
          FULL STACK DEVELOPER
        </div>
        <div className="r">
          BASED IN INDIA
          <br />
          AVAILABLE 2026
        </div>
      </div>
      <div className="hero-grid" ref={gridRef}>
        <h1 className="hero-title" ref={titleRef}>
          <span className="line">
            <span>SANKALP</span>
          </span>
          <span className="line">
            <span className="outline">TYAGI</span>
          </span>
          <span className="line">
            <span>
              BUILDS <em>UI.</em>
            </span>
          </span>
        </h1>
      </div>
      <p className="hero-sub">
        I engineer interfaces where motion, detail and performance meet. React, Next.js and Framer
        Motion are my instruments — interaction quality is the point, not the afterthought.
      </p>
      <div className="hero-cta">
        <Btn solid strength={0.45} cursor="View" scrollTo="#projects-teaser">
          See the work
        </Btn>
        <Btn
          arrow
          strength={0.45}
          cursor="Open"
          href="https://www.linkedin.com/in/sankalp-tyagi-173844265/"
          external
        >
          LinkedIn
        </Btn>
      </div>
      <div className="scroll-cue">
        <span>SCROLL</span>
        <span className="bar" />
      </div>
    </section>
  );
}
