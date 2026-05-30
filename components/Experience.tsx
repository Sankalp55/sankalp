export default function Experience() {
  return (
    <section className="shell section-pad" id="experience" data-screen-label="Experience">
      <div className="exp-head">
        <div data-reveal>
          <div className="reveal-line">
            <span className="kicker">02 — Experience</span>
          </div>
        </div>
        <h2 className="big-head" data-split>
          Where I have <em>shipped.</em>
        </h2>
      </div>

      <div className="exp-list">
        <div className="exp-row" data-fade>
          <div className="exp-when">
            2025 — Present
            <br />
            Internship
          </div>
          <div>
            <div className="exp-role">
              Frontend Developer <span className="at">@ Sneads</span>
            </div>
            <div className="exp-tags">
              <span className="tag">React</span>
              <span className="tag">Next.js</span>
              <span className="tag">Framer Motion</span>
              <span className="tag">API Integration</span>
            </div>
          </div>
          <p className="exp-desc">
            Built production interfaces with React and Next.js, wired live data through API
            integration, and brought screens to life with Framer Motion. Focused on responsiveness,
            accessibility and the small details that make a product feel considered.
          </p>
        </div>
      </div>

      <div className="stats">
        <div className="stat" data-fade>
          <div className="num">
            <span data-count="40" data-suffix="+">
              0
            </span>
          </div>
          <div className="lab">Components shipped to production</div>
        </div>
        <div className="stat" data-fade="0.08">
          <div className="num">
            <span data-count="60" data-suffix="fps">
              0
            </span>
          </div>
          <div className="lab">Animation target, held under load</div>
        </div>
        <div className="stat" data-fade="0.16">
          <div className="num">
            <span data-count="3">0</span>
          </div>
          <div className="lab">Core projects, end to end</div>
        </div>
        <div className="stat" data-fade="0.24">
          <div className="num">
            <span data-count="100" data-suffix="%">
              0
            </span>
          </div>
          <div className="lab">Responsive, mobile to desktop</div>
        </div>
      </div>
    </section>
  );
}
