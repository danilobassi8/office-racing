import { SideNav } from './Sidenav';
import { GlobalContextProvider } from '../context/globalContext';
import { Outlet } from 'react-router-dom';

export function App() {
  return (
    <GlobalContextProvider>
      <div className="layout w-100 h-100">
        <SideNav />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </GlobalContextProvider>
  );
}
