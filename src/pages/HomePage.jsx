import { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { NavigationContext } from '../context/NavigationContext.jsx';
import Navigation from '../components/Navigation.jsx';
import Spotlight from '../components/Spotlight.jsx';
import Footer from '../components/Footer.jsx';
import HeroSection from '../sections/HeroSection.jsx';
import ProjectsSection from '../sections/ProjectsSection.jsx';
import ExperienceSection from '../sections/ExperienceSection.jsx';
import AboutSection from '../sections/AboutSection.jsx';
import { useKeyboardShortcut } from '../hooks.js';
import { consumePendingHighlight } from '../lib/highlight.js';

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState('home');
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [shaderKey] = useState(0);
  const [heroHeight, setHeroHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  const navigateTo = useCallback((section) => {
    setCurrentSection(section);
    setIsProgrammaticScroll(true);

    const targetScroll = section === 'home' ? 0 : (document.getElementById(`${section}-section`)?.offsetTop - 100 || 0);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });

    setTimeout(() => setIsProgrammaticScroll(false), 1000);
  }, []);

  // flushSync so the spotlight input mounts + focuses within the tap gesture,
  // which is what lets the mobile keyboard pop up immediately.
  const openSpotlight = useCallback(() => { flushSync(() => setSpotlightOpen(true)); }, []);
  const toggleSpotlight = useCallback(() => setSpotlightOpen(prev => !prev), []);

  useKeyboardShortcut('k', toggleSpotlight, ['meta']);
  useKeyboardShortcut('k', toggleSpotlight, ['ctrl']);

  // Arriving from a case study or search result: a pending search highlight wins;
  // otherwise honor a "#section" hash (accepts both "#work" and "#work-section").
  useEffect(() => {
    if (consumePendingHighlight()) return;
    const h = window.location.hash.replace('#', '');
    if (!h) return;
    setTimeout(() => {
      const el = document.getElementById(h) || document.getElementById(`${h}-section`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll) return;
      const scrollPos = window.scrollY + 200;
      const sections = ['about-section', 'experience-section', 'work-section'];
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section && scrollPos >= section.offsetTop) {
          setCurrentSection(sectionId.replace('-section', ''));
          return;
        }
      }
      setCurrentSection('home');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isProgrammaticScroll]);

  return (
    <NavigationContext.Provider value={{ currentSection, navigateTo }}>
      <Navigation
        openSpotlight={openSpotlight}
        heroHeight={heroHeight}
      />
      <Spotlight
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
      />
      <main>
        <HeroSection shaderKey={shaderKey} onHeightChange={setHeroHeight} />
        <ProjectsSection />
        <ExperienceSection />
        <AboutSection />
      </main>
      <Footer shaderKey={shaderKey} />
    </NavigationContext.Provider>
  );
}
