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
          phLabel="WIRE — live"
          name="WIRE"
          meta="Visual Workflow Builder · 2026"
          blurb="A visual workflow builder. Drag nodes onto an infinite canvas, connect their ports with cables, hit run, watch the graph light up in topological order. Proves hard product UI — graph manipulation, real time state, drag and drop — without a graph library."
          stack={["Next.js", "TypeScript", "Zustand", "SVG", "Web Audio"]}
          embedUrl="http://localhost:3002"
          embedHost="wire.local"
        />
      </div>
    </section>
  );
}
