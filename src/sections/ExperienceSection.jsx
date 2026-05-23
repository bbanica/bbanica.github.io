import StaggerContainer from '../components/StaggerContainer.jsx';
import { useWindowSize } from '../hooks.js';
import { portfolioData } from '../data/portfolio.js';

export default function ExperienceSection() {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <section id="experience-section" style={{ padding: isMobile ? '48px 20px' : '64px 24px', maxWidth: '1000px', margin: '0 auto', scrollMarginTop: '90px' }}>
      <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
        <StaggerContainer>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 600 }}>Where I've Worked</h2>
        </StaggerContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {portfolioData.experience.map((exp) => (
          <div key={exp.company} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px 20px', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>{exp.period}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '4px' }}>{exp.company}</h3>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{exp.role}</p>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
