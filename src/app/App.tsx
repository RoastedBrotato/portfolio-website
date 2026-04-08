import { Nav } from "../components/Nav/Nav";
import { Hero } from "../sections/Hero/Hero";
import { About } from "../sections/About/About";
import { Projects } from "../sections/Projects/Projects";
import { PuzzleSystem } from "../sections/PuzzleSystem/PuzzleSystem";
import { Showcase } from "../sections/Showcase/Showcase";
import { Skills } from "../sections/Skills/Skills";
import { Experience } from "../sections/Experience/Experience";
import { Contact } from "../sections/Contact/Contact";

export default function App() {
  return (
    <div className="site-shell">
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <PuzzleSystem />
        <Showcase />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
