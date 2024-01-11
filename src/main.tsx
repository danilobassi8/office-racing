import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import { createHashRouter, RouterProvider, redirect } from 'react-router-dom';

import './styles/water.css';
import './styles/global.css';
import './styles/animations.css';

// TODO: move routes and lazy load
import { Home } from './pages/Home';
import { AddResult } from './pages/AddResult';
const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/add',
        element: <AddResult />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
  </>
);
