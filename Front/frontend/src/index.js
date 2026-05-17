import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1E293B',
            color: '#F1F5F9',
            border: '1px solid #334155',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: '#0F172A' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#0F172A' } },
        }}
      />
    </ThemeProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();