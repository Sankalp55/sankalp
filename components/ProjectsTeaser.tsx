import ProjectArticle from "./ProjectArticle";
import Btn from "./Btn";

export default function ProjectsTeaser() {
  return (
    <section className="shell section-pad" id="projects-teaser" data-screen-label="Selected work">
      <div className="exp-head">
        <h2 className="big-head" data-split>
          Selected <em>work.</em>
        </h2>
        <Btn arrow strength={0.4} cursor="All" href="/projects" wipe="WORK">
          All projects
        </Btn>
      </div>

      <div className="proj-list">
        <ProjectArticle
          teaser
          index="(01)"
          phLabel="PULSE — live"
          name="PULSE"
          meta="Gen Z Drink Drop Site · 2026"
          blurb="A fictional functional energy drink brand. A cinematic single page commerce experience — pinned hero, scroll driven flavor flythrough, full cart and a real 3 step checkout. Wired to Supabase for auth, orders and the mailing list."
          stack={["Next.js", "TypeScript", "Framer Motion", "GSAP", "Lenis", "Zustand", "Supabase"]}
          embedUrl="https://pulse-beta-self.vercel.app"
          embedHost="pulse-beta-self.vercel.app"
        />
        <ProjectArticle
          teaser
          flip
          index="(02)"
          phLabel="WSA — screenshot"
          name={
            <>
              <span className="outline">SAFETY</span> ANALYTICS
            </>
          }
          meta="Geospatial Crime Data System · 2025"
          blurb="A geospatial system that turns crime data into actionable safety insight for women — mapping risk across space and time with a Python data pipeline."
          stack={["Python", "Pandas", "NumPy", "OpenCV"]}
        />
      </div>
    </section>
  );
}
