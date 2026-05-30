import Btn from "@/components/Btn";
import Footer from "@/components/Footer";
import RevealsRunner from "@/components/RevealsRunner";

export default function AboutPage() {
  return (
    <div data-screen-label="About view">
      <section
        className="shell"
        style={{ paddingTop: "clamp(140px, 18vh, 240px)" }}
        data-screen-label="About header"
      >
        <div data-reveal>
          <div className="reveal-line">
            <span className="kicker">03 — About</span>
          </div>
        </div>
        <p className="about-lead" data-split>
          I make interfaces that <em>feel</em> as good as they look.
        </p>
      </section>

      <section className="shell section-pad">
        <div className="about-grid">
          <div className="portrait" data-clip>
            <div className="ph">
              <span className="ph-tag">Portrait — photo</span>
            </div>
          </div>
          <div className="about-body">
            <p data-fade>
              <strong>I am Sankalp Tyagi, a frontend focused full stack developer.</strong> My work
              lives at the intersection of engineering and craft — I care about how a button
              responds under your finger as much as how the data flows behind it.
            </p>
            <p data-fade="0.06">
              Right now I am a frontend developer at <strong>Sneads</strong>, building production
              interfaces with React and Next.js, integrating live APIs, and choreographing motion
              with Framer Motion. I am happiest when a screen goes from functional to delightful.
            </p>
            <p data-fade="0.12">
              Beyond the front end, I build full systems — from a Django microblogging platform to
              a Python powered geospatial analytics tool. I like understanding the whole stack so
              the surface can be exactly right.
            </p>

            <div className="skills" style={{ marginTop: 36 }}>
              <div className="skill-row" data-fade>
                <span className="n">React / Next.js</span>
                <span className="v">DAILY DRIVER</span>
              </div>
              <div className="skill-row" data-fade="0.04">
                <span className="n">Framer Motion / GSAP</span>
                <span className="v">MOTION</span>
              </div>
              <div className="skill-row" data-fade="0.08">
                <span className="n">TypeScript</span>
                <span className="v">FLUENT</span>
              </div>
              <div className="skill-row" data-fade="0.12">
                <span className="n">Python / Django</span>
                <span className="v">BACKEND</span>
              </div>
              <div className="skill-row" data-fade="0.16">
                <span className="n">Pandas / NumPy / OpenCV</span>
                <span className="v">DATA</span>
              </div>
            </div>

            <div style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Btn solid strength={0.4} cursor="Talk" href="/" wipe="HOME" anchor="#contact">
                Work with me
              </Btn>
              <Btn
                arrow
                strength={0.4}
                cursor="Open"
                href="https://www.linkedin.com/in/sankalp-tyagi-173844265/"
                external
              >
                LinkedIn
              </Btn>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="sub" />
      <RevealsRunner id="about" />
    </div>
  );
}
