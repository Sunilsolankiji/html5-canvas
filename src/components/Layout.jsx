import { NavLink, Outlet } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import '../styles/layout.css';

function Layout() {
  return (
    <div className="app">
      <nav className="sidebar">
        <h1>🎨 Canvas Playground</h1>
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <p>Click a shape to explore!</p>
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
