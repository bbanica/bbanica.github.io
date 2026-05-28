import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Icons } from './Icons.jsx';
import { useScrollLock } from '../hooks.js';
import { track } from '../lib/events.js';

// Fullscreen image viewer with:
//  - tap/click the image to zoom in, click again to zoom out
//  - drag (one finger / mouse) to pan when zoomed
//  - pinch (two fingers) to zoom continuously, focused on the pinch point
//  - a drag/pinch never triggers the click-to-zoom-out
// Close with Escape, the X button, or a click on the backdrop.
const LightboxContext = createContext(null);
export const useLightbox = () => useContext(LightboxContext);

export function LightboxProvider({ children }) {
  const [item, setItem] = useState(null); // { src, caption, alt }
  const open = useCallback((src, caption, alt) => { track('lightbox_open', { image: src }); setItem({ src, caption, alt }); }, []);
  const close = useCallback(() => setItem(null), []);

  // Lock page scrolling while open so the fixed scrim can't be scrolled away.
  useScrollLock(!!item);

  useEffect(() => {
    if (!item) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, close]);

  return (
    <LightboxContext.Provider value={{ open, close }}>
      {children}
      {item && <LightboxOverlay item={item} onClose={close} />}
    </LightboxContext.Provider>
  );
}

const TAP_ZOOM = 2.5;
const MIN = 1;
const MAX = 5;
const DRAG_THRESHOLD = 4;

