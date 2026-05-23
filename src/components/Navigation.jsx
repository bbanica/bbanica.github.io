import { useState, useEffect } from 'react';
import { Icons } from './Icons.jsx';
import { useNavigation } from '../context/NavigationContext.jsx';
import { useWindowSize, useIsMac } from '../hooks.js';

export default function Navigation({ openSpotlight, heroHeight }) {
  const { currentSection, navigateTo } = useNavigation();
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero] = useState(true);
  const { width } = useWindowSize();
  const isMac = useIsMac();

  const showLabels = width >= 768;
  const showShortcut = width >= 640;
  const navBottom = 72;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const heroBottom = heroHeight - window.scrollY;
      setOnHero(heroBottom > navBottom);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [heroHeight]);

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
    bg: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
    border: 'rgba(0, 0, 0, 0.06)',
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
    <nav style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
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
      </div>
    </nav>
  );
}
