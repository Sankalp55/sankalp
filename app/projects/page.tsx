import Btn from "@/components/Btn";
import ProjectArticle from "@/components/ProjectArticle";
import Footer from "@/components/Footer";
import RevealsRunner from "@/components/RevealsRunner";

export default function ProjectsPage() {
  return (
    <div data-screen-label="Projects view">
      <section
        className="shell"
        style={{ paddingTop: "clamp(140px, 18vh, 240px)" }}
        data-screen-label="Projects header"
      >
        <div data-reveal>
          <div className="reveal-line">
            <span className="kicker">02 — Projects</span>
          </div>
        </div>
        <h1 className="big-head" data-split>
          Things I have <em>made.</em>
        </h1>
      </section>

      <section className="shell section-pad">
        <div className="proj-list">
          <ProjectArticle
            index="(01)"
            phLabel="PULSE — live"
            name="PULSE"
            meta="Gen Z Drink Drop Site · 2026"
            blurb="PULSE is a fictional Gen Z functional energy drink brand told as a single long scroll story. A pinned cinematic hero, JS lerped color flood per flavor, a 400vh pinned product flythrough, a working cart drawer and a fully inline 3 step checkout. Auth, orders and the mailing list are wired to Supabase with row level security."
            stack={["Next.js", "TypeScript", "Framer Motion", "GSAP", "Lenis", "Zustand", "Supabase"]}
            embedUrl="http://localhost:3000"
            embedHost="pulse.local"
            liveUrl="http://localhost:3000"
            detailCta
          />
          <ProjectArticle
            flip
            index="(02)"
            phLabel="WSA — screenshot"
            name={
              <>
                <span className="outline">WOMEN&apos;S</span> SAFETY ANALYTICS
              </>
            }
            meta="Geospatial Crime Data System · 2025"
            blurb="A geospatial analytics system that reads crime data and maps risk for women across space and time. A Python pipeline cleans and models the data with Pandas and NumPy, while OpenCV powers the visual processing layer that turns raw numbers into readable maps."
            stack={["Python", "Pandas", "NumPy", "OpenCV"]}
            detailCta
          />
        </div>
      </section>

      <section className="shell section-pad" style={{ textAlign: "center" }}>
        <h2 className="big-head" data-split style={{ marginInline: "auto" }}>
          Want the <em>full</em> story?
        </h2>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Btn solid strength={0.4} cursor="Talk" href="/" wipe="HOME" anchor="#contact">
            Get in touch
          </Btn>
          <Btn arrow strength={0.4} cursor="About" href="/about" wipe="ABOUT">
            More about me
          </Btn>
        </div>
      </section>

      <Footer variant="sub" />
      <RevealsRunner id="projects" />
    </div>
  );
}
