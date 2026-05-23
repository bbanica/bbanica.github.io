import { useState } from 'react';

// Pastel sticky-note colors and a set of organic rotations, cycled across notes.
const NOTE_COLORS = ['#FEF3C7', '#DBEAFE', '#FCE7F3', '#DCFCE7', '#EDE9FE'];
const ROTATIONS = [-2.4, 1.6, -1.1, 2.1, -1.7, 1.2];

function StickyNote({ text, bg, rotation }) {
  const [hover, setHover] = useState(false);
  return (
    // Outer wrapper handles the masonry column flow; inner div does the visual
    // rotation so the transform never interferes with column layout.
    <div style={{ breakInside: 'avoid', WebkitColumnBreakInside: 'avoid', display: 'inline-block', width: '100%', marginBottom: '20px', verticalAlign: 'top' }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative',
          background: bg,
          padding: '26px 20px 20px',
          borderRadius: '3px',
          // Notes are always light pastels (physical sticky-note look), so the ink
          // stays dark in both themes — using var(--color-text) would flip it light
          // and unreadable in dark mode.
          color: '#1a1a2e',
          boxShadow: hover ? '0 16px 34px rgba(0,0,0,0.18)' : '0 6px 16px rgba(0,0,0,0.10)',
          transform: `rotate(${hover ? 0 : rotation}deg) scale(${hover ? 1.03 : 1})`,
          transition: 'transform 0.28s cubic-bezier(0.32,0.72,0,1), box-shadow 0.28s ease',
        }}
      >
        {/* a strip of "tape" holding the note to the wall */}
        <div style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)', width: '64px', height: '18px', background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '1px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} />
        <p style={{ fontSize: '15px', lineHeight: 1.55, fontWeight: 500 }}>{text}</p>
      </div>
    </div>
  );
}

// Responsive masonry wall of sticky notes. Uses CSS columns sized by width, so
// it flows from 3 columns down to 1 with no JS measurement.
export default function StickyWall({ notes }) {
  return (
    <div style={{ columns: '240px', columnGap: '20px', margin: '24px 0' }}>
      {notes.map((text, i) => (
        <StickyNote key={i} text={text} bg={NOTE_COLORS[i % NOTE_COLORS.length]} rotation={ROTATIONS[i % ROTATIONS.length]} />
      ))}
    </div>
  );
}
