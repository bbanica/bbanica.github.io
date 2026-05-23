import { useRef } from 'react';
import { Icons } from './Icons.jsx';
import ShaderCanvas from './ShaderCanvas.jsx';
import ContactButton from './ContactButton.jsx';
import { useWindowSize } from '../hooks.js';
import { portfolioData } from '../data/portfolio.js';
import { FOOTER_FRAGMENT } from '../shaders.js';

export default function Footer({ shaderKey }) {
  const containerRef = useRef(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const currentYear = new Date().getFullYear();

  return (
    <footer ref={containerRef} style={{ padding: isMobile ? '56px 20px 36px' : '72px 24px 44px', position: 'relative', overflow: 'hidden' }}>
      <ShaderCanvas containerRef={containerRef} fragmentShader={FOOTER_FRAGMENT} shaderKey={shaderKey} />

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h3 style={{ fontSize: 'clamp(26px, 5vw, 38px)', fontWeight: 600, color: 'white', marginBottom: '24px' }}>
            Let's chat
          </h3>
          <ContactButton baseColor="rgba(255,255,255,0.9)" hoverColor="white" fontSize={16} display="inline-flex" />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '28px', marginTop: '22px', flexWrap: 'wrap' }}>
            <a
              href="https://www.linkedin.com/in/bbanica-wa/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.85)', fontSize: '15px', fontWeight: 500, transition: 'color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
            >
              <Icons.LinkedIn /> LinkedIn
            </a>
            <a
              href="/dan-banica-resume.pdf"
              download
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.85)', fontSize: '15px', fontWeight: 500, transition: 'color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
            >
              <Icons.Download /> Résumé
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '13px', color: 'rgba(255,255,255,0.6)', flexWrap: 'wrap', gap: '14px' }}>
          <span>© {currentYear} Dan Banica</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icons.MapPin />
            <span>{portfolioData.personal.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
