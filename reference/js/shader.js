/* ============================================================
   HERO WEBGL — acid domain-warped flow field, mouse reactive
   Self-contained raw WebGL. Falls back gracefully.
   ============================================================ */
(function () {
  const canvas = document.getElementById("gl");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const gl = canvas.getContext("webgl", { antialias: true, alpha: false, premultipliedAlpha: false });
  if (!gl) {
    // CSS fallback: static acid gradient haze
    canvas.style.background =
      "radial-gradient(120% 90% at 70% 30%, rgba(198,255,58,0.18), transparent 55%), radial-gradient(100% 80% at 20% 80%, rgba(158,212,15,0.12), transparent 60%), #0a0a0a";
    return;
  }

  const vert = `
    attribute vec2 p;
    void main() { gl_Position = vec4(p, 0.0, 1.0); }
  `;

  const frag = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec2 u_mouse;     // 0..1
    uniform float u_mdist;    // mouse influence 0..1

    // hash / noise (Inigo Quilez style value noise)
    float hash(vec2 p){
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5;
      for(int i=0;i<6;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
      return v;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      vec2 p = (gl_FragCoord.xy - 0.5*u_res.xy) / u_res.y;
      float t = u_time * 0.06;

      // mouse warp: pull the field toward the cursor
      vec2 m = (u_mouse - 0.5);
      m.x *= u_res.x / u_res.y;
      float md = length(p - m);
      vec2 pull = (p - m) * (-0.55 / (md*md + 0.18)) * (0.35 + u_mdist*0.65);

      // domain warp
      vec2 q = vec2(fbm(p*1.6 + vec2(0.0, t)), fbm(p*1.6 + vec2(5.2, -t)));
      vec2 r = vec2(fbm(p*1.6 + 3.0*q + vec2(1.7, 9.2) + t*0.7 + pull),
                    fbm(p*1.6 + 3.0*q + vec2(8.3, 2.8) - t*0.6 + pull));
      float f = fbm(p*1.6 + 4.0*r + t);

      // contour bands for a kinetic, liquid feel
      float bands = abs(sin(f*7.0 + t*2.0 + length(pull)*4.0));
      bands = smoothstep(0.0, 0.06, bands) * smoothstep(1.0, 0.5, bands);

      vec3 bg = vec3(0.043, 0.047, 0.039);
      vec3 acid = vec3(0.776, 1.0, 0.227);
      vec3 deep = vec3(0.62, 0.83, 0.06);

      float glow = smoothstep(0.45, 1.0, f);
      float mhalo = 0.16 / (md*1.2 + 0.10) * (0.45 + u_mdist*1.0);

      vec3 col = bg;
      col = mix(col, deep*0.62, glow*0.85);
      col += acid * bands * (0.18 + glow*0.42);
      col += acid * mhalo * 0.40;

      // subtle vignette
      float vig = smoothstep(1.35, 0.15, length(uv-0.5));
      col *= 0.62 + 0.38*vig;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("shader error", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, vert);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) { canvas.style.background = "#0a0a0a"; return; }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "u_res");
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");
  const uMdist = gl.getUniformLocation(prog, "u_mdist");

  let W = 0, H = 0;
  const DPR = Math.min(window.devicePixelRatio || 1, 1.75);
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener("resize", resize);
  resize();

  let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5, mdist = 0, tmdist = 0;
  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    tmx = (e.clientX - r.left) / r.width;
    tmy = 1.0 - (e.clientY - r.top) / r.height;
    tmdist = 1.0;
  });
  window.addEventListener("pointerout", () => { tmdist = 0; });

  const start = performance.now();
  let raf;
  let lastDraw = 0;

  function render(now) {
    raf = requestAnimationFrame(render);
    // mouse easing
    mx += (tmx - mx) * 0.06;
    my += (tmy - my) * 0.06;
    mdist += (tmdist - mdist) * 0.04;
    tmdist *= 0.985;

    const t = reduce ? 0 : (now - start) / 1000;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, mx, my);
    gl.uniform1f(uMdist, mdist);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (reduce) { cancelAnimationFrame(raf); } // draw one frame only
  }
  raf = requestAnimationFrame(render);

  // pause when hero offscreen to save GPU
  const hero = document.querySelector(".hero");
  if (hero && "IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { if (!raf) raf = requestAnimationFrame(render); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0.01 });
    io.observe(hero);
  }
})();
