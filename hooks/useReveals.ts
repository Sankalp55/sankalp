"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scans the document for the data-reveal/data-split/data-fade/data-clip/
 * data-count/data-parallax markers and wires up GSAP reveals + scroll triggers.
 * Re-runs whenever `deps` change (use to retrigger on route mount).
 */
export function useReveals(deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const createdTriggers: ScrollTrigger[] = [];
    const cleanups: (() => void)[] = [];

    function splitWords(el: HTMLElement) {
      if (el.dataset.splitDone)
        return el.querySelectorAll<HTMLSpanElement>(".split-inner");

      // Walk text nodes only — preserves nested <em>/<span class="outline"> markup.
      function processNode(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || "";
          if (!text.trim()) return;
          const frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach((chunk) => {
            if (chunk.trim() === "") {
              frag.appendChild(document.createTextNode(chunk));
              return;
            }
            const wrap = document.createElement("span");
            wrap.className = "split-word";
            wrap.style.display = "inline-block";
            wrap.style.overflow = "hidden";
            wrap.style.verticalAlign = "top";
            const inner = document.createElement("span");
            inner.className = "split-inner";
            inner.style.display = "inline-block";
            inner.style.willChange = "transform";
            inner.textContent = chunk;
            wrap.appendChild(inner);
            frag.appendChild(wrap);
          });
          (node as ChildNode).replaceWith(frag);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const children = Array.from(node.childNodes);
          children.forEach(processNode);
        }
      }
      processNode(el);
      el.dataset.splitDone = "1";
      return el.querySelectorAll<HTMLSpanElement>(".split-inner");
    }

    // [data-split]
    document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const inners = splitWords(el);
      if (!inners) return;
      if (reduce) {
        gsap.set(inners, { y: 0, opacity: 1 });
        return;
      }
      gsap.set(inners, { yPercent: 115 });
      const tween = gsap.to(inners, {
        yPercent: 0,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.045,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
      if (tween.scrollTrigger) createdTriggers.push(tween.scrollTrigger);
    });

    // [data-reveal]
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const targets = el.querySelectorAll<HTMLElement>(".reveal-line > *");
      const arr: HTMLElement[] = targets.length ? Array.from(targets) : [el];
      if (reduce) {
        gsap.set(arr, { y: 0, opacity: 1 });
        return;
      }
      gsap.set(arr, { yPercent: 110 });
      const tween = gsap.to(arr, {
        yPercent: 0,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
      if (tween.scrollTrigger) createdTriggers.push(tween.scrollTrigger);
    });

    // [data-fade]
    document.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      if (reduce) {
        gsap.set(el, { y: 0, opacity: 1 });
        return;
      }
      const tween = gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "expo.out",
          delay: parseFloat(el.dataset.fade || "0") || 0,
          scrollTrigger: { trigger: el, start: "top 90%" },
        }
      );
      if (tween.scrollTrigger) createdTriggers.push(tween.scrollTrigger);
    });

    // [data-clip]
    document.querySelectorAll<HTMLElement>("[data-clip]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      if (reduce) return;
      const tween = gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.25,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
      if (tween.scrollTrigger) createdTriggers.push(tween.scrollTrigger);
    });

    // [data-count]
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const end = parseFloat(el.dataset.count || "0");
      const suffix = el.dataset.suffix || "";
      const dec = (el.dataset.count || "").indexOf(".") > -1 ? 1 : 0;
      if (reduce) {
        el.textContent = end + suffix;
        return;
      }
      const obj = { v: 0 };
      const tween = gsap.to(obj, {
        v: end,
        duration: 2.0,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%" },
        onUpdate: () => {
          el.textContent = obj.v.toFixed(dec) + suffix;
        },
      });
      if (tween.scrollTrigger) createdTriggers.push(tween.scrollTrigger);
    });

    // [data-parallax]
    document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      if (reduce) return;
      const amt = parseFloat(el.dataset.parallax || "12") || 12;
      const scope = el.closest("[data-parallax-scope]") || el;
      const tween = gsap.fromTo(
        el,
        { yPercent: -amt },
        {
          yPercent: amt,
          ease: "none",
          scrollTrigger: {
            trigger: scope as HTMLElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      if (tween.scrollTrigger) createdTriggers.push(tween.scrollTrigger);
    });

    // project-image mouse parallax
    document.querySelectorAll<HTMLElement>(".proj-media").forEach((media) => {
      const layer = media.querySelector<HTMLElement>(".ph");
      if (!layer) return;
      function onMove(e: PointerEvent) {
        const r = media.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / r.width;
        const y = (e.clientY - (r.top + r.height / 2)) / r.height;
        layer!.style.transform = `scale(1.12) translate(${x * -16}px, ${y * -16}px)`;
      }
      function onLeave() {
        layer!.style.transform = "scale(1.05) translate(0,0)";
      }
      media.addEventListener("pointermove", onMove);
      media.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        media.removeEventListener("pointermove", onMove);
        media.removeEventListener("pointerleave", onLeave);
      });
    });

    // give the layout a tick so triggers see correct positions
    setTimeout(() => ScrollTrigger.refresh(), 60);

    return () => {
      createdTriggers.forEach((t) => t.kill());
      cleanups.forEach((c) => c());
      // remove dataset.done flags so re-mount re-runs cleanly
      document
        .querySelectorAll<HTMLElement>(
          "[data-split],[data-reveal],[data-fade],[data-clip],[data-count],[data-parallax]"
        )
        .forEach((el) => {
          delete el.dataset.done;
          delete el.dataset.splitDone;
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
