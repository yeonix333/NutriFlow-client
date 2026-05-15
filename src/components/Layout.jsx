import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Головна', end: true },
  { to: '/meals', label: 'Прийоми їжі' },
  { to: '/products', label: 'Продукти' },
  { to: '/analytics', label: 'Аналітика' },
  { to: '/ai', label: 'AI' },
  { to: '/profile', label: 'Профіль' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
    return () => document.body.classList.remove('nav-open');
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`app-shell${menuOpen ? ' menu-open' : ''}`}>
      {!menuOpen && (
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(true)}
          aria-expanded={false}
          aria-controls="app-sidebar"
          aria-label="Відкрити меню"
        >
          <span className="mobile-menu-icon" aria-hidden />
        </button>
      )}

      <div
        className="sidebar-backdrop"
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      <aside id="app-sidebar" className="sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <span className="brand-icon">🥗</span>
            <div>
              <strong>NutriFlow</strong>
              <small>трекер харчування</small>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={closeMenu}
            aria-label="Закрити меню"
          >
            ×
          </button>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="user-name">{user?.name}</p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Вийти
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
