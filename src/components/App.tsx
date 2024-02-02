import { SideNav } from './Sidenav';
import { GlobalContextProvider } from '../context/globalContext';
import { Outlet } from 'react-router-dom';
import { PlayersDataContextProvider } from '../context/PlayersData';

export function App() {
  return (
    <GlobalContextProvider>
      <PlayersDataContextProvider>
        <div className="layout w-100 h-100">
          <SideNav />
          <main className="content">
            <Outlet />
          </main>
        </div>
      </PlayersDataContextProvider>
    </GlobalContextProvider>
  );
}
