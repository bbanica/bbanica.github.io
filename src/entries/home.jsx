import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import { initAnalytics } from '../lib/analytics.js';
import HomePage from '../pages/HomePage.jsx';

initAnalytics();
createRoot(document.getElementById('root')).render(<HomePage />);
