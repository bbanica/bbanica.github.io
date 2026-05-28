import { useState } from 'react';
import { Icons } from '../components/Icons.jsx';
import StaggerContainer from '../components/StaggerContainer.jsx';
import { useWindowSize } from '../hooks.js';
import { portfolioData } from '../data/portfolio.js';

// Small square logo well with graceful fallback. Drop a PNG at the path in
// portfolio.experience[i].logo (square ~256×256 ideal); if the file is missing
// or fails to load the card falls back to a neutral briefcase glyph so the row
// keeps its layout instead of collapsing.
function CompanyLogo({ src, alt, size }) {
  const [failed, setFailed] = useState(false);
  const has = src && !failed;
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: '10px', overflow: 'hidden',
      border: '1px solid var(--color-border)',
      background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-text-tertiary)'
    }}>
      {has
        ? <img src={src} alt={alt || ''} onError={() => setFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px', display: 'block' }} />
        : <Icons.Briefcase />}
    </div>
  );
}

export default function ExperienceSection() {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const logoSize = isMobile ? 44 : 52;

  return (
    <section id="experience-section" style={{ padding: isMobile ? '48px 20px' : '64px 24px', maxWidth: '1000px', margin: '0 auto', scrollMarginTop: '90px' }}>
      <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
        <StaggerContainer>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 600 }}>Where I've Worked</h2>
        </StaggerContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {portfolioData.experience.map((exp, i) => (
          <div
            key={`${exp.company}-${exp.role}-${i}`}
            style={{
              display: 'flex', gap: isMobile ? '14px' : '18px',
              padding: isMobile ? '16px 16px 18px' : '20px 22px',
              background: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)'
            }}
          >
            <CompanyLogo src={exp.logo} alt={`${exp.company} logo`} size={logoSize} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: isMobile ? '16px' : '17px', fontWeight: 700, lineHeight: 1.25, marginBottom: '2px' }}>{exp.company}</h3>
              <div style={{ fontSize: isMobile ? '13.5px' : '14px', color: 'var(--color-text-secondary)' }}>
                <span style={{ fontWeight: 600 }}>{exp.role}</span>
                <span style={{ color: 'var(--color-text-tertiary)' }}>{' · '}{exp.period}</span>
              </div>
              {exp.sub && (
                <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>{exp.sub}</p>
              )}
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginTop: isMobile ? '8px' : '10px' }}>{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
