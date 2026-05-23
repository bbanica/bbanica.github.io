import CaseStudyChrome from './CaseStudyChrome.jsx';
import StaggerContainer from '../components/StaggerContainer.jsx';
import { Icons } from '../components/Icons.jsx';
import { LightboxProvider } from '../components/Lightbox.jsx';
import { ImageRow } from '../components/Figures.jsx';
import CaseStudyNav from '../components/CaseStudyNav.jsx';
import { useWindowSize } from '../hooks.js';
import { sections as SECTIONS, IMG } from '../data/sections/oklahoma.js';

export default function OklahomaNavigatePage() {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const rule = { border: 'none', borderTop: '1px solid var(--color-border)', margin: isMobile ? '30px 0' : '40px 0' };
  const para = { fontSize: '17px', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: '16px' };
  const h2 = { fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.01em' };

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
            Oklahoma Navigate
          </h1>
          <p style={{ fontSize: 'clamp(19px, 3vw, 25px)', fontStyle: 'italic', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: '24px' }}>
            I was able to complete my tasks, but I saw room for improvement of the platform.
          </p>
          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
            I grew up in Washington. I moved to Oklahoma a few years ago, and as an automotive enthusiast, I used the OK Navigate portal for the first time to register my three vehicles. Here&rsquo;s what I thought.
          </p>

          <hr style={rule} />

          {/* FRAMING */}
          <StaggerContainer>
            <h2 style={h2}>The digital age is still a bit new to us</h2>
            <p style={para}>
              Oklahoma was a late adopter to the online title and registration game. It was also a late adopter to the automated toll booth game. So it makes sense that there&rsquo;s some room for improvement. With that being said, here are some things I&rsquo;d change about the experience I had.
            </p>
          </StaggerContainer>

          <ImageRow isMobile={isMobile} items={[{ src: `${IMG}figure-0.png`, label: 'Figure 0.', caption: 'The OK Navigate portal.' }]} />

          <hr style={rule} />

          {/* CHANGE SECTIONS */}
          {SECTIONS.map((section, idx) => {
            const last = idx === SECTIONS.length - 1;
            return (
              <section key={section.n} style={{ marginBottom: last ? 0 : (isMobile ? '8px' : '16px') }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums', marginBottom: '8px' }}>
                  {String(section.n).padStart(2, '0')}
                </div>
                <h3 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 600, marginBottom: '16px', letterSpacing: '-0.01em' }}>{section.title}</h3>
                {section.blocks.map((b, i) => {
                  if (b.type === 'figures') return <ImageRow key={i} items={b.items} isMobile={isMobile} />;
                  return <p key={i} style={b.muted ? { ...para, color: 'var(--color-text-tertiary)' } : para}>{b.text}</p>;
                })}
                {!last && <hr style={rule} />}
              </section>
            );
          })}

          <hr style={rule} />

          {/* CLOSING */}
          <StaggerContainer>
            <h2 style={h2}>Overall thoughts</h2>
            <p style={{ ...para, marginBottom: 0 }}>
              Navigate got the job done for me, but it could have been easier and more performant. Being logged out multiple times, not knowing where to find information, and having to go through it all 3 times on a slow data connection drove me to want to improve the experience for everyone.
            </p>
          </StaggerContainer>

          <CaseStudyNav currentId="oklahoma-navigate" />

        </article>
      </LightboxProvider>
    </CaseStudyChrome>
  );
}
