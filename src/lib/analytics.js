// Google Analytics 4 — the only analytics code in the repo.
//
// SECURITY: the Measurement ID below is PUBLIC by design. It only lets the page
// WRITE events into your GA4 property; it can't READ any of your data (that needs
// your Google login). Every site running GA exposes this ID in its page source —
// it is not a secret and is safe to commit to a public repo. All of your actual
// analytics data lives in your private GA4 dashboard, never in these files.
//
// SETUP: create a GA4 property (analytics.google.com → Admin → Create property →
// add a "Web" data stream for danbanica.com), copy its Measurement ID, and paste
// it below in place of the placeholder. Until then everything here no-ops.
const GA_ID = 'G-XXXXXXXXXX';

const configured = () => GA_ID && GA_ID.indexOf('XXXX') === -1;

// Loads gtag.js and starts the session. GA4 then auto-tracks page views, geo,
// engagement time, file downloads, outbound clicks, scroll depth and site search
// via Enhanced Measurement — no extra code needed for those.
export function initAnalytics() {
  if (!configured() || typeof window === 'undefined' || window.__gaInit) return;
  window.__gaInit = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

// Fire a custom event for an in-app interaction that isn't a link/page load.
export function track(name, params) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params || {});
  }
}
