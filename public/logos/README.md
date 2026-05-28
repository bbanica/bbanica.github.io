# Experience logos

Drop square company logos (PNG, ~256×256, transparent background ideal) here.
Filenames referenced by `src/data/portfolio.js` → `experience[].logo`:

- `paycom.png`
- `bluvector.png`
- `uw-formula.png`
- `lwtech.png`

Until a file exists the Experience card renders a neutral briefcase icon
fallback (see `CompanyLogo` in `src/sections/ExperienceSection.jsx`), so the
layout stays intact even when a logo is missing.
