import { useState, useEffect, useRef } from 'react';

// Locks page scrolling while `active` (e.g. a modal/lightbox is open). Pins the
// body in place — the only reliable cross-browser lock on iOS, where
// `overflow: hidden` alone does nothing — and restores the scroll position on
// release. Does not touch the overlay's own pointer interactions.
export const useScrollLock = (active) => {
  useEffect(() => {
    if (!active) return undefined;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const b = document.body;
    const saved = { position: b.style.position, top: b.style.top, left: b.style.left, right: b.style.right, width: b.style.width, overflow: b.style.overflow };
    b.style.position = 'fixed';
    b.style.top = `-${scrollY}px`;
    b.style.left = '0';
    b.style.right = '0';
    b.style.width = '100%';
    b.style.overflow = 'hidden';
    return () => {
      b.style.position = saved.position;
      b.style.top = saved.top;
      b.style.left = saved.left;
      b.style.right = saved.right;
      b.style.width = saved.width;
      b.style.overflow = saved.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
};

export const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); }
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isInView];
};

export const useKeyboardShortcut = (key, callback, modifiers = []) => {
  useEffect(() => {
    const handler = (e) => {
      const modMatch = modifiers.every(mod => {
        if (mod === 'meta') return e.metaKey;
        if (mod === 'ctrl') return e.ctrlKey;
        return true;
      });
      if (modMatch && e.key.toLowerCase() === key.toLowerCase()) { e.preventDefault(); callback(e); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, modifiers]);
};

export const useIsMac = () => {
  const [isMac, setIsMac] = useState(true);
  useEffect(() => { setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0); }, []);
  return isMac;
};

export const useWindowSize = () => {
  const [size, setSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1200, height: typeof window !== 'undefined' ? window.innerHeight : 800 });
  useEffect(() => {
    const handle = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return size;
};
