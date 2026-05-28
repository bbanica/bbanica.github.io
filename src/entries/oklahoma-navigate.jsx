import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import { initAnalytics } from '../lib/events.js';
import OklahomaNavigatePage from '../pages/OklahomaNavigatePage.jsx';

initAnalytics();
createRoot(document.getElementById('root')).render(<OklahomaNavigatePage />);
