import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';

import './styles/water.css';
import './styles/global.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);
