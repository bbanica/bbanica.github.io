import { Icons } from './Icons.jsx';

// Reusable NDA / de-branding note for case studies whose screenshots are altered.
export default function VisualsDisclaimer() {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '16px 18px', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', marginBottom: '28px' }}>
      <div style={{ flexShrink: 0, color: 'var(--color-primary)', marginTop: '1px' }}><Icons.Info /></div>
      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>A note on the visuals:</strong> Every screenshot here is de-branded and has had altered colors due to NDAs and contracts. Specific branding isn&rsquo;t shown, but the process and results remain the same.
      </p>
    </div>
  );
}
