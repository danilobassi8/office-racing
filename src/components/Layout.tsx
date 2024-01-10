import { AppRoutes } from '../AppRoutes';
import { SideNav } from './Sidenav';

export function Layout() {
  return (
    <>
      <SideNav />
      <main className='content'>
        <AppRoutes />
      </main>
    </>
  );
}
