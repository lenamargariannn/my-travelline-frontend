import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

const TEAM = [
  { name: 'Anna Petrosyan', role: 'Founder & CEO', initials: 'AP' },
  { name: 'David Harutyunyan', role: 'Head of Operations', initials: 'DH' },
  { name: 'Mariam Grigoryan', role: 'Travel Designer', initials: 'MG' },
  { name: 'Armen Mkrtchyan', role: 'Local Expert', initials: 'AM' },
  { name: 'Narine Sargsyan', role: 'Customer Success', initials: 'NS' },
];

const STAT_VALUES = ['15', '85+', '12K+', '4.9★'];
const STAT_KEYS = ['about.stats.years', 'about.stats.destinations', 'about.stats.travelers', 'about.stats.rating'] as const;

export default function AboutPage() {
  const { t } = useTranslation();
  const STATS = STAT_KEYS.map((key, i) => ({ value: STAT_VALUES[i], label: t(key) }));

  return (
    <PageShell>
      {/* ── Hero panel: 2-column ── */}
      <section className="section" style={{ animation: 'fadeUp 0.7s ease both' }}>
        <div
          className="section-inner glass"
          style={{ padding: '56px 60px', borderRadius: 20 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 64,
              alignItems: 'center',
            }}
          >
            {/* Left — editorial text */}
            <div>
              <T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 16 }}>{t('about.storyEyebrow')}</T>
              <T as="h1"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 'clamp(36px, 5vw, 60px)',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: 20,
                }}
              >
                {t('about.hero.title')}
              </T>
              <T as="p"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 300,
                  color: 'var(--ink-60)',
                  lineHeight: 1.75,
                  marginBottom: 12,
                }}
              >
                {t('about.story.p1')}
              </T>
              <T as="p"
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 300,
                  color: 'var(--ink-60)',
                  lineHeight: 1.75,
                  marginBottom: 32,
                }}
              >
                {t('about.story.p2')}
              </T>
              <Link to="/contact" className="btn-primary"><T>{t('about.cta.button')}</T> →</Link>
            </div>

            {/* Right — 2×2 stat grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="glass"
                  style={{
                    padding: '32px 24px',
                    textAlign: 'center',
                    borderRadius: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: 44,
                      fontWeight: 800,
                      color: 'var(--teal)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {value}
                  </div>
                  <T as="div"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 300,
                      color: 'var(--ink-60)',
                    }}
                  >
                    {label}
                  </T>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section">
        <div
          className="section-inner glass"
          style={{ padding: '56px 60px', borderRadius: 20 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 12 }}>{t('about.valuesEyebrow')}</T>
            <T as="h2" className="section-h2">{t('about.values.title')}</T>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
            }}
          >
            {[
              { title: t('about.values.expertCurated'), desc: t('about.values.expertCuratedDesc') },
              { title: t('about.values.personalized'), desc: t('about.values.personalizedDesc') },
              { title: t('about.values.safeSecure'), desc: t('about.values.safeSecureDesc') },
              { title: t('about.values.unforgettable'), desc: t('about.values.unforgettableDesc') },
            ].map(({ title, desc }) => (
              <div key={title} className="glass" style={{ padding: '28px 24px', borderRadius: 14 }}>
                <T as="h3"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    marginBottom: 10,
                  }}
                >
                  {title}
                </T>
                <T as="p"
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontSize: 13,
                    color: 'var(--ink-60)',
                    lineHeight: 1.65,
                  }}
                >
                  {desc}
                </T>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team section ── */}
      <section className="section">
        <div
          className="section-inner glass"
          style={{ padding: '56px 60px', borderRadius: 20 }}
        >
          <div style={{ marginBottom: 36 }}>
            <T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 12 }}>{t('about.teamEyebrow')}</T>
            <T as="h2" className="section-h2">{t('about.teamTitle')}</T>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 20,
              overflowX: 'auto',
              paddingBottom: 8,
            }}
          >
            {TEAM.map(({ name, role, initials }) => (
              <div
                key={name}
                className="card"
                style={{
                  minWidth: 180,
                  flexShrink: 0,
                  padding: '24px 20px',
                  textAlign: 'center',
                  borderRadius: 14,
                  overflow: 'visible',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(46,125,156,0.15)',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    fontSize: 20,
                    color: 'var(--teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  {initials}
                </div>
                <h4
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: 4,
                  }}
                >
                  {name}
                </h4>
                <p
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 300,
                    color: 'var(--ink-60)',
                  }}
                >
                  {role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div
          className="section-inner glass"
          style={{
            padding: '52px 48px',
            borderRadius: 20,
            textAlign: 'center',
            background: 'rgba(46,125,156,0.10)',
            borderColor: 'rgba(46,125,156,0.25)',
          }}
        >
          <T as="h2" className="section-h2" style={{ marginBottom: 12 }}>{t('about.cta.title')}</T>
          <T as="p" className="section-sub" style={{ margin: '0 auto 32px' }}>{t('about.cta.subtitle')}</T>
          <Link to="/contact" className="btn-primary"><T>{t('about.cta.button')}</T></Link>
        </div>
      </section>
    </PageShell>
  );
}
