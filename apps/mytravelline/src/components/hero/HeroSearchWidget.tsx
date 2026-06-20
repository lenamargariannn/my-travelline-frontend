import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { destinationsApi, toursApi } from '@/api/endpoints';
import T from '@/components/ui/T';

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}


function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, pointerEvents: 'none' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const selectStyle: React.CSSProperties = {
  fontFamily: "'Noto Sans', sans-serif",
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--ink)',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  padding: 0,
  width: '100%',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Noto Sans', sans-serif",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--ink-35)',
  lineHeight: 1,
};

const stepBtn: React.CSSProperties = {
  width: 20, height: 20, flexShrink: 0,
  border: 'none',
  borderRadius: 6,
  background: 'var(--ink)',
  cursor: 'pointer',
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  lineHeight: 1, padding: 0,
  boxShadow: '0 2px 8px rgba(7,32,47,0.22)',
  transition: 'opacity 0.15s',
};

const LOCALE_MAP: Record<string, string> = { en: 'en-US', hy: 'hy-AM', ru: 'ru-RU' };

function buildMonthOptions(lang: string): { value: string; label: string }[] {
  const baseLang = lang.split('-')[0];
  const locale = LOCALE_MAP[lang] ?? LOCALE_MAP[baseLang] ?? 'en-US';
  const now = new Date();
  const options: { value: string; label: string }[] = [];
  for (let i = 0; i < 18; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    const label = d.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
    options.push({ value, label });
  }
  return options;
}

export default function HeroSearchWidget() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  const [destSlug, setDestSlug] = useState('');
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState(2);

  const handleDestChange = (slug: string) => {
    setDestSlug(slug);
    setDate(''); // reset date — available dates will reload for new destination
  };

  const handleDateChange = (d: string) => {
    setDate(d);
    if (!d) return;
    // if current destination won't be available on this date, clear it
    if (destSlug && availableDestSlugs && !availableDestSlugs.includes(destSlug)) {
      setDestSlug('');
    }
  };

  const { data: destinations } = useQuery({
    queryKey: ['destinations', lang],
    queryFn: () => destinationsApi.getAll().then(res => res.data),
  });

  const { data: availableDates } = useQuery({
    queryKey: ['available-dates', destSlug],
    queryFn: () => toursApi.getAvailableDates(destSlug || undefined).then(res => res.data),
  });

  const { data: availableDestSlugs } = useQuery({
    queryKey: ['available-destinations', date],
    queryFn: () => toursApi.getAvailableDestinations(date || undefined).then(res => res.data),
    enabled: !!date,
  });

  const allMonthOptions = buildMonthOptions(lang);
  const monthOptions = availableDates && availableDates.length > 0
    ? allMonthOptions.filter(o => availableDates.includes(o.value))
    : allMonthOptions;

  const filteredDestinations = (availableDestSlugs && date)
    ? (destinations ?? []).filter(d => availableDestSlugs.includes(d.slug))
    : (destinations ?? []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destSlug) params.set('destination', destSlug);
    if (date) params.set('startDate', date);
    params.set('travelers', String(travelers));
    navigate(`/tours?${params.toString()}`);
  };

  const fieldInner = (icon: React.ReactNode, labelKey: string, children: React.ReactNode, showChevron = false) => (
    <div style={{ padding: '10px 16px 8px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, ...labelStyle }}>
        {icon}
        <T>{t(labelKey)}</T>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        {showChevron && <span style={{ color: 'var(--ink-35)', display: 'flex', flexShrink: 0 }}><ChevronIcon /></span>}
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%', marginTop: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        flex: 1,
        minWidth: 0,
        background: 'rgba(255,255,255,0.62)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.90)',
        borderRadius: 20,
        boxShadow: '0 8px 40px rgba(14,79,110,0.13), inset 0 1px 0 rgba(255,255,255,0.95)',
        padding: '6px 20px',
        display: 'flex',
        gap: 0,
        alignItems: 'stretch',
      }}>

        {/* Destination */}
        <div style={{ flex: '2 1 0', minWidth: 0, borderRight: '1px solid rgba(14,79,110,0.10)' }}>
          {fieldInner(
            <LocationIcon />,
            'hero.search.fields.destination',
            <select
              value={destSlug}
              onChange={e => handleDestChange(e.target.value)}
              style={{ ...selectStyle, color: destSlug ? 'var(--ink)' : 'var(--ink-35)' }}
            >
              <option value="">{t('hero.search.anywhere')}</option>
              {filteredDestinations.map(d => (
                <option key={d.id} value={d.slug}>{d.name}</option>
              ))}
            </select>,
            true,
          )}
        </div>

        {/* Date */}
        <div style={{ flex: '1.4 1 0', minWidth: 0, borderRight: '1px solid rgba(14,79,110,0.10)' }}>
          {fieldInner(
            <CalendarIcon />,
            'hero.search.fields.date',
            <select
              value={date}
              onChange={e => handleDateChange(e.target.value)}
              style={{ ...selectStyle, color: date ? 'var(--ink)' : 'var(--ink-35)' }}
            >
              <option value="">{t('hero.search.selectDate')}</option>
              {monthOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>,
            true,
          )}
        </div>

        {/* Travelers */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ padding: '10px 16px 8px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 4 }}>
            <div style={labelStyle}>
              <T>{t('hero.search.fields.travelers')}</T>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <button style={stepBtn} onClick={() => setTravelers(v => Math.max(1, v - 1))}>−</button>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--ink)', minWidth: 16, textAlign: 'center', lineHeight: 1 }}>{travelers}</span>
              <button style={stepBtn} onClick={() => setTravelers(v => Math.min(20, v + 1))}>+</button>
            </div>
          </div>
        </div>

      </div>

      {/* Search button — outside */}
      <button
        onClick={handleSearch}
        style={{
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: "'Nunito', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: '#fff',
          background: 'var(--ink)',
          border: 'none',
          borderRadius: 14,
          padding: '0 28px',
          height: 56,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          boxShadow: '0 3px 14px rgba(7,32,47,0.22)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(7,32,47,0.34)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 14px rgba(7,32,47,0.22)'; }}
      >
        <SearchIcon />
        <T>{t('hero.search.button')}</T>
      </button>
    </div>
  );
}
