import { useState } from 'react';
import { Icons } from '../components/Icons.jsx';
import StaggerContainer from '../components/StaggerContainer.jsx';
import { useWindowSize } from '../hooks.js';
import { portfolioData } from '../data/portfolio.js';

// Square logo well with graceful fallback. Drop a PNG at the path in
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
  const logoSize = isMobile ? 48 : 56;

  return (
    <section id="experience-section" style={{ padding: isMobile ? '48px 20px' : '64px 24px', maxWidth: '1000px', margin: '0 auto', scrollMarginTop: '90px' }}>
      <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
        <StaggerContainer>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 600 }}>Where I've Worked</h2>
        </StaggerContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {portfolioData.experience.map((exp, i) => {
          const multi = exp.roles.length > 1;
          return (
            <div
              key={`${exp.company}-${i}`}
              style={{
                display: 'flex', gap: isMobile ? '14px' : '18px',
                padding: isMobile ? '18px 16px' : '22px 24px',
                background: 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border)'
              }}
            >
              <CompanyLogo src={exp.logo} alt={`${exp.company} logo`} size={logoSize} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Company name + overall span — shown once per company, then the roles
                    list underneath. */}
                <h3 style={{ fontSize: isMobile ? '16.5px' : '18px', fontWeight: 700, lineHeight: 1.25 }}>{exp.company}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>{exp.period}</p>

                {/* Roles. For multi-role companies (Paycom) each role gets its own period
                    and a hairline divider between them. For single-role companies the
                    period would just repeat the company's, so it's hidden. */}
                <div style={{ marginTop: isMobile ? '14px' : '16px', display: 'flex', flexDirection: 'column' }}>
                  {exp.roles.map((r, j) => (
                    <div
                      key={`${r.role}-${j}`}
                      style={{
                        paddingTop: j === 0 ? 0 : (isMobile ? '14px' : '16px'),
                        paddingBottom: j < exp.roles.length - 1 ? (isMobile ? '14px' : '16px') : 0,
                        borderBottom: j < exp.roles.length - 1 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: isMobile ? '14.5px' : '15px', fontWeight: 600, color: 'var(--color-text)' }}>{r.role}</div>
                      {multi && (
                        <div style={{ fontSize: '12.5px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>{r.period}</div>
                      )}
                      {r.sub && (
                        <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>{r.sub}</p>
                      )}
                      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginTop: '8px' }}>{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
