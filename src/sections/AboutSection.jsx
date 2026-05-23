import { useState } from 'react';
import { Icons } from '../components/Icons.jsx';
import StaggerContainer from '../components/StaggerContainer.jsx';
import { useWindowSize } from '../hooks.js';
import { portfolioData } from '../data/portfolio.js';

export default function AboutSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <section id="about-section" style={{ padding: isMobile ? '48px 20px' : '64px 24px', maxWidth: '1000px', margin: '0 auto', scrollMarginTop: '90px' }}>
      <div style={{ marginBottom: isMobile ? '32px' : '40px' }}>
        <StaggerContainer>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 600 }}>
            Designer, developer, and perpetual learner
          </h2>
        </StaggerContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {portfolioData.about.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.title} data-accordion-item data-open={isOpen} style={{ background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <button data-accordion-toggle onClick={() => setOpenIndex(isOpen ? -1 : index)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', textAlign: 'left' }}>
                <span>{item.title}</span>
                <div style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)', color: 'var(--color-text-tertiary)' }}>
                  <Icons.ChevronDown />
                </div>
              </button>
              <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s cubic-bezier(0.32, 0.72, 0, 1)' }}>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ padding: '0 18px 18px', fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>{item.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
