import { useState } from 'react';
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
  HiMenu,
  HiX,
} from 'react-icons/hi';
import { useAuth } from '@/hooks/useAuth';

const sidebarLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: HiHome },
  { to: '/tours', label: 'Tours', icon: HiGlobe },
  { to: '/categories', label: 'Categories', icon: HiTag },
  { to: '/destinations', label: 'Destinations', icon: HiCollection },
  { to: '/bookings', label: 'Bookings', icon: HiCalendar },
  { to: '/contacts', label: 'Contacts', icon: HiMail },
  { to: '/blog', label: 'Blog', icon: HiBookOpen },
  { to: '/gallery', label: 'Gallery', icon: HiPhotograph },
  { to: '/reviews', label: 'Reviews', icon: HiStar },
];

function SidebarNav({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <nav className="flex-1 py-4 overflow-y-auto">
      <ul className="space-y-1 px-3">
        {sidebarLinks.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              onClick={onLinkClick}
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
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.name?.[0]?.toUpperCase() ?? 'A';

  const sidebarContent = (
    <>
      <div className="p-5 border-b border-secondary-700 flex items-center gap-3 shrink-0">
        <img src="/logo.png" alt="My TravelLine" className="h-8 w-auto brightness-0 invert" />
        <p className="text-xs text-secondary-400 font-medium tracking-wide uppercase">Admin</p>
      </div>

      <SidebarNav onLinkClick={() => setMobileOpen(false)} />

      <div className="p-4 border-t border-secondary-700 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-secondary-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-secondary-400 hover:text-white hover:bg-secondary-800 transition-colors"
            title="Logout"
          >
            <HiLogout className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-secondary-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-secondary-900 text-white flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-secondary-900 text-white flex flex-col z-50">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-secondary-200 flex items-center px-4 shrink-0">
          <button
            className="md:hidden p-2 mr-2 text-secondary-600 hover:text-secondary-900 rounded-lg"
            onClick={() => setMobileOpen(true)}
          >
            {mobileOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
          </button>
          <h2 className="text-base font-semibold text-secondary-800">MyTravelLine Admin</h2>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
