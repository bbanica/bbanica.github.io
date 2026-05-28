export const portfolioData = {
  personal: {
    name: "Dan Banica",
    title: "Lead Product Designer",
    tagline: "i build things and systems people want to keep using.",
    location: "Oklahoma",
    email: "hello@danbanica.com"
  },
  // Entries are grouped by company so multi-role employers (Paycom) appear once
  // with their roles listed under one card — visually closer to a LinkedIn timeline.
  // Single-role companies just have a one-item `roles` array.
  experience: [
    {
      company: "Paycom",
      logo: "/logos/paycom.png",
      period: "May 2023 – Present",
      roles: [
        {
          role: "Lead Product Designer",
          period: "Sep 2025 – Present",
          sub: "Platform, design systems, design engineering",
          description: "Lead role spanning platform UX, design systems, and design engineering. Captain of one of the original sprint teams for what became the most ambitious project in company history. Rollout design partner leading workshops, making systems decisions, and writing the code snippets that ship next to the specs. Mentoring three interns on the side."
        },
        {
          role: "Product Designer II",
          period: "May 2025 – Sep 2025",
          sub: "Core payroll, international banking, platform team",
          description: "Promoted into a wider scope across core payroll, international banking, and the platform team. Kept core releases moving while working on a company-wide redesign, and built a Payroll Design Team component library."
        },
        {
          role: "Associate Product Designer",
          period: "Aug 2024 – May 2025",
          sub: "Core payroll team",
          description: "Joined the core payroll team and quickly became a trusted resource. Led a Direct Deposit redesign with third party service integration (hard six-month legal deadline), orchestrated Tax Reporting and Tax Management platform building, led designs for an internal client billing hub, a daily payments program in partnership with VISA to help users avoid predatory payday loans, and more, all ahead of schedule. Was quickly put in for a promotion."
        },
        {
          role: "Product Design Intern",
          period: "May 2023 – Aug 2023",
          sub: "UI/UX — platform onboarding",
          description: "Three months on the platform team building an internal user-onboarding tool with 20+ stakeholders and interviewees, real research, a UX guide and a 20-component UI library shipped to back it. This project made it to production and is one of the most celebrated additions to the system."
        }
      ]
    },
    {
      company: "bluvector",
      logo: "/logos/bluvector.png",
      period: "Aug 2024 – Present",
      roles: [
        {
          role: "UX Developer",
          period: "Aug 2024 – Present",
          sub: "Dev & UI/UX — web-based games",
          description: "Designing and building web-based games on the side. This was my introduction to design engineering in the realm of video games, and the front-end skills I learned from doing this helped me tremendously in being a better engineering partner."
        }
      ]
    },
    {
      company: "UW Formula Motorsports",
      logo: "/logos/uw-formula.png",
      period: "Nov 2022 – May 2023",
      roles: [
        {
          role: "Graphic Designer",
          period: "Nov 2022 – May 2023",
          sub: "External marketing",
          description: "External marketing for UW's Formula SAE team: campaigns, sponsor decks, merch, and the visual language across socials."
        }
      ]
    },
    {
      company: "Lake Washington Institute of Technology",
      logo: "/logos/lwtech.png",
      period: "Jun 2021 – Mar 2022",
      roles: [
        {
          role: "Graphic Designer",
          period: "Jun 2021 – Mar 2022",
          sub: "Events, merchandise, marketing",
          description: "Leading design and marketing for three concurrent campaigns spanning physical and digital. Event collateral, merch, social. Campus event turnout went up 150% over prior years."
        }
      ]
    }
  ],
  about: [
    {
      title: "Background",
      content: "Born in Romania, moved to Washington in 2012, and fell into design about the time I was busy figuring out English. I started out by designing freelance logos, mockups, vector portraits, and shirt graphics before I could get an actual job. I didn't make much money, but $10 is a lot when you're young. I studied interaction design at the University of Washington while I freelanced, and I've been a product designer ever since."
    },
    {
      title: "Approach",
      content: "I believe in good-faith exchange of critique and information. One of my favorite quotes is “A society grows great when old men plant trees under whose shade they know they shall never sit.” I believe in generational stewardship, and in hearing what needs to be said. I love to solve problems, and I love to help others."
    },
    {
      title: "Interests",
      content: "Outside of work I'm either outside, or tinkering inside something I shouldn't have opened up. Camping, hiking, stargazing on one end, and rebuilding old Gameboys, computers, phones, computers, and more on the other. I drive and repair my own cars when I should probably just take them to a shop, but I love the pursuit of learning, and breaking things is a natural part of that cycle."
    },
    {
      // AI section is rendered as multi-paragraph; AboutSection splits on blank
      // lines and replaces **bold** runs with <strong>.
      title: "My take on AI workflows",
      content: `I use AI to help me build faster, not to think, and I am certainly not reliant on it. The quality of my work would not diminish if all AI ceased to exist tomorrow.

The design process is inherently human, and the value of design is higher than ever when the average person can build whatever they can think of. Design goes far beyond just pretty visuals. It requires a masterful blend of business acumen, research, product vision, craft, super broad large-scale thinking., and more.

In the mind of a great designer, there's infinite context floating around. Experiences, prior projects, personal interactions, memories, word of mouth, gut feelings, etc. There are countless conscious and subconscious pattern recognition and deliberate strategy exercises happening behind every single decision. Everyone's process is different.

When the average person prompts AI to make them something, they do not have the same mental model to pull from. Most don't think in the way that a designer, software architect, engineer, etc thinks. They have a different understanding of how things are shaped and used, and often times won't be able to foresee the major challenges that come with actually building a product.

I use **my** design expertise in tandem with AI's ability to help pull together resources to build something that I know and I can verify will be good.`
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
