import CaseStudyChrome from './CaseStudyChrome.jsx';
import StaggerContainer from '../components/StaggerContainer.jsx';
import { Icons } from '../components/Icons.jsx';
import { LightboxProvider } from '../components/Lightbox.jsx';
import { ImageRow } from '../components/Figures.jsx';
import StickyWall from '../components/StickyNotes.jsx';
import JumpToSection from '../components/JumpToSection.jsx';
import CaseStudyNav from '../components/CaseStudyNav.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import VisualsDisclaimer from '../components/VisualsDisclaimer.jsx';
import { useWindowSize } from '../hooks.js';
import { sections as SECTIONS, IMG } from '../data/sections/arcturus.js';

const JUMP_ITEMS = [
  { label: 'The initial problem', id: 'problem' },
  { label: 'Designing for the end user', id: 'end-user' },
  { label: 'Low fidelity & inspiration', id: 'low-fidelity' },
  { label: 'Aesthetics as a trust signal', id: 'aesthetics' },
  { label: 'More than a reskin', id: 'reskin' },
  { label: 'Results', id: 'results' },
];

const META = [
  { label: 'Role', value: 'Co-lead designer' },
  { label: 'Timeline', value: '2025 — 2026' },
  { label: 'Team', value: '5 designers + eng' },
  { label: 'Scope', value: 'Company-wide system' },
];

const STATS = [
  { value: '22%', label: 'faster on common employee tasks' },
  { value: '100%', label: 'of pilot users kept a personalized dashboard' },
  { value: '31%', label: 'fewer navigation-related support tickets' },
  { value: '94%', label: 'internal satisfaction score from pilot users' },
];

export default function ArcturusPage() {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const rule = { border: 'none', borderTop: '1px solid var(--color-border)', margin: isMobile ? '30px 0' : '40px 0' };
  const para = { fontSize: '17px', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '16px' };
  const h2 = { fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.01em' };
  const question = { fontSize: 'clamp(19px, 2.6vw, 22px)', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.45, borderLeft: '3px solid var(--color-primary)', paddingLeft: '20px', margin: '0 0 20px' };

  return (
    <CaseStudyChrome heroHeight={0}>
      <LightboxProvider>
        <article style={{ maxWidth: '820px', margin: '0 auto', padding: isMobile ? '108px 20px 56px' : '150px 24px 88px' }}>

          {/* HEADER */}
          <button
            onClick={() => { window.location.href = '/#work'; }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: 500, marginBottom: '24px', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icons.ArrowRight /></span>
            All work
          </button>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.015em', marginBottom: '18px' }}>
            Arcturus Design System
          </h1>
          <p style={{ fontSize: 'clamp(19px, 3vw, 25px)', fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: '24px' }}>
            Rebuilding an enterprise design system around the people who actually use the product.
          </p>
          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: '16px' }}>
            &ldquo;What do you do as an enterprise company when you&rsquo;re losing clients because of how outdated the software looks?&rdquo;
          </p>
          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
            That was the question our executives asked. Over six months, I co-led a team of five designers in rebuilding our company&rsquo;s entire design system — an effort that included a fundamental rearchitecture, designed for the end user.
          </p>

          <hr style={rule} />

          {/* META */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '20px' }}>
            {META.map(m => (
              <div key={m.label}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-tertiary)', marginBottom: '6px' }}>{m.label}</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* JUMP TO SECTION */}
          <div style={{ marginTop: '20px' }}>
            <JumpToSection items={JUMP_ITEMS} />
          </div>

          <hr style={rule} />

          {/* DE-BRANDING DISCLAIMER */}
          <VisualsDisclaimer />

          <ImageRow isMobile={isMobile} items={[{ src: `${IMG}figure-0.png`, label: 'Figure 0.', caption: 'The new Arcturus system.' }]} />

          <hr style={rule} />

          {/* SECTIONS */}
          {SECTIONS.map((section) => (
            <section key={section.n} id={section.id} style={{ marginBottom: isMobile ? '8px' : '16px', scrollMarginTop: '90px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums', marginBottom: '8px' }}>
                {String(section.n).padStart(2, '0')}
              </div>
              <h3 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.01em' }}>{section.title}</h3>
              {section.blocks.map((b, i) => {
                if (b.type === 'figures') return <ImageRow key={i} items={b.items} isMobile={isMobile} />;
                if (b.type === 'stickies') return <StickyWall key={i} notes={b.notes} />;
                if (b.type === 'question') return <p key={i} style={question}>{b.text}</p>;
                return <p key={i} style={para}>{b.text}</p>;
              })}
              <hr style={rule} />
            </section>
          ))}

          {/* OUTCOME */}
          <section id="results" style={{ scrollMarginTop: '90px' }}>
            <StaggerContainer>
              <h2 style={h2}>Early results</h2>
              <p style={para}>
                Arcturus is rolling out through a client pilot program, so the full impact is still ahead of us. But the early numbers from pilot accounts are encouraging:
              </p>
            </StaggerContainer>

            <StatsGrid stats={STATS} isMobile={isMobile} />

            <p style={{ ...para, marginBottom: 0 }}>
              These figures come from a limited pilot, and the broader rollout is still underway — so the complete picture of the project&rsquo;s impact is yet to be seen. Even at this stage, though, the signal is clear: centering the end user and modernizing the system is paying off where it counts.
            </p>
          </section>

          <CaseStudyNav currentId="arcturus" />

        </article>
      </LightboxProvider>
    </CaseStudyChrome>
  );
}
