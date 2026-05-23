import { useState, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { NavigationContext } from '../context/NavigationContext.jsx';
import Navigation from '../components/Navigation.jsx';
import Spotlight from '../components/Spotlight.jsx';
import Footer from '../components/Footer.jsx';
import { useKeyboardShortcut } from '../hooks.js';
import { consumePendingHighlight } from '../lib/highlight.js';

// Shared page chrome for any case study: the floating nav (whose items send you
// back to the home page + its sections), Cmd/Ctrl+K spotlight, and the footer.
// `heroHeight` controls when the nav switches from its blue (over-shader) theme
// to its white theme — pass the header band's height, or 0 for a light page.
export default function CaseStudyChrome({ heroHeight = 0, children }) {
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  const navigateTo = useCallback((section) => {
    window.location.href = section === 'home' ? '/' : `/#${section}`;
  }, []);

  const openSpotlight = useCallback(() => { flushSync(() => setSpotlightOpen(true)); }, []);
  const toggleSpotlight = useCallback(() => setSpotlightOpen(prev => !prev), []);
  useKeyboardShortcut('k', toggleSpotlight, ['meta']);
  useKeyboardShortcut('k', toggleSpotlight, ['ctrl']);

  // Arriving via a deep link: a pending search highlight wins; otherwise scroll
  // to the #section in the hash.
  useEffect(() => {
    if (consumePendingHighlight()) return;
    const id = window.location.hash.replace('#', '');
    if (!id) return;
    const t = setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <NavigationContext.Provider value={{ currentSection: null, navigateTo }}>
      <Navigation openSpotlight={openSpotlight} heroHeight={heroHeight} />
      <Spotlight isOpen={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
      {children}
      <Footer shaderKey={0} />
    </NavigationContext.Provider>
  );
}
