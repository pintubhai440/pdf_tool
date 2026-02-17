import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async'; // 👈 यह Import करें
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    {/* 👇 App को HelmetProvider के अंदर रखें */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
