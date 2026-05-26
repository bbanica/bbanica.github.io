import { useRef, useState, useEffect, useCallback } from 'react';

export default function TiltCard({ children, style, intensity = 10, onClick }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const reset = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  // Reset the tilt whenever the page is shown. Crucial for a bfcache restore via
  // the browser back button (Android Chrome freezes and later restores the skewed
  // state, leaving the card stuck mid-tilt with no mouseleave to clear it). pageshow
  // fires on the initial load and on every back/forward-cache restore.
  useEffect(() => {
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, [reset]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.15 });
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={reset} onPointerCancel={reset} onClick={onClick} style={{ ...style, position: 'relative' }}>
      <div style={{ transform, transition: 'transform 0.15s ease-out', height: '100%', borderRadius: 'var(--radius)', background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', position: 'relative' }}>
        {children}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`, pointerEvents: 'none', borderRadius: 'inherit' }} />
      </div>
    </div>
  );
}
