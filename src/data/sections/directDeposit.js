// Body content for the Direct Deposit case study. Single source of truth,
// imported by the page (rendering) and the search index (full-text search).
export const IMG = '/case-studies/direct-deposit/';

export const sections = [
  {
    n: 1,
    id: 'problem',
    title: 'The problem: preventable errors',
    blocks: [
      { type: 'question', text: 'What happens when the one feature everyone depends on to get paid is also the easiest to get wrong?' },
      { type: 'text', text: 'Every employee on the platform relies on Direct Deposit to receive their pay, so the original experience — clunky, unclear, and unforgiving — had outsized consequences. People worked through an unintuitive interface with manual data entry and no real-time validation. Some entered their account details incorrectly and watched their money disappear into the void, then ended up on the phone with their bosses trying to figure out where their paycheck went.' },
      { type: 'figures', items: [{ src: `${IMG}figure-1.png`, label: 'Figure 1.', caption: 'The original setup flow: manual, unguided, and easy to get wrong.' }] },
      { type: 'text', text: 'The deeper issue was trust. The flow had none of the guardrails that help someone catch a mistake before a check is processed, leaving users in the dark about where their money was going until it was already too late. They expected the seamlessness of a modern banking app — connect an account in seconds, with confidence — and the product wasn’t delivering it.' },
    ],
  },
  {
    n: 2,
    id: 'reality',
    title: 'Ideal vs. reality',
    blocks: [
      { type: 'question', text: 'If modern banking apps already nailed this, why not just copy them?' },
      { type: 'text', text: 'Because breaking established patterns without research behind it is a fast way to make things worse. In an ideal world, users wouldn’t have to adjust their expectations at all — but reality had other plans. I had to compromise against our design system, writing standards, marketing, legal compliance, and an older technical architecture that made the truly “ideal” solution hard for engineers to build.' },
      { type: 'text', text: 'On top of that sat a strict, legally binding six-month deadline. That forced sharp prioritization: nail the critical fixes that reduce errors and protect users now, and backlog the “nice to haves” for later. The whole way through, I worked with developers in real time to find the line between seamless and feasible.' },
    ],
  },
  {
    n: 3,
    id: 'solution',
    title: 'The solution',
    blocks: [
      { type: 'text', text: 'I worked closely with principal product managers, front-end and back-end developers, and development managers to keep execution tight. Some UI decisions weren’t what competitors were doing — they were shaped by real internal constraints — but rather than let those limitations drag down the experience, I partnered with engineers in real time to find what was genuinely achievable while still dramatically improving usability. The headline change: real-time validation that catches bad account details before they cost someone a paycheck, inside a flow that cut the clicks to complete setup in half.' },
      { type: 'figures', items: [{ src: `${IMG}figure-2.png`, label: 'Figure 2.', caption: 'The redesigned flow, with real-time validation built in.' }] },
      { type: 'text', text: 'The most common pain points were tackled: confusing account sorting, not being able to link an account directly, and unclear directions about how money is distributed. There are too many flows to show here, but feel free to reach out if you want to see more.' },
      { type: 'text', text: 'Because I met and beat the expected design delivery pace despite the timeline, we bought ourselves room for extensive testing — catching edge cases early, before they could ever reach a real paycheck.' },
    ],
  },
];
