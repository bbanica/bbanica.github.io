// A row of impact-metric cards. Columns adapt to how many stats are passed
// (up to 4 across on desktop, 2 across on mobile).
export default function StatsGrid({ stats, isMobile }) {
  const cols = isMobile ? '1fr 1fr' : `repeat(${Math.min(stats.length, 4)}, 1fr)`;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: isMobile ? '12px' : '16px', margin: '8px 0 28px' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ padding: '20px 18px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-bg-elevated)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: 'clamp(26px, 3.4vw, 34px)', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{s.value}</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
