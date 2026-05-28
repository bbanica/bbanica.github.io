import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Icons } from './Icons.jsx';
import { useNavigation } from '../context/NavigationContext.jsx';
import { portfolioData } from '../data/portfolio.js';
import { searchSite } from '../data/searchIndex.js';
import { scrollAndHighlight, requestHighlight } from '../lib/highlight.js';
import { useScrollLock } from '../hooks.js';
import { track } from '../lib/events.js';

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
  const [shown, setShown] = useState(false);   // drives the open/close animation
  const [closing, setClosing] = useState(false);
  const wasOpen = useRef(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useScrollLock(isOpen);

  const trimmed = query.trim();
  const results = trimmed ? searchSite(trimmed) : [];
  const items = trimmed ? results : NAV_ACTIONS;

  // Open/close lifecycle. Mounting is derived directly from `isOpen` (not from a
  // state set in an effect) so that when the trigger opens us via flushSync, the
  // input is in the DOM immediately and can be focused within the tap gesture.
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      wasOpen.current = true;
      setQuery('');
      setSelectedIndex(0);
      setClosing(false);
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    if (!isOpen && wasOpen.current) {
      wasOpen.current = false;
      setShown(false);
      setClosing(true);
      const t = setTimeout(() => setClosing(false), 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Focus synchronously when opening — critical for the mobile keyboard to appear.
  useLayoutEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    if (resultsRef.current && items.length > 0 && selectedIndex < items.length) {
      resultsRef.current.children[selectedIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex, items.length]);

  const execute = (item) => {
    if (trimmed) track('search_select', { search_term: trimmed });
    if (item.type === 'navigation') {
      navigateTo(item.id);
    } else if (item.type === 'action') {
      if (item.id === 'email') window.location.href = `mailto:${portfolioData.personal.email}`;
    } else {
      const here = window.location.pathname.replace(/\/+$/, '') || '/';
      const there = item.path.replace(/\/+$/, '') || '/';
      if (here === there) {
        onClose();
        setTimeout(() => scrollAndHighlight(trimmed, item.needle, item.anchor), 220);
        return;
      }
      requestHighlight(item.path, trimmed, item.needle, item.anchor);
      window.location.href = item.path + (item.anchor ? `#${item.anchor}` : '');
      return;
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (items[selectedIndex]) execute(items[selectedIndex]); }
    else if (e.key === 'Escape') { onClose(); }
  };

  if (!isOpen && !closing) return null;

  return (
    <div
      className="overlay-fill"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12svh', opacity: shown ? 1 : 0, transition: 'opacity 0.2s ease' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: '580px', margin: '0 20px', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl), 0 0 0 1px rgba(0,0,0,0.05)', overflow: 'hidden', transform: shown ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)', transition: 'transform 0.2s cubic-bezier(0.32, 0.72, 0, 1)' }}
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
