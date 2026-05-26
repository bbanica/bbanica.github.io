import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import { initAnalytics } from '../lib/analytics.js';
import ArcturusPage from '../pages/ArcturusPage.jsx';

initAnalytics();
createRoot(document.getElementById('root')).render(<ArcturusPage />);
