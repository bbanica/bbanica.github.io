import { useState } from 'react';
import { Icons } from '../components/Icons.jsx';
import TiltCard from '../components/TiltCard.jsx';
import StaggerContainer from '../components/StaggerContainer.jsx';
import { useWindowSize } from '../hooks.js';
import { projects } from '../data/portfolio.js';

// Card thumbnail: shows the project's image filling the cover (object-fit: cover,
// so it's never squished or stretched), or a labeled placeholder until one exists.
function ProjectCover({ src, title }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`${title} thumbnail`}
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    );
  }
  const name = src ? src.split('/').pop() : 'thumbnail.png';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', height: '100%', background: 'linear-gradient(135deg, #FAFBFE 0%, #E8EEFF 100%)', color: 'var(--color-text-tertiary)' }}>
      <Icons.Image />
      <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em' }}>THUMBNAIL</span>
      <span style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: '11px', opacity: 0.75 }}>{name}</span>
    </div>
  );
}

export default function ProjectsSection() {
  const { width } = useWindowSize();
  const isGrid = width >= 900;          // three-up grid, vertical cards
  const horizontal = !isGrid && width >= 520; // medium: thumbnail to the left of the title
  const compact = width < 900;

  // The thumbnail keeps a steady 16:10 ratio when stacked on top; when it sits to
  // the left (medium widths) it fills a fixed-width column so it never goes "long".
  const mediaStyle = horizontal
    ? { width: 'clamp(150px, 34%, 230px)', alignSelf: 'stretch' }
    : { width: '100%', aspectRatio: '16 / 10' };

  return (
    <section id="work-section" style={{ padding: compact ? '48px 20px' : '64px 24px', maxWidth: '1000px', margin: '0 auto', scrollMarginTop: '90px' }}>
      <div style={{ marginBottom: compact ? '32px' : '48px' }}>
        <StaggerContainer>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 600, marginBottom: '12px' }}>Selected Projects</h2>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', maxWidth: '500px' }}>
            A collection of work I'm particularly proud of, spanning product design, design systems, and creative technology.
          </p>
        </StaggerContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isGrid ? 'repeat(3, 1fr)' : '1fr', gap: '20px' }}>
        {projects.map((project) => (
          <TiltCard
            key={project.id}
            style={{ cursor: project.link ? 'pointer' : 'default' }}
            intensity={6}
            onClick={project.link ? () => window.location.href = project.link : undefined}
          >
            <div style={{ display: 'flex', flexDirection: horizontal ? 'row' : 'column', height: '100%' }}>
              <div style={{
                ...mediaStyle,
                flexShrink: 0,
                background: project.comingSoon
                  ? 'linear-gradient(135deg, var(--color-bg) 0%, rgba(37, 99, 235, 0.05) 100%)'
                  : 'var(--color-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {project.comingSoon ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: 'var(--color-text-tertiary)'
                  }}>
                    <Icons.Clock />
                    <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>COMING SOON</span>
                  </div>
                ) : (
                  <ProjectCover src={project.image} title={project.title} />
                )}
                {/* heavy vignette to make mostly-white thumbnails pop within the card */}
                <div aria-hidden style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'radial-gradient(125% 125% at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.58) 100%)',
                  boxShadow: 'inset 0 0 1px rgba(0,0,0,0.25)'
                }} />
              </div>
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{project.subtitle}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{project.year}</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>{project.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  {project.tags.map(tag => (
                    <span key={tag} style={{ padding: '4px 8px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 500, color: project.comingSoon ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
