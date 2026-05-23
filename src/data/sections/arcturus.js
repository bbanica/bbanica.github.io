// Body content for the Arcturus case study. Imported by the page (for rendering)
// and by the search index (for full-text search) — single source of truth.
export const IMG = '/case-studies/arcturus/';

const FEEDBACK = [
  'Your initial experience will vary greatly based on how good the specialists are for your implementation team. It’s a crapshoot.',
  'Until they create a more user-friendly interface that guides users through each module step by step, it may be difficult for others to fully utilize the system.',
  'Built from the top down, but with the ‘whole enchilada’ in mind. … Not all screens are intuitive. … Your implementation time will be a lot of work.',
  'If you’re only using it to process payroll, it’s great. Everything else is awful. It’s not intuitive at all.',
  'Outdated, clunky, and unintuitive.',
];

export const sections = [
  {
    n: 1,
    id: 'problem',
    title: 'The business problem',
    blocks: [
      { type: 'question', text: 'Why would an enterprise client walk away from powerful software just because it looks old?' },
      { type: 'text', text: 'Good business knowledge says that as a B2B SaaS company, if the end users complain enough to their business, then the business will cut ties with ours. Even those without an eye for design know when they’re looking at something that looks dated or off — they may not be able to put their finger on why, but they’ll know something’s up.' },
      { type: 'figures', items: [{ src: `${IMG}figure-1a.png`, label: 'Figure 1a.', caption: 'The legacy experience we set out to replace.' }] },
      { type: 'text', text: 'And end users have a loud voice, as they should. They influence the clients we partner with, and they leave reviews on the app store. If they’re happy, everyone is happy. If they’re not, the competitor’s sales team will have a much easier time getting them to switch.' },
      { type: 'stickies', notes: FEEDBACK },
    ],
  },
  {
    n: 2,
    id: 'end-user',
    title: 'Designing for the end user, not just the buyer',
    blocks: [
      { type: 'question', text: 'In B2B SaaS, there are tools used strictly by the people who sign the contracts and give approvals. But what happens when that changes?' },
      { type: 'text', text: 'For years, our system placed its focus on the administrative side of things and the executive functionality. We kept having to build internal tools just to diagnose user problems, but that never solved the root issues. We wanted employee-level end users to feel like they mattered — like their payroll app actually served them — without leaving admin users feeling left out and wanting the same special treatment. So we set out to gather as much information as we could: the most-used products, the most-requested features in our product feedback queue, defects, app store reviews, and real sit-down conversations with users from every side of the equation. We knew we had to build a set of customizable dashboards; the question became what to put in them.' },
      { type: 'figures', items: [{ src: `${IMG}figure-2a.png`, label: 'Figure 2a.', caption: 'Synthesizing research from every side of the product.' }] },
      { type: 'text', text: 'What followed was a major roadmapping and business-strategy effort that laid out every stage to success: how many features to launch with, how to do a slow rollout for clients, how to support legacy systems for clients who weren’t ready to switch yet, and more. We landed on a list of dozens of genuinely helpful quick-actions that could be customized for admin- or employee-facing roles, so that everyone signed with our company felt taken care of.' },
      { type: 'figures', items: [{ src: `${IMG}figure-2c.png`, label: 'Figure 2c.', caption: 'Customizable dashboards built around real quick-actions.' }] },
    ],
  },
  {
    n: 3,
    id: 'low-fidelity',
    title: 'We didn’t start in Figma',
    blocks: [
      { type: 'text', text: 'We didn’t start in Figma — we started in a studio, with pen and paper. We sketched ideas, blurted out features we’d wished we could build for years, and were genuinely full of glee to make a big change. We ran many rounds of low-fidelity paper prototyping to generate ideas and bounce off each other, then moved into low-fi Figma prototypes we could push through UserTesting to validate concepts quickly. For very little cost, that low-fidelity effort taught us what actually stood out to users and what they felt bolstered a brand’s image.' },
      { type: 'figures', items: [
        { src: `${IMG}figure-3a.png`, label: 'Figure 3a.', caption: 'Where it started: pen, paper, and a lot of sticky notes.' },
        { src: `${IMG}figure-3b.png`, label: 'Figure 3b.', caption: 'Working sessions, talking through directions as a team.' },
      ] },
      { type: 'figures', items: [
        { src: `${IMG}figure-3c.png`, label: 'Figure 3c.', caption: 'Presenting ideas to each other.' },
        { src: `${IMG}figure-3d.png`, label: 'Figure 3d.', caption: 'Mapping ideas across the room.' },
      ] },
      { type: 'text', text: 'We worked in tandem with the director of branding to make sure we were cleared to make real changes — and we wanted to go big: different fonts, different brand colors, a different tone of voice. It was all ambitious, and it all had to come together to work. I spent countless hours presenting to stakeholders, and after endless critique sessions, revisions, and internal feedback, we got approval for nearly everything we asked for. The strength of the team let us anticipate every angle of scrutiny and get ahead of it.' },
      { type: 'text', text: 'Good artists copy, great artists steal. My team and I started pulling inspiration from all over the internet for what we wanted the visual direction to be like, and to have proof-of-concept flows. I encouraged them to pull everything into mood boards, and then start what I called “scrapbooking.”' },
      { type: 'text', text: 'The scrapbooking activity was when we combined a bunch of screenshots from different apps together to create an ugly but definite standard for the direction we wanted to go. It may not make sense to everyone when looking at these mockups, but it made sense to us.' },
      { type: 'figures', items: [
        { src: `${IMG}figure-3f.png`, label: 'Figure 3f.', caption: 'Pulling inspiration from across the internet.' },
        { src: `${IMG}figure-3g.png`, label: 'Figure 3g.', caption: 'Inspiration from products we admired.' },
      ] },
      { type: 'figures', items: [
        { src: `${IMG}figure-3h.png`, label: 'Figure 3h.', caption: 'Scrapbooking: stitching screenshots together.' },
        { src: `${IMG}figure-3i.png`, label: 'Figure 3i.', caption: 'Low fidelity ideas.' },
      ] },
      { type: 'figures', items: [{ src: `${IMG}figure-3j.png`, label: 'Figure 3j.', caption: 'Radically reimagining what the experience could be.' }] },
    ],
  },
  {
    n: 4,
    id: 'aesthetics',
    title: 'Aesthetics as a trust signal',
    blocks: [
      { type: 'question', text: 'Isn’t a visual refresh just a beautification project?' },
      { type: 'text', text: 'Not necessarily. The psychological impact that branding and aesthetics have on trust can’t be overstated. Think about a company like Amazon, which famously spent days tweaking the yellow on its checkout buttons to be a fraction more psychologically appealing. Packaging design works the same way — you’ll see shelves of more or less the same product in every grocery aisle, and the packaging is the thing doing the selling and the trust-building.' },
      { type: 'text', text: 'So we deliberately brought a fresh aesthetic in — not only to signal a new, forward-thinking era of our product suite, but to build even more trust in a product that the people who use it already know is extremely capable.' },
      { type: 'figures', items: [{ src: `${IMG}figure-4a.png`, label: 'Figure 4a.', caption: 'Before.' }] },
      { type: 'figures', items: [{ src: `${IMG}figure-4b.png`, label: 'Figure 4b.', caption: 'After.' }] },
    ],
  },
  {
    n: 5,
    id: 'reskin',
    title: 'More than a reskin',
    blocks: [
      { type: 'question', text: 'How do you actually ship a design system engineers will adopt?' },
      { type: 'text', text: 'Engineers are design partners, not people we just hand things off to. Over thousands of hours, we worked alongside countless developers, subject-matter experts, and client-facing teams. We validated decisions through UserTesting to make sure our internal conversations weren’t leading us down the wrong path.' },
      { type: 'text', text: 'I presented to executives biweekly to keep the direction aligned with the business, and wrote dozens of code snippets to help developers implement front-end features correctly. I worked directly with principal and staff engineers to onboard the team onto our new framework and explain how to use it.' },
      { type: 'figures', items: [
        { src: `${IMG}figure-5a.png`, label: 'Figure 5a.', caption: 'A rearchitected component library and design tokens.' },
        { src: `${IMG}figure-5b.png`, label: 'Figure 5b.', caption: 'Code snippets to help engineers implement it correctly.' },
      ] },
    ],
  },
];
