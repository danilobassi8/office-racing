import { NavLink } from 'react-router-dom';
import { AddIcon } from '../icons/AddIcon';
import { HomeIcon } from '../icons/HomeIcon';

const NAV_ITEMS = [
  { icon: <HomeIcon />, to: '', tooltip: 'Menu' },
  { icon: <AddIcon />, to: 'add', tooltip: 'Add data' },
];

export function SideNav() {
  return (
    <nav className="sidenav">
      {NAV_ITEMS.map((item) => (
        <div className="nav-item">
          <NavLink to={item.to}> {item.icon}</NavLink>
        </div>
      ))}
    </nav>
  );
}
