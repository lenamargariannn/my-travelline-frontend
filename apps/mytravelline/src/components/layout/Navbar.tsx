import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/tours', label: t('nav.tours') },
    { to: '/destinations', label: t('nav.destinations') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav className="bg-[#E8F4F8] sticky top-0 z-50">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="My TravelLine" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-secondary-600 hover:text-primary-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side: language switcher + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/tours" className="btn-primary btn-sm">
              {t('nav.bookNow')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-secondary-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-secondary-100">
            <div className="flex flex-col space-y-3 pt-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-secondary-600 hover:bg-secondary-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="px-3">
                <LanguageSwitcher />
              </div>
              <Link
                to="/tours"
                onClick={() => setIsOpen(false)}
                className="btn-primary btn-sm text-center mx-3"
              >
                {t('nav.bookNow')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
