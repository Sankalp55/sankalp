import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Experience from "@/components/Experience";
import ProjectsTeaser from "@/components/ProjectsTeaser";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RevealsRunner from "@/components/RevealsRunner";

export default function HomePage() {
  return (
    <main data-screen-label="Home">
      <Hero />
      <Marquee />
      <Experience />
      <ProjectsTeaser />
      <Contact />
      <Footer variant="home" />
      <RevealsRunner id="home" />
    </main>
  );
}
