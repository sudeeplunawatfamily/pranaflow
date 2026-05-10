import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Android Chrome's back-forward cache (bfcache) restores the full page from
// memory when the user returns via the app switcher or back button, bypassing
// all HTTP cache headers. Force a reload so the latest JS bundle is always used.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

// Register the service worker. On activation it clears all stale caches and
// posts SW_ACTIVATED to every open tab, triggering a reload to pick up the
// latest bundle — this reaches stale bfcache clients that pageshow alone cannot.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'SW_ACTIVATED') {
      window.location.reload();
    }
  });

  navigator.serviceWorker.register('/sw.js').catch(() => {
    // Silently ignore registration failures (e.g. private browsing mode).
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
