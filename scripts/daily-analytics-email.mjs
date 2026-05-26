// Daily GA4 → email summary.
//
// Runs in GitHub Actions (.github/workflows/daily-analytics-email.yml), NOT in the
// website bundle. Every credential comes from an Actions secret, so nothing
// sensitive ever lives in the repo. It pulls yesterday's stats from the GA4 Data
// API and emails a formatted summary via Resend (Node 20+ has global fetch, so no
// email SDK is needed).
//
// Required env (all from GitHub Actions secrets):
//   GA_PROPERTY_ID          numeric GA4 property id (Admin → Property Settings),
//                           e.g. 123456789 — NOT the G-XXXX measurement id
//   GA_SERVICE_ACCOUNT_KEY  full JSON of a Google service-account key (one line ok)
//   RESEND_API_KEY          from resend.com
//   REPORT_TO_EMAIL         where the summary is sent
//   REPORT_FROM_EMAIL       optional; defaults to Resend's shared onboarding sender
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const {
  GA_PROPERTY_ID,
  GA_SERVICE_ACCOUNT_KEY,
  RESEND_API_KEY,
  REPORT_TO_EMAIL,
  REPORT_FROM_EMAIL = 'onboarding@resend.dev',
} = process.env;

const need = (name, val) => { if (!val) { console.error(`Missing required env: ${name}`); process.exit(1); } };
need('GA_PROPERTY_ID', GA_PROPERTY_ID);
need('GA_SERVICE_ACCOUNT_KEY', GA_SERVICE_ACCOUNT_KEY);
need('RESEND_API_KEY', RESEND_API_KEY);
need('REPORT_TO_EMAIL', REPORT_TO_EMAIL);

const client = new BetaAnalyticsDataClient({ credentials: JSON.parse(GA_SERVICE_ACCOUNT_KEY) });
const property = `properties/${GA_PROPERTY_ID}`;
const YESTERDAY = [{ startDate: 'yesterday', endDate: 'yesterday' }];

const report = async (cfg) => (await client.runReport({ property, dateRanges: YESTERDAY, ...cfg }))[0];
const rows = (resp) => (resp.rows || []).map((r) => ({
  dims: (r.dimensionValues || []).map((d) => d.value),
  mets: (r.metricValues || []).map((m) => m.value),
}));

const fmtDuration = (s) => {
  const n = Math.round(Number(s) || 0);
  const m = Math.floor(n / 60);
  return m ? `${m}m ${n % 60}s` : `${n % 60}s`;
};
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function table(title, headers, dataRows) {
  if (!dataRows.length) {
    return `<h3 style="font:600 14px system-ui;margin:22px 0 8px;color:#1a1a2e">${title}</h3><p style="font:13px system-ui;color:#888;margin:0">No data.</p>`;
  }
  const th = headers.map((h, i) => `<th style="text-align:${i ? 'right' : 'left'};padding:6px 10px;border-bottom:2px solid #e5e7eb;font:600 12px system-ui;color:#555">${esc(h)}</th>`).join('');
  const trs = dataRows.map((cells) => `<tr>${cells.map((c, i) => `<td style="text-align:${i ? 'right' : 'left'};padding:6px 10px;border-bottom:1px solid #f1f1f4;font:13px system-ui;color:#222">${esc(c)}</td>`).join('')}</tr>`).join('');
  return `<h3 style="font:600 14px system-ui;margin:22px 0 8px;color:#1a1a2e">${title}</h3><table style="border-collapse:collapse;width:100%">${`<tr>${th}</tr>`}${trs}</table>`;
}

async function main() {
  const dateLabel = new Date(Date.now() - 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'America/Chicago' });

  const [totals, pages, geo, events, sources] = await Promise.all([
    report({ metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'averageSessionDuration' }] }),
    report({ dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 8 }),
    report({ dimensions: [{ name: 'country' }, { name: 'city' }], metrics: [{ name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }], limit: 8 }),
    report({ dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }], orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }], limit: 12 }),
    report({ dimensions: [{ name: 'sessionSource' }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 6 }),
  ]);

  const t = rows(totals)[0]?.mets || ['0', '0', '0', '0'];
  const cards = [['Visitors', t[0]], ['Sessions', t[1]], ['Page views', t[2]], ['Avg session', fmtDuration(t[3])]]
    .map(([label, val]) => `<div style="flex:1;min-width:120px;background:#f6f8fc;border:1px solid #e8eeff;border-radius:12px;padding:12px 14px"><div style="font:13px system-ui;color:#667">${label}</div><div style="font:700 22px system-ui;color:#1a1a2e;margin-top:2px">${esc(val)}</div></div>`)
    .join('');

  const html = `<div style="max-width:640px;margin:0 auto;padding:8px 4px">
    <h2 style="font:700 18px system-ui;color:#2563eb;margin:0 0 2px">danbanica.com</h2>
    <p style="font:13px system-ui;color:#777;margin:0 0 14px">Analytics summary · ${esc(dateLabel)}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:6px 0 4px">${cards}</div>
    ${table('Top pages', ['Page', 'Views', 'Visitors'], rows(pages).map((r) => [r.dims[0], r.mets[0], r.mets[1]]))}
    ${table('Where from', ['Location', 'Visitors'], rows(geo).map((r) => [`${r.dims[1] && r.dims[1] !== '(not set)' ? r.dims[1] + ', ' : ''}${r.dims[0]}`, r.mets[0]]))}
    ${table('Interactions (events)', ['Event', 'Count'], rows(events).map((r) => [r.dims[0], r.mets[0]]))}
    ${table('Traffic sources', ['Source', 'Sessions'], rows(sources).map((r) => [r.dims[0], r.mets[0]]))}
    <p style="font:12px system-ui;color:#aaa;margin:22px 0 0">Sent automatically by your GitHub Actions job. Location is city-level (derived from IP); GA4 does not expose raw IP addresses.</p>
  </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: REPORT_FROM_EMAIL, to: REPORT_TO_EMAIL, subject: `danbanica.com — ${dateLabel} (${t[0]} visitors)`, html }),
  });
  if (!res.ok) { console.error('Email send failed:', res.status, await res.text()); process.exit(1); }
  console.log('Daily analytics email sent. Visitors yesterday:', t[0]);
}

main().catch((e) => { console.error(e); process.exit(1); });
