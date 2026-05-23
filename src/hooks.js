import { useState, useEffect, useRef } from 'react';

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
