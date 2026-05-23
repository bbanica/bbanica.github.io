import { useState } from 'react';
import { Icons } from './Icons.jsx';
import { useLightbox } from './Lightbox.jsx';

const mono = "ui-monospace, 'SF Mono', Menlo, monospace";

// Shown until a real screenshot is dropped at `src`. Displays the expected
// filename so it's obvious what file to add and where. `fill` makes it fill a
// fixed-ratio parent (used in side-by-side rows); otherwise it sets its own ratio.
function Placeholder({ src, fill }) {
  const name = src ? src.split('/').pop() : 'screenshot';
  const box = fill
    ? { width: '100%', height: '100%' }
    : { width: '100%', aspectRatio: '16 / 10' };
  return (
    <div style={{ ...box, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, #FAFBFE 0%, #EEF2FB 100%)', color: 'var(--color-text-tertiary)' }}>
      <Icons.Image />
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em' }}>SCREENSHOT</div>
      <div style={{ fontFamily: mono, fontSize: '11px', opacity: 0.75 }}>{name}</div>
    </div>
  );
}

// A single figure with a caption; clicking a present image expands it in the
// lightbox (which always shows the full, uncropped image). When `ratio` is set
// the thumbnail is locked to that aspect ratio (object-fit: cover) so figures in
// a side-by-side row stay uniform and aligned.
export function ImageFigure({ src, alt, label, caption, ratio }) {
  const [failed, setFailed] = useState(false);
  const { open } = useLightbox();
  const has = src && !failed;

  const expand = () => {
    if (!has) return;
    open(src, `${label || ''} ${caption || ''}`.trim(), alt || `${label || ''} ${caption || ''}`.trim());
  };

  const imgStyle = ratio
    ? { width: '100%', height: '100%', objectFit: 'cover', display: 'block' }
    : { width: '100%', height: 'auto', display: 'block' };

  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
      <button
        type="button"
        onClick={expand}
        style={{ display: 'block', width: '100%', textAlign: 'left', padding: 0, border: 'none', background: 'none', cursor: has ? 'zoom-in' : 'default' }}
      >
        <div style={{ position: 'relative', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--color-bg)', ...(ratio ? { aspectRatio: ratio } : {}) }}>
          {has
            ? <img src={src} alt={alt || ''} onError={() => setFailed(true)} style={imgStyle} />
            : <Placeholder src={src} fill={!!ratio} />}
          {has && (
            <div style={{ position: 'absolute', top: 10, right: 10, color: 'white', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '5px', display: 'flex' }}><Icons.Maximize /></div>
          )}
        </div>
      </button>
      {(label || caption) && (
        <figcaption style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-text-tertiary)' }}>
          {label && <strong style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{label}</strong>} {caption}
        </figcaption>
      )}
    </figure>
  );
}

// One image full-width (natural aspect), or two+ side by side. Multi-image rows
// lock every thumbnail to a uniform 4:3 so the grid stays aligned regardless of
// the source images' aspect ratios.
export function ImageRow({ items, isMobile }) {
  const multi = items.length > 1;
  const cols = multi && !isMobile ? '1fr 1fr' : '1fr';
  const ratio = multi ? '4 / 3' : undefined;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: isMobile ? '18px' : '24px', margin: '24px 0' }}>
      {items.map((it, i) => <ImageFigure key={i} ratio={ratio} {...it} />)}
    </div>
  );
}
