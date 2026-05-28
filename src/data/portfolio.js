export const portfolioData = {
  personal: {
    name: "Dan Banica",
    title: "Lead Product Designer",
    tagline: "i build things and systems people want to keep using.",
    location: "Oklahoma",
    email: "hello@danbanica.com"
  },
  // Roles are listed individually (most recent first) so the progression reads
  // honestly instead of collapsing the Paycom arc into a single line.
  experience: [
    {
      company: "Paycom",
      role: "Lead Product Designer",
      period: "Sep 2025 – Present",
      sub: "Platform, design systems, design engineering",
      logo: "/logos/paycom.png",
      description: "Lead role spanning platform UX, design systems, and design engineering. Captain of one of the original sprint teams for what became Project ARC, then design partner for the broader rollout — leading workshops, deliberating system calls, and writing the React snippets that ship next to the specs. Mentoring three interns on the side."
    },
    {
      company: "Paycom",
      role: "Product Designer II",
      period: "May 2025 – Sep 2025",
      sub: "Core payroll, international banking, platform team",
      logo: "/logos/paycom.png",
      description: "Promoted into a wider scope across core payroll, international banking, and the platform team. Picked up early Project ARC contributions before it formally kicked off, kept core releases moving, and built the Payroll Design Team component library — Figma plus production-ready React — on my own time so the non-ARC teams had a consistency floor to work from."
    },
    {
      company: "Paycom",
      role: "Associate Product Designer",
      period: "Aug 2024 – May 2025",
      sub: "Core payroll team",
      logo: "/logos/paycom.png",
      description: "Joined the core payroll team straight out of my internship and got handed real scope fast. Led the Direct Deposit redesign with Yodlee integration (hard six-month deadline), then Tax Reporting modernization, Billing Hub, Everyday®, and Global Payroll Filters — most of them ahead of schedule. Promoted to Designer II about six months in."
    },
    {
      company: "bluvector",
      role: "UX Developer",
      period: "Aug 2024 – Present",
      sub: "Dev & UI/UX — web-based games",
      logo: "/logos/bluvector.png",
      description: "Designing and building web-based games on the side — equal parts UI/UX and code. The practice ground for the front-end skills that ended up bleeding into my day job, on the theory that the fastest way to learn what engineers actually need from a designer is to be one."
    },
    {
      company: "Paycom",
      role: "Product Design Intern",
      period: "May 2023 – Aug 2023",
      sub: "UI/UX — platform onboarding",
      logo: "/logos/paycom.png",
      description: "Three months on the platform team building an internal user-onboarding tool — 20+ stakeholders and interviewees, real research, a UX guide and a 20-component UI library shipped to back it. Got the return offer."
    },
    {
      company: "UW Formula Motorsports",
      role: "Graphic Designer",
      period: "Nov 2022 – May 2023",
      sub: "External marketing",
      logo: "/logos/uw-formula.png",
      description: "External marketing for UW's Formula SAE team: campaigns, sponsor decks, merch, and the visual language across socials. Fast turnarounds, real audiences, and a healthy dose of selling work I didn't get to design from scratch."
    },
    {
      company: "Lake Washington Institute of Technology",
      role: "Graphic Designer",
      period: "Jun 2021 – Mar 2022",
      sub: "Events, merchandise, marketing",
      logo: "/logos/lwtech.png",
      description: "First real design job — leading design and marketing for three concurrent campaigns spanning physical and digital. Event collateral, merch, social. Campus event turnout went up 150% over prior years, which sounds like a fluke until you remember most college events run on a vibe and a flyer."
    }
  ],
  about: [
    {
      title: "Background",
      content: "Born in Romania, moved to Washington in 2012, and fell into design about the time I was busy figuring out English. I was making freelance logos, mockups, vector portraits, and shirt graphics before I could legally hold a real job — design didn’t care how old I was, which was the whole appeal. Studied interaction design at the University of Washington while I freelanced through it, and I’ve been a product designer ever since."
    },
    {
      title: "Approach",
      content: "I work in good faith. Give honest critique, take it back without flinching, and assume the person on the other side is trying their best. A favorite quote of mine: “A society grows great when old men plant trees under whose shade they know they shall never sit.” I try to design that way — for the next person, the next role, the next quarter. Solving the problem in front of me is fun. Leaving the system better than I found it is the actual job."
    },
    {
      title: "Interests",
      content: "Outside of work I’m either outside or inside something I shouldn’t have opened up. Camping, hiking, stargazing on one end; rebuilding old Game Boys, computers, and the occasional phone on the other. I drive my own cars when I should probably just take them to a shop — every repair is a free mechanical skill, the way I see it."
    },
    {
      title: "AI",
      content: "I use AI the way I use any sharp tool — to sketch faster, pressure-test ideas, and get unstuck. Most of this site was built with a frontier model as a collaborator: me handing over half-formed ideas, the model proposing, me pushing back when the answer was off, both of us iterating until it was right. The taste calls — what stays, what gets cut, what’s actually mine — never moved from me. The typing just got faster. I’m bullish on AI as design infrastructure (specs, code snippets, prototype scaffolding) and skeptical of AI as a substitute for craft. Used well it’s leverage. Used poorly it’s noise. The difference is taste, and that’s still the one thing the model can’t bring."
    }
  ]
};

export const projects = [
  {
    id: 'arcturus',
    title: 'Arcturus Design System',
    subtitle: 'Enterprise B2B SaaS',
    description: 'Co-leading a ground-up rebuild of an enterprise design system, re-centered on the end user.',
    tags: ['Design Systems', 'React', 'Figma'],
    year: '2025 — 2026',
    image: '/case-studies/arcturus/thumbnail.png',
    link: '/arcturus/'
  },
  {
    id: 'oklahoma-navigate',
    title: 'Oklahoma Navigate',
    subtitle: 'Product Enhancement Exploration',
    description: "Frequent-action-driven platform redesign. A design-first auto enthusiast's perspective on the online vehicle and document management platform.",
    tags: ['UX Exploration', 'Civic Tech', 'Before / After'],
    year: '2026',
    image: '/case-studies/oklahoma-navigate/thumbnail.png',
    link: '/oklahoma-navigate/'
  },
  {
    id: 'direct-deposit',
    title: 'Direct Deposit Redesign',
    subtitle: 'Fintech & Payroll',
    description: 'Rebuilding how millions of people set up where their paycheck lands — under a hard six-month deadline.',
    tags: ['Product Design', 'Fintech', 'Real-time Validation'],
    year: '2024 — 2025',
    image: '/case-studies/direct-deposit/thumbnail.png',
    link: '/direct-deposit/'
  }
];
