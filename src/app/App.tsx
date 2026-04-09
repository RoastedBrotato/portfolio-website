import { useEffect } from "react";
import Lenis from "lenis";
import { Nav } from "../components/Nav/Nav";
import { Marquee } from "../components/Marquee/Marquee";
import { Hero } from "../sections/Hero/Hero";
import { About } from "../sections/About/About";
import { Projects } from "../sections/Projects/Projects";
import { PuzzleSystem } from "../sections/PuzzleSystem/PuzzleSystem";
import { Skills } from "../sections/Skills/Skills";
import { Experience } from "../sections/Experience/Experience";
import { Contact } from "../sections/Contact/Contact";
import { useTheme } from "../hooks/useTheme";
import { useReveal } from "../hooks/useReveal";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
    let raf: number;
    const tick = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [reduceMotion]);

  useReveal(reduceMotion);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Nav theme={theme} toggleTheme={toggleTheme} />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <PuzzleSystem />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
