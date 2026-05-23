import CaseStudyChrome from './CaseStudyChrome.jsx';
import StaggerContainer from '../components/StaggerContainer.jsx';
import { Icons } from '../components/Icons.jsx';
import { LightboxProvider } from '../components/Lightbox.jsx';
import { ImageRow } from '../components/Figures.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import VisualsDisclaimer from '../components/VisualsDisclaimer.jsx';
import JumpToSection from '../components/JumpToSection.jsx';
import CaseStudyNav from '../components/CaseStudyNav.jsx';
import { useWindowSize } from '../hooks.js';
import { sections as SECTIONS } from '../data/sections/directDeposit.js';

const META = [
  { label: 'Role', value: 'Lead designer' },
  { label: 'Timeline', value: '2024 — 2025' },
  { label: 'Team', value: 'PMs + engineering' },
  { label: 'Deadline', value: '6 months' },
];

const IMPACT_STATS = [
  { value: '50%', label: 'fewer clicks to complete setup' },
  { value: '80%+', label: 'fewer usability complaint tickets' },
];

const JUMP_ITEMS = [
  { label: 'The problem', id: 'problem' },
  { label: 'Ideal vs. reality', id: 'reality' },
  { label: 'The solution', id: 'solution' },
  { label: 'The impact', id: 'impact' },
  { label: 'Lessons learned', id: 'lessons' },
];

export default function DirectDepositPage() {
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
            Direct Deposit Redesign
          </h1>
          <p style={{ fontSize: 'clamp(19px, 3vw, 25px)', fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: '24px' }}>
            Rebuilding how millions of people set up where their paycheck lands.
          </p>
          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
            Direct Deposit is the one feature every employee on the platform depends on to get paid — so when the setup experience is clunky, the fallout is real: misrouted pay, missing checks, and frustrated people on the phone with their bosses. I led the redesign that fixed it, against a hard, legally binding six-month deadline.
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

          <VisualsDisclaimer />

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
                if (b.type === 'question') return <p key={i} style={question}>{b.text}</p>;
                return <p key={i} style={para}>{b.text}</p>;
              })}
              <hr style={rule} />
            </section>
          ))}

          {/* IMPACT */}
          <section id="impact" style={{ scrollMarginTop: '90px' }}>
            <StaggerContainer>
              <h2 style={h2}>The impact</h2>
              <p style={para}>The redesign paid off where it mattered most — in fewer errors, fewer frustrated calls, and a lot more confidence.</p>
            </StaggerContainer>
            <StatsGrid stats={IMPACT_STATS} isMobile={isMobile} />
            <p style={{ ...para, marginBottom: 0 }}>
              Usability complaints about Direct Deposit fell by more than 80%, customer service calls dropped, and people gained real confidence in managing where their pay lands — earning back trust in the brand and a long tail of business benefit that&rsquo;s hard to put a single number on.
            </p>
          </section>

          <hr style={rule} />

          {/* LESSONS */}
          <section id="lessons" style={{ scrollMarginTop: '90px' }}>
            <StaggerContainer>
              <h2 style={h2}>Lessons learned</h2>
              <p style={para}>
                This project was one long exercise in adaptability — a game of compromise and empathy. Industry best practices give you a strong foundation, but real-world constraints (technical, legal, business) demand creative problem-solving. Working shoulder to shoulder with cross-functional teams, I balanced what users needed against what the organization could actually ship, and delivered a redesign that made a core, high-stakes experience meaningfully more accurate and efficient for millions of people.
              </p>
              <p style={{ ...para, marginBottom: 0 }}>
                We tackled the most pressing problems inside the six months; from here, the roadmap includes deeper automation of account verification, clearer visibility into the process, and budgeting tools — refined by how people actually use it.
              </p>
            </StaggerContainer>
          </section>

          <CaseStudyNav currentId="direct-deposit" />

        </article>
      </LightboxProvider>
    </CaseStudyChrome>
  );
}