function LightboxOverlay({ item, onClose }) {
  const [shown, setShown] = useState(false);
  // `scale` mirrors the committed zoom so the caption text and cursor can react
  // to it. It is updated only when a gesture ends — never per frame.
  const [scale, setScale] = useState(1);
  const [active, setActive] = useState(false); // mid-gesture → drives the cursor

  const imgRef = useRef(null);
  const pointers = useRef(new Map()); // pointerId -> {x, y}
  const single = useRef(null);        // { x, y, panX, panY, moved }
  const pinch = useRef(null);         // { dist0, scale0, oFx, oFy }
  const scaleRef = useRef(1);         // live scale — source of truth during gestures
  const panRef = useRef({ x: 0, y: 0 });

  // Write the live scale/pan straight to the <img>, bypassing React. A pinch or
  // pan then updates every frame without re-rendering the whole overlay — that
  // per-frame re-render was the remaining flicker on iOS. `animate` turns on the
  // snap transition (used for tap-to-zoom and the pinch-reset).
  const applyTransform = (animate) => {
    const el = imgRef.current;
    if (!el) return;
    el.style.transition = animate ? 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)' : 'none';
    const t = `translate3d(${panRef.current.x}px, ${panRef.current.y}px, 0) scale(${scaleRef.current})`;
    el.style.transform = t;
    el.style.webkitTransform = t;
  };
  // Snap into place and sync the committed scale into state (a single re-render).
  const commit = (animate) => { applyTransform(animate); setScale(scaleRef.current); };

  useEffect(() => {
    applyTransform(false); // identity transform on mount
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const center = () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const startPinch = () => {
    const [a, b] = [...pointers.current.values()];
    const dist0 = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const c = center();
    const s0 = scaleRef.current;
    const p0 = panRef.current;
    // image-space offset of the pinch focal point (stays put as we scale)
    pinch.current = { dist0, scale0: s0, oFx: (mid.x - c.x - p0.x) / s0, oFy: (mid.y - c.y - p0.y) / s0 };
    single.current = null;
    applyTransform(false); // cancel any in-flight snap transition before live updates
    setActive(true);
  };

  const onPointerDown = (e) => {
    e.stopPropagation();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      single.current = { x: e.clientX, y: e.clientY, panX: panRef.current.x, panY: panRef.current.y, moved: false };
      pinch.current = null;
    } else if (pointers.current.size === 2) {
      startPinch();
    }
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinch.current && pointers.current.size >= 2) {
      e.stopPropagation();
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const c = center();
      const s1 = Math.max(MIN, Math.min(MAX, pinch.current.scale0 * (dist / pinch.current.dist0)));
      scaleRef.current = s1;
      panRef.current = { x: mid.x - c.x - s1 * pinch.current.oFx, y: mid.y - c.y - s1 * pinch.current.oFy };
      applyTransform(false);
    } else if (single.current) {
      const dx = e.clientX - single.current.x;
      const dy = e.clientY - single.current.y;
      if (!single.current.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        single.current.moved = true;
        if (scaleRef.current > 1) setActive(true);
      }
      if (scaleRef.current > 1 && single.current.moved) {
        e.stopPropagation();
        panRef.current = { x: single.current.panX + dx, y: single.current.panY + dy };
        applyTransform(false);
      }
    }
  };

  const endPointer = (e, cancelled) => {
    e.stopPropagation();
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    const wasPinch = !!pinch.current;
    const s = single.current;
    pointers.current.delete(e.pointerId);

    if (pointers.current.size >= 2) { startPinch(); return; }

    if (pointers.current.size === 1) {
      // a pinch dropped to one finger → continue as a pan from the remaining finger
      pinch.current = null;
      const [rem] = [...pointers.current.values()];
      single.current = { x: rem.x, y: rem.y, panX: panRef.current.x, panY: panRef.current.y, moved: true };
      return; // still mid-gesture — stay active
    }

    // no pointers left → gesture finished
    pinch.current = null;
    single.current = null;
    setActive(false);
    if (cancelled) { setScale(scaleRef.current); return; }

    if (wasPinch) {
      // a tiny residual zoom snaps back to fit; otherwise just sync state
      if (scaleRef.current <= 1.05) { scaleRef.current = 1; panRef.current = { x: 0, y: 0 }; commit(true); }
      else { setScale(scaleRef.current); }
      return;
    }
    // clean tap (no drag) toggles zoom
    if (s && !s.moved) {
      if (scaleRef.current > 1) { scaleRef.current = 1; panRef.current = { x: 0, y: 0 }; }
      else { scaleRef.current = TAP_ZOOM; }
      commit(true);
    } else {
      setScale(scaleRef.current); // a pan ended — keep position, sync state
    }
  };

  const zoomed = scale > 1;

  return (
    <>
      {/* Scrim + image. inset:-100px overshoots the viewport on every side so any
          browser-chrome miscalculation stays hidden behind the dark blur. */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: '-100px', zIndex: 4000, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(12, 14, 30, 0.78)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          opacity: shown ? 1 : 0, transition: 'opacity 0.2s ease',
        }}
      >
        <img
          ref={imgRef}
          src={item.src}
          alt={item.alt || ''}
          draggable={false}
          onClick={e => e.stopPropagation()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={e => endPointer(e, false)}
          onPointerCancel={e => endPointer(e, true)}
          style={{
            maxWidth: '94vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            // transform + transition are driven imperatively via applyTransform(), not
            // React, so a pinch/pan updates per frame without re-rendering this overlay.
            // translate3d + will-change/backface-visibility keep the image GPU-composited.
            transformOrigin: 'center center',
            willChange: 'transform',
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            cursor: zoomed ? (active ? 'grabbing' : 'grab') : 'zoom-in',
            userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none',
          }}
        />
      </div>

      {/* Controls live OUTSIDE the blurred scrim so they stay anchored to the
          viewport (a backdrop-filter would otherwise become their containing block). */}
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'fixed', top: '20px', right: '20px', width: '44px', height: '44px',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.14)', border: '1px solid rgba(255, 255, 255, 0.25)',
          color: 'white', cursor: 'pointer',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 4001,
          opacity: shown ? 1 : 0, transition: 'opacity 0.2s ease',
        }}
      >
        <Icons.X />
      </button>

      {item.caption && (
        <div style={{ position: 'fixed', bottom: '20px', left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto', width: 'fit-content', maxWidth: 'min(94vw, 600px)', textAlign: 'center', color: 'rgba(255,255,255,0.92)', fontSize: '13px', lineHeight: 1.45, background: 'rgba(0,0,0,0.4)', padding: '9px 20px', borderRadius: '18px', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', pointerEvents: 'none', zIndex: 4001, opacity: shown ? 1 : 0, transition: 'opacity 0.2s ease' }}>
          {item.caption}{' · '}<span style={{ opacity: 0.7 }}>{zoomed ? 'click to zoom out · drag or pinch' : 'click or pinch to zoom'}</span>
        </div>
      )}
    </>
  );
}
