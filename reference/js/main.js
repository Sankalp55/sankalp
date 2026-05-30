/* ============================================================
   MAIN — Lenis smooth scroll, GSAP ScrollTrigger reveals,
   view router with wipe transitions, marquee, counters, form.
   ============================================================ */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof gsap !== "undefined";
  if (hasGSAP && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  /* ---------- LENIS SMOOTH SCROLL ---------- */
  let lenis = null;
  if (typeof Lenis !== "undefined" && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasGSAP && typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
    }
  }
  function scrollTo(target, opts) {
    if (lenis) lenis.scrollTo(target, Object.assign({ duration: 1.2, offset: 0 }, opts || {}));
    else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (el) el.scrollIntoView ? window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" }) : null;
    }
  }

  /* ---------- SPLIT TEXT into lines/words (lightweight) ---------- */
  function splitWords(el) {
    if (el.dataset.split) return;
    const text = el.textContent;
    el.textContent = "";
    const frag = document.createDocumentFragment();
    text.split(/(\s+)/).forEach((chunk) => {
      if (chunk.trim() === "") { frag.appendChild(document.createTextNode(chunk)); return; }
      const wrap = document.createElement("span");
      wrap.style.display = "inline-block";
      wrap.style.overflow = "hidden";
      wrap.style.verticalAlign = "top";
      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.style.willChange = "transform";
      inner.textContent = chunk;
      wrap.appendChild(inner);
      frag.appendChild(wrap);
    });
    el.appendChild(frag);
    el.dataset.split = "1";
    return el.querySelectorAll("span > span");
  }

  /* ---------- REVEAL ANIMATIONS ---------- */
  function initReveals(scope) {
    if (!hasGSAP) { scope.querySelectorAll("[data-reveal],[data-split],[data-fade],[data-count],[data-clip]").forEach(e=>e.style.opacity=1); return; }
    const root = scope || document;

    // split-word headline reveals
    root.querySelectorAll("[data-split]").forEach((el) => {
      if (el.dataset.done) return; el.dataset.done = "1";
      const inners = splitWords(el);
      if (reduce) { gsap.set(inners, { y: 0, opacity: 1 }); return; }
      gsap.set(inners, { yPercent: 115 });
      gsap.to(inners, {
        yPercent: 0, duration: 1.0, ease: "expo.out", stagger: 0.045,
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    // line reveals (.reveal-line > child)
    root.querySelectorAll("[data-reveal] ").forEach(() => {});
    root.querySelectorAll("[data-reveal]").forEach((el) => {
      if (el.dataset.done) return; el.dataset.done = "1";
      const targets = el.querySelectorAll(".reveal-line > *");
      const arr = targets.length ? targets : [el];
      if (reduce) { gsap.set(arr, { y: 0, opacity: 1 }); return; }
      gsap.set(arr, { yPercent: 110 });
      gsap.to(arr, {
        yPercent: 0, duration: 1.0, ease: "expo.out", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    // simple fade-up
    root.querySelectorAll("[data-fade]").forEach((el) => {
      if (el.dataset.done) return; el.dataset.done = "1";
      if (reduce) { gsap.set(el, { y: 0, opacity: 1 }); return; }
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.0, ease: "expo.out",
        delay: parseFloat(el.dataset.fade) || 0,
        scrollTrigger: { trigger: el, start: "top 90%" }
      });
    });

    // clip wipe (images / blocks)
    root.querySelectorAll("[data-clip]").forEach((el) => {
      if (el.dataset.done) return; el.dataset.done = "1";
      if (reduce) return;
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, {
        clipPath: "inset(0 0 0% 0)", duration: 1.25, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    // number counters
    root.querySelectorAll("[data-count]").forEach((el) => {
      if (el.dataset.done) return; el.dataset.done = "1";
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dec = (el.dataset.count.indexOf(".") > -1) ? 1 : 0;
      if (reduce) { el.textContent = end + suffix; return; }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 2.0, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%" },
        onUpdate: () => { el.textContent = obj.v.toFixed(dec) + suffix; }
      });
    });

    // parallax on [data-parallax]
    root.querySelectorAll("[data-parallax]").forEach((el) => {
      if (el.dataset.done) return; el.dataset.done = "1";
      if (reduce) return;
      const amt = parseFloat(el.dataset.parallax) || 12;
      gsap.fromTo(el, { yPercent: -amt }, {
        yPercent: amt, ease: "none",
        scrollTrigger: { trigger: el.closest("[data-parallax-scope]") || el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  /* ---------- MARQUEE (speed reacts to scroll) ---------- */
  function initMarquee() {
    document.querySelectorAll(".marquee").forEach((mq) => {
      const track = mq.querySelector(".marquee-track");
      if (!track) return;
      // duplicate content for seamless loop
      track.innerHTML += track.innerHTML;
      let x = 0; let base = parseFloat(mq.dataset.speed || "0.6"); let dir = (mq.dataset.dir === "rev") ? 1 : -1;
      let extra = 0;
      let half = track.scrollWidth / 2;
      window.addEventListener("resize", () => { half = track.scrollWidth / 2; });
      if (lenis) lenis.on("scroll", (e) => { extra = (e.velocity || 0) * 0.6; });
      function tick() {
        x += dir * (base + Math.abs(extra)) ;
        if (dir < 0 && x <= -half) x += half;
        if (dir > 0 && x >= 0) x -= half;
        track.style.transform = `translate3d(${x}px,0,0)`;
        extra *= 0.9;
        requestAnimationFrame(tick);
      }
      if (!reduce) tick(); else track.style.transform = "none";
    });
  }

  /* ---------- PROJECT IMAGE: mouse parallax ---------- */
  function initProjectMouse() {
    if (reduce) return;
    document.querySelectorAll(".proj-media").forEach((media) => {
      const layer = media.querySelector(".ph");
      if (!layer) return;
      media.addEventListener("pointermove", (e) => {
        const r = media.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / r.width;
        const y = (e.clientY - (r.top + r.height / 2)) / r.height;
        layer.style.transform = `scale(1.12) translate(${x * -16}px, ${y * -16}px)`;
      });
      media.addEventListener("pointerleave", () => { layer.style.transform = "scale(1.05) translate(0,0)"; });
    });
  }

  /* ---------- VIEW ROUTER with WIPE TRANSITION ---------- */
  const views = { home: document.getElementById("view-home"), projects: document.getElementById("view-projects"), about: document.getElementById("view-about") };
  const wipe = document.querySelector(".wipe");
  const wipeBars = wipe ? wipe.querySelectorAll("span") : [];
  const wipeLabel = document.querySelector(".wipe-label");
  let current = "home";
  let animating = false;

  function setActiveNav(name) {
    document.querySelectorAll(".nav-link").forEach((l) => l.classList.toggle("active", l.dataset.view === name));
  }

  function showView(name, anchor) {
    if (animating || (name === current && !anchor)) {
      if (anchor) scrollTo(anchor);
      return;
    }
    setActiveNav(name);
    if (reduce || !hasGSAP) {
      Object.values(views).forEach((v) => v && v.classList.remove("active"));
      if (views[name]) views[name].classList.add("active");
      current = name;
      window.scrollTo(0, 0);
      if (anchor) setTimeout(() => scrollTo(anchor), 30);
      ScrollTrigger && ScrollTrigger.refresh();
      return;
    }
    animating = true;
    if (lenis) lenis.stop();
    wipeLabel.textContent = name === "home" ? "HOME" : name === "projects" ? "WORK" : "ABOUT";

    const tl = gsap.timeline({
      onComplete: () => { animating = false; if (lenis) lenis.start(); }
    });
    tl.set(wipe, { pointerEvents: "auto" });
    tl.to(wipeBars, { scaleY: 1, transformOrigin: "bottom", duration: 0.5, ease: "expo.inOut", stagger: { each: 0.05, from: "start" } });
    tl.to(wipeLabel, { opacity: 1, duration: 0.25 }, "-=0.35");
    tl.add(() => {
      Object.values(views).forEach((v) => v && v.classList.remove("active"));
      if (views[name]) views[name].classList.add("active");
      current = name;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
      if (anchor) { const el = document.querySelector(anchor); if (el && lenis) lenis.scrollTo(el, { immediate: true }); }
    });
    tl.to(wipeLabel, { opacity: 0, duration: 0.2 }, "+=0.1");
    tl.to(wipeBars, { scaleY: 0, transformOrigin: "top", duration: 0.5, ease: "expo.inOut", stagger: { each: 0.05, from: "end" } }, "-=0.05");
    tl.set(wipe, { pointerEvents: "none" });
  }

  // nav clicks
  document.querySelectorAll("[data-view]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const name = link.dataset.view;
      const anchor = link.dataset.anchor || null;
      showView(name, anchor);
    });
  });
  // in-page anchor links (same view)
  document.querySelectorAll("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const anchor = link.dataset.scroll;
      const viewName = link.dataset.fromview;
      if (viewName && viewName !== current) showView(viewName, anchor);
      else scrollTo(anchor);
    });
  });

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    const okMsg = form.querySelector(".form-ok");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[data-validate]").forEach((field) => {
        const input = field.querySelector("input, textarea");
        const msg = field.querySelector(".msg");
        const type = input.getAttribute("data-validate");
        let err = "";
        const val = input.value.trim();
        if (!val) err = "Required";
        else if (type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) err = "Enter a valid email";
        if (err) { valid = false; field.classList.add("err"); msg.textContent = err; }
        else { field.classList.remove("err"); msg.textContent = ""; }
      });
      if (valid) {
        okMsg.textContent = "Message sent. I will reply shortly.";
        form.reset();
        setTimeout(() => { okMsg.textContent = ""; }, 4000);
      }
    });
    form.querySelectorAll("input, textarea").forEach((i) => {
      i.addEventListener("input", () => { const f = i.closest(".field"); if (f) { f.classList.remove("err"); const m = f.querySelector(".msg"); if (m) m.textContent = ""; } });
    });
  }

  /* ---------- FIT HERO TITLE to viewport width ---------- */
  function fitHeroTitle() {
    const title = document.querySelector(".hero-title");
    const grid = document.querySelector(".hero-grid");
    if (!title || !grid) return;
    const cs = getComputedStyle(grid);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const avail = grid.clientWidth - padL - padR;
    if (avail <= 0) return;
    // measure at a known reference size
    const ref = 200;
    title.style.fontSize = ref + "px";
    let maxW = 0;
    title.querySelectorAll(".line span").forEach((s) => { maxW = Math.max(maxW, s.scrollWidth); });
    if (maxW <= 0) { title.style.fontSize = ""; return; }
    // 0.98 keeps a hair of breathing room from the edge
    const size = Math.floor(ref * (avail / maxW) * 0.985);
    title.style.fontSize = size + "px";
  }
  let fitRAF;
  function scheduleFit() { cancelAnimationFrame(fitRAF); fitRAF = requestAnimationFrame(fitHeroTitle); }
  window.addEventListener("resize", scheduleFit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleFit);

  /* ---------- HERO INTRO TIMELINE ---------- */
  function heroIntro() {
    if (!hasGSAP) return;
    const lines = document.querySelectorAll(".hero-title .line span");
    const tl = gsap.timeline({ delay: 0.2 });
    if (reduce) { gsap.set(lines, { yPercent: 0 }); gsap.set(".hero-sub, .hero-cta, .hero-top, .scroll-cue", { opacity: 1 }); return; }
    gsap.set(lines, { yPercent: 120 });
    gsap.set([".hero-sub", ".hero-cta", ".hero-top", ".scroll-cue"], { opacity: 0, y: 20 });
    tl.to(lines, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.1 })
      .to(".hero-top", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.7")
      .to(".hero-sub", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.7")
      .to(".hero-cta", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.7")
      .to(".scroll-cue", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");

    // scroll parallax on hero text
    gsap.to(".hero-grid", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to("#gl", { yPercent: 8, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------- INIT ---------- */
  window.addEventListener("DOMContentLoaded", () => {
    fitHeroTitle();
    heroIntro();
    initReveals(document);
    initMarquee();
    initProjectMouse();
    setActiveNav("home");
    if (hasGSAP && typeof ScrollTrigger !== "undefined") setTimeout(() => ScrollTrigger.refresh(), 300);
  });
})();
