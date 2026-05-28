import { useState, useEffect } from 'react';
import { Icons } from './Icons.jsx';
import { useNavigation } from '../context/NavigationContext.jsx';
import { useWindowSize, useIsMac } from '../hooks.js';
import { track } from '../lib/events.js';

export default function Navigation({ openSpotlight, heroHeight }) {
  const { currentSection, navigateTo } = useNavigation();
  const [scrolled, setScrolled] = useState(false);
  // Only pages with a shader hero (heroHeight > 0) ever use the blue "on hero"
  // theme. Case studies pass heroHeight 0 and must always stay on the white theme.
  const [onHero, setOnHero] = useState(heroHeight > 0);
  const { width } = useWindowSize();
  const isMac = useIsMac();

  // Manual light/dark toggle. Light is the default; dark is opt-in and persisted
  // in localStorage. The actual switch is the data-theme attribute on <html>,
  // which an inline script in the page <head> applies before paint (no flash).
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark'
  );
  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      const root = document.documentElement;
      if (next) root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch { /* ignore */ }
      track('theme_toggle', { mode: next ? 'dark' : 'light' });
      return next;
    });
  };

  const showLabels = width >= 768;
  const showShortcut = width >= 640;
  const navBottom = 72;
  // Move the nav to the bottom of the viewport at the mobile breakpoint for easier
  // thumb-reach. Same pill, same padding — just anchored to the bottom instead of
  // the top. (Top everywhere else.)
  const navAtBottom = width < 768;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const heroBottom = heroHeight - window.scrollY;
      // The threshold is the y-coordinate of the nav's far edge. Top nav: 20+52 = 72.
      // Bottom nav (mobile): the nav sits at viewport bottom − 20, so its TOP edge is
      // at innerHeight − 72. Using innerHeight − 72 here means the theme flips when
      // the hero's bottom passes the top edge of the bottom pill — visually the same
      // moment the pill stops sitting over the shader.
      const navEdge = navAtBottom ? window.innerHeight - navBottom : navBottom;
      // heroHeight > 0 guard: on case studies (heroHeight 0) an overscroll/pull-to-
      // refresh makes scrollY negative, which would otherwise flip the nav to blue.
      let onShader = heroHeight > 0 && heroBottom > navEdge;
      // Mobile bottom nav also passes over the FOOTER shader near the page end —
      // the footer uses the same gradient as the hero, so the pill should swap back
      // to its blue theme the moment they overlap. Works on every page (home + case
      // studies) since the footer is shared. Desktop never overlaps, so it's gated
      // to navAtBottom.
      if (navAtBottom) {
        const footer = document.querySelector('footer');
        if (footer) {
          const footerTopInViewport = footer.getBoundingClientRect().top;
          if (footerTopInViewport <= window.innerHeight - navBottom) onShader = true;
        }
      }
      setOnHero(onShader);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    // Recompute on resize so the threshold tracks innerHeight changes (address bar
    // showing/hiding, rotation, etc.).
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [heroHeight, navAtBottom]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Icons.Home },
    { id: 'work', label: 'Work', icon: Icons.Folder },
    { id: 'experience', label: 'Experience', icon: Icons.Briefcase },
    { id: 'about', label: 'About', icon: Icons.User },
  ];

  const blueTheme = {
    bg: scrolled ? 'rgba(30, 80, 180, 0.45)' : 'rgba(40, 100, 200, 0.35)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.25)' : '0 4px 20px rgba(0, 0, 0, 0.2)',
    text: 'rgba(255, 255, 255, 0.8)',
    textActive: 'white',
    bgActive: 'rgba(255, 255, 255, 0.2)',
    searchBg: 'rgba(255, 255, 255, 0.15)',
    searchBorder: 'rgba(255, 255, 255, 0.2)',
    kbdBg: 'rgba(255, 255, 255, 0.15)',
    kbdText: 'rgba(255, 255, 255, 0.8)',
    kbdBorder: 'rgba(255, 255, 255, 0.15)',
  };

  const whiteTheme = {
    bg: scrolled ? 'var(--nav-glass-scrolled)' : 'var(--nav-glass)',
    border: 'var(--color-border)',
    shadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
    text: 'var(--color-text-secondary)',
    textActive: 'var(--color-primary)',
    bgActive: 'rgba(37, 99, 235, 0.1)',
    searchBg: 'var(--color-bg)',
    searchBorder: 'var(--color-border)',
    kbdBg: 'var(--color-bg-elevated)',
    kbdText: 'var(--color-text-tertiary)',
    kbdBorder: 'var(--color-border)',
  };

  const theme = onHero ? blueTheme : whiteTheme;

  return (
    // position: sticky (not fixed) so the browser composites the nav on the scroll
    // layer and tracks its offset natively during scrolling — this sidesteps the iOS
    // Safari bug where a position:fixed element (especially with backdrop-filter)
    // detaches and scrolls away mid-gesture. The wrapper is zero-height with
    // pointer-events:none so the pill floats over content without taking flow space
    // or blocking scroll/taps; the nav re-enables pointer events. No transform on the
    // wrapper — it would break sticky and become the lightbox's containing block.
    <div style={{
      // Desktop: sticky to the top (as before). Mobile: position:fixed at the bottom
      // — sticky-bottom only catches elements that would otherwise scroll below the
      // threshold, so it can't pull an element at the top of the tree down to the
      // viewport bottom. Bottom-fixed is also reliable on iOS (the earlier flicker
      // was a top-fixed + address-bar interaction), and translateZ + will-change
      // promote the fixed pill onto its own GPU layer to harden against any stray
      // scroll-time repaints.
      ...(navAtBottom
        ? {
            position: 'fixed', bottom: '20px', left: 0, right: 0,
            transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)',
            willChange: 'transform',
          }
        : { position: 'sticky', top: '20px' }
      ),
      zIndex: 1000, height: 0,
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      pointerEvents: 'none'
    }}>
      {/* On mobile the wrapper is pinned at viewport bottom; translateY(-100%) renders
          the pill ABOVE the pin so it sits at the bottom edge instead of overflowing
          offscreen below. translateZ(0) is the same GPU-layer hint, applied to the
          nav itself for the scroll-time stability the wrapper benefits from. */}
      <nav style={{
        pointerEvents: 'auto',
        ...(navAtBottom ? {
          transform: 'translateY(-100%) translateZ(0)',
          WebkitTransform: 'translateY(-100%) translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
        } : {})
      }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '4px', padding: '8px',
        background: theme.bg,
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius)', border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow,
        transition: 'all 0.3s ease',
        height: '52px'
      }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: showLabels ? '6px' : '0px',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 500,
              color: currentSection === item.id ? theme.textActive : theme.text,
              background: currentSection === item.id ? theme.bgActive : 'transparent',
              transition: 'all 0.3s ease', border: 'none', cursor: 'pointer',
              overflow: 'hidden'
            }}
          >
            <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}><item.icon /></span>
            <span style={{
              display: 'block',
              width: showLabels ? 'auto' : '0px',
              opacity: showLabels ? 1 : 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              transition: 'width 0.3s ease, opacity 0.3s ease'
            }}>{item.label}</span>
          </button>
        ))}
        <button
          onClick={openSpotlight}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: showShortcut ? '8px' : '0px',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 500,
            color: theme.text,
            background: theme.searchBg, border: `1px solid ${theme.searchBorder}`,
            marginLeft: '4px', cursor: 'pointer',
            transition: 'all 0.3s ease',
            overflow: 'hidden'
          }}
        >
          <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}><Icons.Search /></span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: showShortcut ? '2px 6px' : '0px',
            background: theme.kbdBg,
            borderRadius: '6px', fontSize: '12px',
            color: theme.kbdText,
            border: showShortcut ? `1px solid ${theme.kbdBorder}` : 'none',
            width: showShortcut ? 'auto' : '0px',
            opacity: showShortcut ? 1 : 0,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'width 0.3s ease, opacity 0.3s ease, padding 0.3s ease'
          }}>
            {isMac ? '⌘' : 'Ctrl'} K
          </span>
        </button>
        {/* divider sets the theme toggle apart from the nav/search actions */}
        <div style={{ width: '1px', height: '24px', flexShrink: 0, margin: '0 4px', background: theme.border }} />
        <button
          onClick={toggleTheme}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            color: theme.text, background: 'transparent', border: 'none', cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{dark ? <Icons.Sun /> : <Icons.Moon />}</span>
        </button>
      </div>
      </nav>
    </div>
  );
}
