import { AppRoutes } from '../AppRoutes';
import { SideNav } from './Sidenav';
import { GlobalContextProvider } from '../context/globalContext';

export function App() {
  return (
    <GlobalContextProvider>
      <div className="layout w-100 h-100">
        <SideNav />
        <main className="content">
          <AppRoutes />
        </main>
      </div>
    </GlobalContextProvider>
  );
}
