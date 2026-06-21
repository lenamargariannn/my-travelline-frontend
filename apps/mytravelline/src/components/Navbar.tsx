import { useState, useRef, useEffect } from 'react';
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

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { selectedCurrency, setCurrency } = useCurrency();
  const { triggerChange, busy } = useLangTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hasAnimated = useRef(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const current = i18n.language?.split('-')[0] ?? 'en';
  const currentLabel = LANGS.find(l => l.code === current)?.label ?? 'EN';

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  const changeLang = (code: string) => {
    if (!localStorage.getItem('currency_manually_set')) {
      setCurrency(LANG_CURRENCY[code] ?? 'USD');
    }
    setMenuOpen(false);
    setLangOpen(false);
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
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          height: 66,
          padding: '0 40px 0 80px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          background: scrolled ? 'rgba(255,255,255,0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.75)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(14,79,110,0.08)' : 'none',
          transition: 'background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease',
          animation: hasAnimated.current ? 'none' : 'slideDown 0.65s ease both',
        }}
      >
        {/* Logo — left */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', justifySelf: 'start' }}>
          <img src="/logo.svg" alt="MyTravelLine" style={{ height: 42 }} />
        </Link>

        {/* Nav links — true page center */}
        <div
          className="hidden md:flex"
          style={{ alignItems: 'center', gap: 32 }}
        >
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--teal)' : 'var(--ink-60)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                borderBottom: isActive ? '1.5px solid var(--teal)' : '1.5px solid transparent',
                paddingBottom: 2,
                transition: 'color 0.15s, border-color 0.15s',
              })}
            >
              <T>{label}</T>
            </NavLink>
          ))}
        </div>

        {/* Controls — right */}
        <div
          className="hidden md:flex"
          style={{ alignItems: 'center', gap: 8, justifySelf: 'end' }}
        >
          {/* Globe + language dropdown */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(v => !v)}
              disabled={busy}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--ink-60)',
                background: 'transparent',
                border: 'none',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.55 : 1,
                padding: '4px 6px',
                borderRadius: 6,
                transition: 'color 0.15s',
              }}
            >
              <GlobeIcon />
              {currentLabel}
            </button>

            {langOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'rgba(255,255,255,0.96)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.90)',
                  borderRadius: 10,
                  boxShadow: '0 8px 28px rgba(14,79,110,0.14)',
                  padding: '6px',
                  minWidth: 80,
                  zIndex: 30,
                }}
              >
                {LANGS.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => changeLang(code)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '7px 12px',
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: current === code ? 600 : 400,
                      color: current === code ? 'var(--teal)' : 'var(--ink)',
                      background: current === code ? 'rgba(14,79,110,0.07)' : 'transparent',
                      border: 'none',
                      borderRadius: 7,
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency */}
          <button
            onClick={cycleCurrency}
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--ink-60)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 6,
              transition: 'color 0.15s',
            }}
          >
            {selectedCurrency}
          </button>

          {/* Book Now — dark pill */}
          <Link
            to="/tours"
            style={{
              marginLeft: 4,
              fontFamily: "'Nunito', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              background: 'var(--orange)',
              borderRadius: 100,
              padding: '9px 22px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              boxShadow: '0 3px 14px rgba(203,41,18,0.28)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(203,41,18,0.42)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 3px 14px rgba(203,41,18,0.28)';
            }}
          >
            <T>{t('nav.bookNow')}</T>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, justifySelf: 'end', gridColumn: '3' }}
        >
          <span style={{ display: 'block', width: 24, height: 2, background: 'var(--ink)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'var(--ink)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'var(--ink)', borderRadius: 2 }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 66,
            left: 0,
            right: 0,
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderBottom: '1px solid rgba(255,255,255,0.75)',
            padding: '16px 24px 28px',
            zIndex: 19,
            boxShadow: '0 8px 32px rgba(7,32,47,0.10)',
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
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: current === code ? '1.5px solid var(--teal)' : '1.5px solid var(--ink-18)',
                  background: current === code ? 'rgba(14,79,110,0.08)' : 'transparent',
                  color: current === code ? 'var(--teal)' : 'var(--ink-60)',
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: 12,
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
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--ink-60)',
                background: 'transparent',
                border: '1.5px solid var(--ink-18)',
                borderRadius: 8,
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
                background: 'var(--orange)',
                borderRadius: 100,
                padding: '9px 22px',
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
