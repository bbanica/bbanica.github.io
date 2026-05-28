import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import { initAnalytics } from '../lib/events.js';
import HomePage from '../pages/HomePage.jsx';

initAnalytics();
createRoot(document.getElementById('root')).render(<HomePage />);
