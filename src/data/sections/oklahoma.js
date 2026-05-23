// Body content for the Oklahoma Navigate case study. Single source of truth,
// imported by the page (rendering) and the search index (full-text search).
export const IMG = '/case-studies/oklahoma-navigate/';

export const sections = [
  {
    n: 1,
    title: 'The portal shouldn’t be an island',
    blocks: [
      { type: 'text', text: 'You can’t find any relevant FAQ in the website or helpful quick links once you’ve logged in. The “Navigate” portal is an island secluded away from everything else. If you want to know how you can request vanity plates, change your address, renew your registration, and more — you have to Google it, find it on the website, and follow a link. If you had already logged in, then clicking this link will log you out of Navigate because you can’t have multiple sessions open simultaneously.' },
      { type: 'figures', items: [{ src: `${IMG}figure-1a.png`, label: 'Figure 1a.', caption: 'The Navigate portal today.' }] },
      { type: 'text', text: 'The simple fix here in my opinion is adding that layer of navigation to the portal, having some quick links for most frequently taken actions, and adding a search bar that displays relevant related things to a search.' },
      { type: 'figures', items: [{ src: `${IMG}figure-1b.png`, label: 'Figure 1b.', caption: 'A proposed redesign.' }] },
      { type: 'text', text: 'The search would have to be fleshed out a bit so that it’s not frustrating, by making it so that it knows what users mean when they misspell things, have a multitude of key-words tied to different processes, and more. Even a more basic quick-links section categorized by “changes to my vehicles” and “changes to my ID” would be a good start.' },
    ],
  },
  {
    n: 2,
    title: 'The inbox should function like an inbox',
    blocks: [
      { type: 'text', text: 'Notifications are buried and unclear in the “Action Center” tab, and there’s no way to manage it like a proper inbox. You also have to click each of the individual messages one-by-one to clear them from a notifications icon.' },
      { type: 'figures', items: [
        { src: `${IMG}figure-2a.png`, label: 'Figure 2a.', caption: 'The Messages page today.' },
        { src: `${IMG}figure-2b.png`, label: 'Figure 2b.', caption: 'Being transported to another page to clear notifications one at a time.' },
      ] },
      { type: 'text', text: 'I would consolidate all notifications in a top-level section that allows access to a less “you must read this” type of inbox, given the fact that all notifications also get emailed to the user. We can reserve those alerts and notifications for truly critical things like upcoming and expired renewals, policy changes, and others.' },
      { type: 'figures', items: [{ src: `${IMG}figure-2c.png`, label: 'Figure 2c.', caption: 'A consolidated inbox.' }] },
      { type: 'text', text: 'I also believe that the inbox is important enough to justify having a place in the header. It could also go in the account dropdown under a “my inbox” page, but I chose to make it into a separate button for emphasis, and because the dashboard Action Center insights don’t travel with the user across the entire website.' },
    ],
  },
  {
    n: 3,
    title: 'The 2FA situation',
    blocks: [
      { type: 'text', text: 'You have to sign in through a code sent to your email every single time, sometimes multiple times per session if you’ve navigated away. This floods the inbox and desensitizes users to emails from Navigate.' },
      { type: 'figures', items: [
        { src: `${IMG}figure-3a.png`, label: 'Figure 3a.', caption: 'Signing in with an emailed code.' },
        { src: `${IMG}figure-3b.png`, label: 'Figure 3b.', caption: 'Attempting to open another tab.' },
      ] },
      { type: 'text', text: 'I would instead opt for a text-messaging 2FA, an authenticator app connection, and/or a user-set PIN code.' },
      { type: 'figures', items: [{ src: `${IMG}figure-3c.png`, label: 'Figure 3c.', caption: 'Choosing a 2FA method.' }] },
      { type: 'text', text: 'This allows for flexibility in preference and avoiding having to inform users to check their spam folder, while keeping the portal secure.' },
    ],
  },
  {
    n: 4,
    title: 'Expand in place & search',
    blocks: [
      { type: 'text', text: 'Nearly every action navigates to a different page rather than opening up expandables. On slow connections, this is crippling. The website is having to re-load in most of the same assets that already existed on the previous page — header, footer, nav, icons, stylesheets, etc.' },
      { type: 'text', text: 'What’s more, the filtering functionality is ambiguous. It presents like a search bar, but is not. We could solve the problem of the 2FA expiration as well as better nav here, by allowing users to search the useful information we already present prior to them logging in.' },
      { type: 'figures', items: [{ src: `${IMG}figure-4a.png`, label: 'Figure 4a.', caption: 'The current filtering, which looks like a search bar.' }] },
      { type: 'text', text: 'My proposal allows for easy searching, both for those that know what they’re looking for, and those that don’t. If I had to guess, I would assume that people log into this portal because they already know exactly what they’re looking for. We should give them the ability to find that as naturally as possible.' },
      { type: 'figures', items: [{ src: `${IMG}figure-4b.png`, label: 'Figure 4b.', caption: 'Search with suggested questions.' }] },
      { type: 'text', text: 'This also borrows Google’s infamous “suggested questions” cards. It allows users one more chance to see if they can find the relevant information before they navigate away.' },
    ],
  },
];
