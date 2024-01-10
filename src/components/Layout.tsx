import { AppRoutes } from '../AppRoutes';
import { SideNav } from './Sidenav';

export function Layout() {
  return (
    <>
      <div className="layout w-100 h-100">
        <SideNav />
        <main className="content">
          <AppRoutes />
        </main>
      </div>
    </>
  );
}
