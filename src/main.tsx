import React from 'react';
import ReactDOM from 'react-dom/client';
import { OfficeRacing } from './pages/main';
import { BrowserRouter } from 'react-router-dom';

import './water.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <OfficeRacing />
    </BrowserRouter>
  </React.StrictMode>
);
