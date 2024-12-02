import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PracticeProvider } from './PracticeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <PracticeProvider>
      <App />
    </PracticeProvider>
  </React.StrictMode>
);

reportWebVitals();
