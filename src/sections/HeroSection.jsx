import { useRef, useEffect } from 'react';
import { Icons } from '../components/Icons.jsx';
import ShaderCanvas from '../components/ShaderCanvas.jsx';
import ContactButton from '../components/ContactButton.jsx';
import { useNavigation } from '../context/NavigationContext.jsx';
import { useWindowSize } from '../hooks.js';
import { HERO_FRAGMENT } from '../shaders.js';

export default function HeroSection({ shaderKey, onHeightChange }) {
  const { navigateTo } = useNavigation();
  const containerRef = useRef(null);
  const { width, height } = useWindowSize();
  const stackButtons = width < 500;

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current && onHeightChange) {
        onHeightChange(containerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [onHeightChange, height]);

  return (
    <section ref={containerRef} style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ShaderCanvas containerRef={containerRef} fragmentShader={HERO_FRAGMENT} shaderKey={shaderKey} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: '800px' }}>
        <h1 style={{
          fontSize: 'clamp(40px, 7.2vw, 63px)',
          fontWeight: 400,
          color: 'white',
          marginBottom: '-4px',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.02em'
        }}>
          dan banica
        </h1>
        <p style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          color: 'rgba(255,255,255,0.95)',
          marginBottom: '6px',
          fontWeight: 600,
          fontStyle: 'italic'
        }}>
          lead product designer&nbsp; <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{
              position: 'absolute',
              inset: '0px -3px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              transform: 'skewX(-10deg)',
              transition: 'all 0.2s ease',
              zIndex: 0
            }} className="employer-highlight" />
            <span
              style={{
                color: 'inherit',
                position: 'relative',
                zIndex: 1,
                padding: '0 2px'
              }}
              onMouseEnter={e => {
                const highlight = e.currentTarget.previousSibling;
                if (highlight) highlight.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={e => {
                const highlight = e.currentTarget.previousSibling;
                if (highlight) highlight.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >@ a fintech giant</span>
          </span>
        </p>
        <p style={{
          fontSize: 'clamp(15px, 2.2vw, 18px)',
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '48px',
          fontWeight: 400
        }}>
          i build things and systems people want to keep using.
        </p>

        <div style={{ display: 'flex', flexDirection: stackButtons ? 'column' : 'row', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={() => navigateTo('work')}
            style={{ padding: '16px 40px', borderRadius: 'var(--radius)', fontSize: '16px', fontWeight: 600, background: 'white', color: 'var(--color-primary)', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', width: stackButtons ? '100%' : 'auto', maxWidth: '280px' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            View Work
          </button>
        </div>
      </div>

      <ContactButton
        style={{ position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
        baseColor="rgba(255,255,255,0.8)"
        hoverColor="white"
        fontSize={15}
      />
    </section>
  );
}
