// Locate the exact occurrence of a searched word in the page, scroll to it, and
// briefly flash a highlight over it. No DOM mutation (it overlays absolutely
// positioned boxes), so it's safe alongside React.
const STORE_KEY = 'spotlightHighlight';
let timers = [];

function clearHighlights() {
  document.querySelectorAll('[data-search-highlight]').forEach((el) => el.remove());
  timers.forEach((t) => clearTimeout(t));
  timers = [];
}

// A Range covering the whole word that contains the query at [qOff, qOff+qLen).
function wordRange(node, qOff, qLen) {
  const text = node.nodeValue;
  let start = qOff;
  let end = qOff + qLen;
  while (start > 0 && /\w/.test(text[start - 1])) start--;
  while (end < text.length && /\w/.test(text[end])) end++;
  const r = document.createRange();
  r.setStart(node, start);
  r.setEnd(node, end);
  return r;
}

function findRange(query, needle, anchor) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return null;
  const scope = (anchor && document.getElementById(anchor)) || document.querySelector('article, main') || document.body;

  // Pass 1: find the exact occurrence using the surrounding context (needle).
  if (needle) {
    const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const idx = n.nodeValue.indexOf(needle);
      if (idx !== -1) {
        const qOff = n.nodeValue.toLowerCase().indexOf(q, idx);
        if (qOff !== -1) return wordRange(n, qOff, q.length);
      }
    }
  }

  // Pass 2: first occurrence of the word within the scope.
  const w2 = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  let m;
  while ((m = w2.nextNode())) {
    const qOff = m.nodeValue.toLowerCase().indexOf(q);
    if (qOff !== -1) return wordRange(m, qOff, q.length);
  }
  return null;
}

export function scrollAndHighlight(query, needle, anchor, retried = false) {
  clearHighlights();
  const range = findRange(query, needle, anchor);
  if (!range) {
    const el = anchor && document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // If the match lives inside a collapsed accordion, open it first, then retry
  // once the expand transition has run so we can highlight the now-visible word.
  if (!retried) {
    const item = range.startContainer.parentElement?.closest('[data-accordion-item]');
    if (item && item.getAttribute('data-open') === 'false') {
      item.querySelector('[data-accordion-toggle]')?.click();
      setTimeout(() => scrollAndHighlight(query, needle, anchor, true), 380);
      return;
    }
  }

  const rects = [...range.getClientRects()];
  const visible = rects.some((r) => r.width > 0 && r.height > 0);
  const parent = range.startContainer.parentElement;

  if (!visible) {
    const fallback = (anchor && document.getElementById(anchor)) || parent;
    fallback?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  parent?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Document-space coordinates stay fixed regardless of scroll position.
  const sx = window.scrollX;
  const sy = window.scrollY;
  rects.forEach((r) => {
    const el = document.createElement('div');
    el.setAttribute('data-search-highlight', '');
    Object.assign(el.style, {
      position: 'absolute',
      top: `${r.top + sy - 2}px`,
      left: `${r.left + sx - 3}px`,
      width: `${r.width + 6}px`,
      height: `${r.height + 4}px`,
      background: 'rgba(255, 214, 0, 0.55)',
      borderRadius: '4px',
      pointerEvents: 'none',
      zIndex: '2500',
      opacity: '0',
      transition: 'opacity 0.25s ease',
    });
    document.body.appendChild(el);
    timers.push(setTimeout(() => { el.style.opacity = '1'; }, 30));
  });

  timers.push(setTimeout(() => {
    document.querySelectorAll('[data-search-highlight]').forEach((el) => { el.style.opacity = '0'; });
  }, 2600));
  timers.push(setTimeout(clearHighlights, 3000));
}

// Stash a highlight request before navigating to another page.
export function requestHighlight(path, query, needle, anchor) {
  try { sessionStorage.setItem(STORE_KEY, JSON.stringify({ path, query, needle, anchor })); } catch { /* ignore */ }
}

// Wait until the page's images have loaded (or a safety timeout) so layout is
// stable before we measure — otherwise late-loading images shift content and the
// highlight can land in the wrong place.
function whenImagesSettled(cb) {
  const root = document.querySelector('article, main') || document.body;
  const pending = [...root.querySelectorAll('img')].filter((i) => !i.complete);
  if (pending.length === 0) { setTimeout(cb, 120); return; }
  let done = 0;
  let finished = false;
  const finish = () => { if (finished) return; finished = true; setTimeout(cb, 80); };
  const tick = () => { done += 1; if (done >= pending.length) finish(); };
  pending.forEach((img) => {
    img.addEventListener('load', tick, { once: true });
    img.addEventListener('error', tick, { once: true });
  });
  setTimeout(finish, 1500); // safety cap so we never hang
}

// On a fresh page load, run any pending highlight that targets this page.
// Returns true if it handled navigation (so callers can skip plain hash-scroll).
export function consumePendingHighlight() {
  let raw = null;
  try { raw = sessionStorage.getItem(STORE_KEY); } catch { return false; }
  if (!raw) return false;
  let data;
  try { data = JSON.parse(raw); } catch { try { sessionStorage.removeItem(STORE_KEY); } catch { /* ignore */ } return false; }
  const here = window.location.pathname.replace(/\/+$/, '') || '/';
  const there = (data.path || '').replace(/\/+$/, '') || '/';
  if (here !== there) return false;
  try { sessionStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
  setTimeout(() => whenImagesSettled(() => scrollAndHighlight(data.query, data.needle, data.anchor)), 100);
  return true;
}
