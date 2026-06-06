import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/hooks/useCurrency';
import { useLangTransition } from '@/context/LanguageTransitionContext';
import T from '@/components/ui/T';
import type { CurrencyCode } from '@/utils/currency';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'hy', label: 'HY' },
  { code: 'ru', label: 'RU' },
] as const;

const LANG_CURRENCY: Record<string, CurrencyCode> = { en: 'USD', hy: 'AMD', ru: 'RUB' };
const CURRENCIES: CurrencyCode[] = ['USD', 'AMD', 'RUB'];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { selectedCurrency, setCurrency } = useCurrency();
  const { triggerChange, busy } = useLangTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hasAnimated = useRef(false);
  const current = i18n.language?.split('-')[0] ?? 'en';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    hasAnimated.current = true;
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const changeLang = (code: string) => {
    if (!localStorage.getItem('currency_manually_set')) {
      setCurrency(LANG_CURRENCY[code] ?? 'USD');
    }
    setMenuOpen(false);
    triggerChange(code);
  };

  const cycleCurrency = () => {
    const idx = CURRENCIES.indexOf(selectedCurrency);
    const next = CURRENCIES[(idx + 1) % CURRENCIES.length];
    setCurrency(next);
    localStorage.setItem('currency_manually_set', '1');
  };

  const navLinks = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/tours', label: t('nav.tours'), end: false },
    { to: '/destinations', label: t('nav.destinations'), end: false },
    { to: '/gallery', label: t('nav.gallery'), end: false },
    { to: '/blog', label: t('nav.blog'), end: false },
    { to: '/about', label: t('nav.about'), end: false },
    { to: '/contact', label: t('nav.contact'), end: false },
  ];

  return (
    <>
      <div className="nav-wrapper">
        <nav
          className="nav-pill flex items-center"
          style={{
            height: 60,
            padding: '0 24px',
            background: scrolled ? 'rgb(255 255 255 / 0.70)' : 'rgb(255 255 255 / 0.60)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.90)',
            borderRadius: 18,
            boxShadow: scrolled
              ? '0 8px 36px rgba(46,125,156,0.20), 0 2px 6px rgba(46,125,156,0.10), inset 0 1px 0 rgba(255,255,255,0.95)'
              : '0 6px 28px rgba(46,125,156,0.14), 0 1px 4px rgba(46,125,156,0.07), inset 0 1px 0 rgba(255,255,255,0.90)',
            animation: hasAnimated.current ? 'none' : 'slideDown 0.65s ease both',
            transition: 'box-shadow 0.3s ease, background 0.3s ease',
          }}
        >
          <Link to="/" className="mr-8 flex-shrink-0">
            <img src="/logo.svg" alt="MyTravelLine" style={{ height: 34 }} />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={({ isActive }) => ({
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--teal)' : 'var(--ink-60)',
                  textDecoration: 'none',
                  borderBottom: isActive ? '1.5px solid var(--teal)' : '1.5px solid transparent',
                  paddingBottom: 2,
                  transition: 'color 0.15s, border-color 0.15s',
                  whiteSpace: 'nowrap',
                })}
              >
                <T>{label}</T>
              </NavLink>
            ))}
          </div>

          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => changeLang(code)}
                disabled={busy}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: current === code ? '1.5px solid var(--teal)' : '1.5px solid transparent',
                  background: current === code ? 'rgba(46,125,156,0.10)' : 'transparent',
                  color: current === code ? 'var(--teal)' : 'var(--ink-60)',
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: busy ? 'not-allowed' : 'pointer',
                  opacity: busy ? 0.55 : 1,
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}

            <div style={{ width: 1, height: 20, background: 'var(--ink-18)', margin: '0 4px' }} />

            <button
              onClick={cycleCurrency}
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--teal)',
                background: 'rgba(46,125,156,0.08)',
                border: '1px solid rgba(46,125,156,0.20)',
                borderRadius: 100,
                padding: '4px 12px',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {selectedCurrency}
            </button>

            <Link
              to="/tours"
              style={{
                marginLeft: 8,
                fontFamily: "'Nunito', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: '#fff',
                background: 'var(--red)',
                borderRadius: 8,
                padding: '8px 20px',
                textDecoration: 'none',
                boxShadow: '0 3px 14px rgba(203,41,18,0.28)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <T>{t('nav.bookNow')}</T>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="ml-auto md:hidden flex flex-col justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
          >
            <span style={{ display: 'block', width: 24, height: 2, background: 'var(--ink)', borderRadius: 2, transition: 'transform 0.2s' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: 'var(--ink)', borderRadius: 2, transition: 'opacity 0.2s' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: 'var(--ink)', borderRadius: 2, transition: 'transform 0.2s' }} />
          </button>
        </nav>
      </div>

      {/* Mobile menu — fixed below the pill wrapper (10px padding + 56px nav + 10px padding = 76px on mobile, 80px on desktop) */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            left: 0,
            right: 0,
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderBottom: '1px solid rgba(255,255,255,0.75)',
            padding: '16px 24px 24px',
            zIndex: 19,
            boxShadow: '0 8px 32px rgba(7,32,47,0.12)',
          }}
        >
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'block',
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 15,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--teal)' : 'var(--ink)',
                textDecoration: 'none',
                padding: '10px 0',
                borderBottom: '1px solid rgba(7,32,47,0.06)',
              })}
            >
              <T>{label}</T>
            </NavLink>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => changeLang(code)}
                disabled={busy}
                style={{
                  width: 40,
                  height: 32,
                  borderRadius: 8,
                  border: current === code ? '1.5px solid var(--teal)' : '1.5px solid rgba(7,32,47,0.18)',
                  background: current === code ? 'rgba(46,125,156,0.10)' : 'transparent',
                  color: current === code ? 'var(--teal)' : 'var(--ink-60)',
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: busy ? 'not-allowed' : 'pointer',
                  opacity: busy ? 0.55 : 1,
                }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={cycleCurrency}
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--teal)',
                background: 'rgba(46,125,156,0.08)',
                border: '1px solid rgba(46,125,156,0.20)',
                borderRadius: 100,
                padding: '6px 14px',
                cursor: 'pointer',
              }}
            >
              {selectedCurrency}
            </button>
            <Link
              to="/tours"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: '#fff',
                background: 'var(--red)',
                borderRadius: 8,
                padding: '8px 20px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <T>{t('nav.bookNow')}</T>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
