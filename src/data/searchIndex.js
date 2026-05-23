// Flat, searchable index of the whole site, built from a single source of truth:
// the home data (portfolio.js) and each case study's section data. Each entry is
// { page, path, anchor, text }. The Spotlight searches the `text` and links to
// `path` (+ #anchor) so a result can navigate straight to where the word lives.
import { portfolioData, projects } from './portfolio.js';
import { sections as arcturusSections } from './sections/arcturus.js';
import { sections as oklahomaSections } from './sections/oklahoma.js';
import { sections as directDepositSections } from './sections/directDeposit.js';

const blocks = [];
const add = (page, path, anchor, text) => {
  if (text && String(text).trim()) blocks.push({ page, path, anchor: anchor || '', text: String(text).trim() });
};

// Pull every piece of prose out of a case study's section data.
function flattenSections(page, path, sections) {
  sections.forEach((s) => {
    const anchor = s.id || '';
    add(page, path, anchor, s.title);
    s.blocks.forEach((b) => {
      if (b.type === 'text' || b.type === 'question') add(page, path, anchor, b.text);
      else if (b.type === 'stickies') b.notes.forEach((n) => add(page, path, anchor, n));
      else if (b.type === 'figures') b.items.forEach((it) => add(page, path, anchor, it.caption));
    });
  });
}

// ---- HOME ----
const P = portfolioData.personal;
add('Home', '/', '', `${P.name} — ${P.title}`);
add('Home', '/', '', P.tagline);
projects.forEach((p) => add('Home', '/', 'work-section', `${p.title} — ${p.subtitle}. ${p.description} (${p.tags.join(', ')})`));
portfolioData.experience.forEach((e) => add('Home', '/', 'experience-section', `${e.company} — ${e.role}, ${e.period}. ${e.description}`));
portfolioData.about.forEach((a) => add('Home', '/', 'about-section', `${a.title}: ${a.content}`));

// ---- ARCTURUS ----
const ARC = 'Arcturus Design System';
add(ARC, '/arcturus/', '', 'Arcturus Design System — rebuilding an enterprise design system around the people who actually use the product.');
add(ARC, '/arcturus/', '', '“What do you do as an enterprise company when you’re losing clients because of how outdated the software looks?” That was the question our executives asked. Over six months, I co-led a team of five designers in rebuilding our company’s entire design system — an effort that included a fundamental rearchitecture, designed for the end user.');
flattenSections(ARC, '/arcturus/', arcturusSections);
add(ARC, '/arcturus/', 'results', 'Early results');
add(ARC, '/arcturus/', 'results', 'Arcturus is rolling out through a client pilot program, so the full impact is still ahead of us. But the early numbers from pilot accounts are encouraging.');
['22% faster on common employee tasks', '100% of pilot users kept a personalized dashboard', '31% fewer navigation-related support tickets', '94% internal satisfaction score from pilot users']
  .forEach((t) => add(ARC, '/arcturus/', 'results', t));
add(ARC, '/arcturus/', 'results', 'These figures come from a limited pilot, and the broader rollout is still underway — so the complete picture of the project’s impact is yet to be seen.');

// ---- OKLAHOMA NAVIGATE ----
const OK = 'Oklahoma Navigate';
add(OK, '/oklahoma-navigate/', '', 'Oklahoma Navigate — I was able to complete my tasks, but I saw room for improvement of the platform.');
add(OK, '/oklahoma-navigate/', '', 'I grew up in Washington. I moved to Oklahoma a few years ago, and as an automotive enthusiast, I used the OK Navigate portal for the first time to register my three vehicles. Here’s what I thought.');
add(OK, '/oklahoma-navigate/', '', 'The digital age is still a bit new to us. Oklahoma was a late adopter to the online title and registration game. It was also a late adopter to the automated toll booth game.');
flattenSections(OK, '/oklahoma-navigate/', oklahomaSections);
add(OK, '/oklahoma-navigate/', '', 'Overall thoughts. Navigate got the job done for me, but it could have been easier and more performant. Being logged out multiple times, not knowing where to find information, and having to go through it all three times on a slow data connection drove me to want to improve the experience for everyone.');

// ---- DIRECT DEPOSIT ----
const DD = 'Direct Deposit Redesign';
add(DD, '/direct-deposit/', '', 'Direct Deposit Redesign — rebuilding how millions of people set up where their paycheck lands.');
add(DD, '/direct-deposit/', '', 'Direct Deposit is the one feature every employee on the platform depends on to get paid — so when the setup experience is clunky, the fallout is real: misrouted pay, missing checks, and frustrated people on the phone with their bosses. I led the redesign that fixed it, against a hard, legally binding six-month deadline.');
flattenSections(DD, '/direct-deposit/', directDepositSections);
add(DD, '/direct-deposit/', 'impact', 'The impact. The redesign paid off where it mattered most — in fewer errors, fewer frustrated calls, and a lot more confidence.');
['50% fewer clicks to complete setup', '80%+ fewer usability complaint tickets'].forEach((t) => add(DD, '/direct-deposit/', 'impact', t));
add(DD, '/direct-deposit/', 'impact', 'Usability complaints about Direct Deposit fell by more than 80%, customer service calls dropped, and people gained real confidence in managing where their pay lands.');
add(DD, '/direct-deposit/', 'lessons', 'Lessons learned. This project was one long exercise in adaptability — a game of compromise and empathy. Real-world constraints (technical, legal, business) demand creative problem-solving.');

export const searchIndex = blocks;

// Find the first occurrence of `query` in `text` and return the 3 words on each
// side (fewer at the edges). Returns null if not found.
export function findSnippet(text, query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const words = text.split(/\s+/).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    if (words[i].toLowerCase().includes(q)) {
      const from = Math.max(0, i - 3);
      const to = Math.min(words.length, i + 4);
      return {
        before: (from > 0 ? '… ' : '') + words.slice(from, i).join(' '),
        match: words[i],
        after: words.slice(i + 1, to).join(' ') + (to < words.length ? ' …' : ''),
        // exact context substring, used to locate this precise occurrence in the DOM
        needle: words.slice(from, to).join(' '),
      };
    }
  }
  return null;
}

// Returns up to `limit` search results: one per matching index block.
export function searchSite(query, limit = 24) {
  const q = query.trim();
  if (!q) return [];
  const results = [];
  for (const b of searchIndex) {
    const snip = findSnippet(b.text, q);
    if (snip) {
      results.push({ page: b.page, path: b.path, anchor: b.anchor, ...snip });
      if (results.length >= limit) break;
    }
  }
  return results;
}
