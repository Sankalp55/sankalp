/* ============================================================
   CURSOR + MICRO-INTERACTIONS
   Custom cursor, magnetic buttons, hover skews, link labels.
   ============================================================ */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduce || !fine) return;

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  const label = document.querySelector(".cursor-label");
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    label.style.transform = `translate(${mx}px, ${my + 26}px) translate(-50%, -50%)`;
  });

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  // hover states for interactive targets
  const hoverSel = "a, button, .magnetic, input, textarea, .proj, .skill-row";
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest(hoverSel);
    if (!t) return;
    ring.classList.add("hover");
    const lab = t.getAttribute("data-cursor");
    if (lab) { label.textContent = lab; label.style.opacity = "1"; ring.classList.add("drag"); }
  });
  document.addEventListener("pointerout", (e) => {
    const t = e.target.closest(hoverSel);
    if (!t) return;
    ring.classList.remove("hover");
    ring.classList.remove("drag");
    label.style.opacity = "0";
  });

  // MAGNETIC effect
  const magnets = document.querySelectorAll(".magnetic");
  magnets.forEach((m) => {
    const strength = parseFloat(m.getAttribute("data-strength") || "0.4");
    m.addEventListener("pointermove", (e) => {
      const r = m.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      m.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      const t = m.querySelector(".t, span");
    });
    m.addEventListener("pointerleave", () => {
      m.style.transform = "translate(0,0)";
    });
  });

  // hide native cursor leftover on touch / blur
  window.addEventListener("blur", () => { label.style.opacity = "0"; });
})();
