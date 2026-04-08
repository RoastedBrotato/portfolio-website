import { Nav } from "../components/Nav/Nav";
import { Marquee } from "../components/Marquee/Marquee";
import { Hero } from "../sections/Hero/Hero";
import { About } from "../sections/About/About";
import { Projects } from "../sections/Projects/Projects";
import { PuzzleSystem } from "../sections/PuzzleSystem/PuzzleSystem";
import { Showcase } from "../sections/Showcase/Showcase";
import { Skills } from "../sections/Skills/Skills";
import { Experience } from "../sections/Experience/Experience";
import { Contact } from "../sections/Contact/Contact";
import { useTheme } from "../hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="site-shell">
      <Nav theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Marquee />
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
