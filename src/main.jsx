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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
