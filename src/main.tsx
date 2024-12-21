import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TripProvider } from './contexts/TripContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TripProvider>
      <App />
    </TripProvider>
  </React.StrictMode>
);
