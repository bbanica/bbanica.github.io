import { useState } from 'react';
import { Icons } from './Icons.jsx';

// An expandable card (same look/behavior as the home-page About accordion) that
// reveals in-page anchor links. Clicking one smooth-scrolls to that section.
// `items` is [{ label, id }]; each id must match a section's id on the page.
export default function JumpToSection({ items }) {
  const [open, setOpen] = useState(false);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', textAlign: 'left' }}
      >
        <span>Jump to section</span>
        <div style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)', color: 'var(--color-text-tertiary)' }}>
          <Icons.ChevronDown />
        </div>
      </button>
      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s cubic-bezier(0.32, 0.72, 0, 1)' }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: '0 18px 8px' }}>
            {items.map(it => (
              <button
                key={it.id}
                onClick={() => jump(it.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '11px 0', background: 'none', border: 'none', borderTop: '1px solid var(--color-border)', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)', transition: 'color 0.15s ease' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
              >
                <span>{it.label}</span>
                <Icons.ArrowRight />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
