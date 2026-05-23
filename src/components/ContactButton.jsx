import { useState } from 'react';
import { Icons } from './Icons.jsx';
import { portfolioData } from '../data/portfolio.js';

// Click once to reveal the email (animated width), click again to open mail client.
// Used in the hero (bottom-centered) and the footer (inline).
export default function ContactButton({ style, baseColor = 'rgba(255,255,255,0.8)', hoverColor = 'white', fontSize = 15, display = 'flex' }) {
  const [revealed, setRevealed] = useState(false);
  const email = portfolioData.personal.email;

  return (
    <button
      onClick={() => {
        if (revealed) {
          window.location.href = `mailto:${email}`;
        } else {
          setRevealed(true);
        }
      }}
      style={{ display, alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0', background: 'transparent', color: baseColor, border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: `${fontSize}px`, fontWeight: 500, ...style }}
      onMouseEnter={e => e.currentTarget.style.color = hoverColor}
      onMouseLeave={e => e.currentTarget.style.color = baseColor}
    >
      <Icons.At />
      <span style={{ display: 'inline-block', maxWidth: revealed ? '300px' : '80px', overflow: 'hidden', whiteSpace: 'nowrap', transition: 'max-width 0.4s ease' }}>
        {revealed ? email : 'Contact'}
      </span>
    </button>
  );
}
