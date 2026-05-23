import { useState, useEffect, useRef, useCallback } from 'react';
import { Icons } from './Icons.jsx';
import { useNavigation } from '../context/NavigationContext.jsx';
import { portfolioData } from '../data/portfolio.js';
import { searchSite } from '../data/searchIndex.js';
import { scrollAndHighlight, requestHighlight } from '../lib/highlight.js';

const NAV_ACTIONS = [
  { id: 'home', type: 'navigation', title: 'Home', subtitle: 'Go to homepage', icon: Icons.Home },
  { id: 'work', type: 'navigation', title: 'Work', subtitle: 'View projects', icon: Icons.Folder },
  { id: 'experience', type: 'navigation', title: 'Experience', subtitle: 'Work history', icon: Icons.Briefcase },
  { id: 'about', type: 'navigation', title: 'About', subtitle: 'Learn about me', icon: Icons.User },
  { id: 'email', type: 'action', title: 'Send Email', subtitle: portfolioData.personal.email, icon: Icons.Mail },
];

export default function Spotlight({ isOpen, onClose }) {
  const { navigateTo } = useNavigation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [animState, setAnimState] = useState('closed');
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const trimmed = query.trim();
  const results = trimmed ? searchSite(trimmed) : [];
  const items = trimmed ? results : NAV_ACTIONS;

  useEffect(() => {
    if (isOpen && animState === 'closed') {
      setAnimState('opening');
      setTimeout(() => { setAnimState('open'); inputRef.current?.focus(); }, 50);
      setQuery('');
      setSelectedIndex(0);
    } else if (!isOpen && (animState === 'open' || animState === 'opening')) {
      setAnimState('closing');
      setTimeout(() => setAnimState('closed'), 200);
    }
  }, [isOpen, animState]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    if (resultsRef.current && items.length > 0 && selectedIndex < items.length) {
      resultsRef.current.children[selectedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex, items.length]);

  const handleClose = useCallback(() => {
    setAnimState('closing');
    setTimeout(() => { setAnimState('closed'); onClose(); }, 200);
  }, [onClose]);

  const execute = (item) => {
    if (item.type === 'navigation') {
      navigateTo(item.id);
    } else if (item.type === 'action') {
      if (item.id === 'email') window.location.href = `mailto:${portfolioData.personal.email}`;
    } else {
      // search result → jump to the exact word and flash a highlight over it
      const here = window.location.pathname.replace(/\/+$/, '') || '/';
      const there = item.path.replace(/\/+$/, '') || '/';
      if (here === there) {
        handleClose();
        setTimeout(() => scrollAndHighlight(trimmed, item.needle, item.anchor), 220);
        return;
      }
      requestHighlight(item.path, trimmed, item.needle, item.anchor);
      window.location.href = item.path + (item.anchor ? `#${item.anchor}` : '');
      return;
    }
    handleClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (items[selectedIndex]) execute(items[selectedIndex]); }
    else if (e.key === 'Escape') { handleClose(); }
  };

  if (animState === 'closed') return null;
  const isVisible = animState === 'open';

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh', opacity: animState === 'closing' ? 0 : 1, transition: 'opacity 0.2s ease' }}
      onClick={handleClose}
    >
      <div
        style={{ width: '100%', maxWidth: '580px', margin: '0 20px', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl), 0 0 0 1px rgba(0,0,0,0.05)', overflow: 'hidden', transform: animState === 'closing' ? 'translateY(20px) scale(0.98)' : (isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)'), opacity: animState === 'closing' ? 0 : (isVisible ? 1 : 0), transition: 'all 0.2s cubic-bezier(0.32, 0.72, 0, 1)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderBottom: '1px solid var(--color-border)', height: '56px' }}>
          <div style={{ flexShrink: 0, color: 'var(--color-text-secondary)' }}><Icons.Search /></div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search anything across the site…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '16px', fontFamily: 'inherit', background: 'transparent', color: 'var(--color-text)', minWidth: 0, height: '24px' }}
          />
        </div>

        <div style={{ maxHeight: '360px', overflow: 'auto', padding: '8px' }} ref={resultsRef}>
          {items.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
              <p style={{ fontSize: '15px', marginBottom: '4px' }}>No results for &ldquo;{trimmed}&rdquo;</p>
            </div>
          ) : (
            items.map((item, index) => {
              const isSelected = index === selectedIndex;
              const isResult = !item.type;
              return (
                <div
                  key={index}
                  onClick={() => execute(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: isSelected ? 'var(--color-primary)' : 'transparent', color: isSelected ? 'white' : 'inherit', transition: 'all 0.15s ease' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--color-bg)', color: isSelected ? 'white' : 'var(--color-primary)', flexShrink: 0 }}>
                    {isResult ? <Icons.Search /> : <item.icon />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {isResult ? (
                      <>
                        <div style={{ fontSize: '14px', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.before}{item.before ? ' ' : ''}
                          <strong style={{ fontWeight: 700, color: isSelected ? 'white' : 'var(--color-primary)' }}>{item.match}</strong>
                          {item.after ? ' ' : ''}{item.after}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '1px' }}>in {item.page}</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</div>
                        {item.subtitle && <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '1px' }}>{item.subtitle}</div>}
                      </>
                    )}
                  </div>
                  {isSelected && <div style={{ color: 'white', flexShrink: 0 }}><Icons.ArrowRight /></div>}
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderTop: '1px solid var(--color-border)', fontSize: '12px', color: 'var(--color-text-tertiary)', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><kbd style={{ padding: '2px 6px', background: 'var(--color-bg)', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '11px' }}>↑↓</kbd> Navigate</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><kbd style={{ padding: '2px 6px', background: 'var(--color-bg)', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '11px' }}>↵</kbd> Select</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><kbd style={{ padding: '2px 6px', background: 'var(--color-bg)', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '11px' }}>esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
