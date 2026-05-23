export const portfolioData = {
  personal: {
    name: "Dan Banica",
    title: "Lead Product Designer",
    tagline: "i build things and systems people want to keep using.",
    location: "Oklahoma",
    email: "hello@danbanica.com"
  },
  experience: [
    { company: "Paycom", role: "Lead Product Designer", period: "2023 – Present", description: "Started as an intern, quickly gained trust and ownership and grew into a lead designer role. Responsible for 200+ successful feature releases for complex payroll, international banking, asset management, direct deposit, and agentic AI workflows. Strong focus on mentorship and building others up alongside me." },
    { company: "UW Formula Motorsports, LWTech, various others", role: "Graphic Designer", period: "2021 – 2023", description: "Honed my visual design skills in various different industries. It was a lot of fun but I felt the need for a greater challenge. Focused on my product thinking, prototyping, and design systems skills as I transitioned." },
    { company: "Freelance", role: "Designer", period: "2012 – 2021", description: "Got paid to discover myself in every medium I dared — graphic design, video production, merchandising, events & marketing, video game development, product design, branding, industrial design, automotive design, and more. Developed my passions and skills, met lots of great people, learned lots of hard lessons." }
  ],
  about: [
    { title: "Background", content: "I was born in Romania, moved to Washington in 2012, and fell in love with design around the same time. I got my start doing freelance logos, website mockups, shirts, and vector portraits, freelancing before I was old enough to get my first real job. While doing graphic design work, I studied interaction design at the University of Washington. I have been a career product designer and problem solver ever since." },
    { title: "Approach", content: "I believe in good-faith exchange of critique and information. One of my favorite quotes is “A society grows great when old men plant trees under whose shade they know they shall never sit.” I believe in generational stewardship, and in hearing what needs to be said. I love to solve problems, and I love to help others." },
    { title: "Interests", content: "In my spare time I enjoy exploring the great outdoors — camping, hiking, stargazing. I’m also a tinkerer, with a history of building, repairing, and refurbishing old electronics, from computers to Game Boys to phones. I enjoy working on and driving my cars, and I’m always looking to learn more mechanical skills." }
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
