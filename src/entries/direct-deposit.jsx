import { createRoot } from 'react-dom/client';
import '../styles/global.css';
import { initAnalytics } from '../lib/events.js';
import DirectDepositPage from '../pages/DirectDepositPage.jsx';

initAnalytics();
createRoot(document.getElementById('root')).render(<DirectDepositPage />);
