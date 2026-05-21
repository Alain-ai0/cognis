import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowseRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* nest the application router within the custom ThemeProvider layer so theme status flags scale across all paths cleanly */}
    <BrowseRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowseRouter>
  </React.StrictMode>
);
