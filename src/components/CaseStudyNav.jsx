import { Icons } from './Icons.jsx';

// Ordered list of live case studies, used to compute "next". (opendream is a
// coming-soon placeholder, so it's intentionally excluded from the rotation.)
const ORDER = [
  { id: 'arcturus', title: 'Arcturus Design System', path: '/arcturus/' },
  { id: 'oklahoma-navigate', title: 'Oklahoma Navigate', path: '/oklahoma-navigate/' },
  { id: 'direct-deposit', title: 'Direct Deposit Redesign', path: '/direct-deposit/' },
];

const linkStyle = { display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', fontSize: '15px', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.15s ease' };

// Footer navigation shown below the conclusion of every case study: back to the
// home page, or on to the next case study. Styled like the top "All work" link.
export default function CaseStudyNav({ currentId }) {
  const idx = ORDER.findIndex(c => c.id === currentId);
  const next = ORDER[(idx + 1) % ORDER.length];

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', marginTop: '48px', paddingTop: '28px' }}>
      <button
        onClick={() => { window.location.href = '/'; }}
        style={linkStyle}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
      >
        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}><Icons.ArrowRight /></span>
        Back home
      </button>

      {next && (
        <button
          onClick={() => { window.location.href = next.path; }}
          style={{ ...linkStyle }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
        >
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.25 }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Next case study</span>
            <span style={{ color: 'inherit', fontWeight: 600 }}>{next.title}</span>
          </span>
          <Icons.ArrowRight />
        </button>
      )}
    </nav>
  );
}
