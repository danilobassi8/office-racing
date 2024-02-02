import { NavLink } from 'react-router-dom';
import { AddIcon } from '../icons/AddIcon';
import { HomeIcon } from '../icons/HomeIcon';
import { LeaderBoardIcon } from '../icons/LeaderBoardIcon';

const NAV_ITEMS = [
  { icon: <LeaderBoardIcon />, to: './leaderboard', tooltip: 'Leader board' },
  { icon: <HomeIcon />, to: './home', tooltip: 'Fechas' },
  { icon: <AddIcon />, to: './add', tooltip: 'Cargar Tiempo' },
];

export function SideNav() {
  return (
    <nav className="sidenav">
      {NAV_ITEMS.map((item) => (
        <div key={item.tooltip} className="nav-item">
          <NavLink to={item.to}> {item.icon}</NavLink>
        </div>
      ))}
    </nav>
  );
}
