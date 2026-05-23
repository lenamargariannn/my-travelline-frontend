import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  HiHome,
  HiGlobe,
  HiPhotograph,
  HiBookOpen,
  HiStar,
  HiCalendar,
  HiMail,
  HiLogout,
  HiCollection,
  HiTag,
} from 'react-icons/hi';

const sidebarLinks = [
  { to: '/', label: 'Dashboard', icon: HiHome, end: true },
  { to: '/tours', label: 'Tours', icon: HiGlobe, end: false },
  { to: '/categories', label: 'Categories', icon: HiTag, end: false },
  { to: '/destinations', label: 'Destinations', icon: HiCollection, end: false },
  { to: '/bookings', label: 'Bookings', icon: HiCalendar, end: false },
  { to: '/messages', label: 'Messages', icon: HiMail, end: false },
  { to: '/blog', label: 'Blog', icon: HiBookOpen, end: false },
  { to: '/gallery', label: 'Gallery', icon: HiPhotograph, end: false },
  { to: '/reviews', label: 'Reviews', icon: HiStar, end: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userName = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored).name : 'Admin';
    } catch {
      return 'Admin';
    }
  })();

  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-secondary-700 flex items-center gap-3">
          <img src="/logo.png" alt="My TravelLine" className="h-8 w-auto brightness-0 invert" />
          <div>
            <p className="text-xs text-secondary-400">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {sidebarLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-secondary-300 hover:bg-secondary-800 hover:text-white'
                    }`
                  }
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-secondary-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-secondary-400">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-secondary-400 hover:text-white hover:bg-secondary-800 transition-colors"
              title="Logout"
            >
              <HiLogout className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-secondary-200 flex items-center px-6">
          <h2 className="text-lg font-semibold text-secondary-800">Admin Dashboard</h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
