import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toursApi, reviewsApi } from '@/api/endpoints';
import { useCurrency } from '@/hooks/useCurrency';
import TourCard from '@/components/ui/TourCard';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

export default function HomePage() {
  const { t } = useTranslation();
  const { selectedCurrency } = useCurrency();

  const { data: featuredTours } = useQuery({
    queryKey: ['tours', 'featured', selectedCurrency],
    queryFn: () => toursApi.getFeatured(selectedCurrency).then((res) => res.data),
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewsApi.getAll({ page: 0, size: 3 }).then((res) => res.data),
  });

  const whyUs = [
    { title: t('home.whyUs.safe.title'), desc: t('home.whyUs.safe.desc') },
    { title: t('home.whyUs.experts.title'), desc: t('home.whyUs.experts.desc') },
    { title: t('home.whyUs.quality.title'), desc: t('home.whyUs.quality.desc') },
    { title: t('home.whyUs.flexible.title'), desc: t('home.whyUs.flexible.desc') },
  ];

  const departureText = featuredTours?.[0]?.title ? 'Available Now' : 'Coming Soon';

  return (
    <PageShell>
      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 40px 60px',
        }}
      >
        {/* Cloud card — top-left: Next departure */}
        <div className="cloud-card cloud-depart">
          <div style={{ paddingTop: 26 }}>
            <T as="div" className="fc-lbl">
              <span className="pulse-dot" />
              {t('hero.card.departure.label')}
            </T>
            <T as="div" className="fc-val">{departureText}</T>
            <T as="div" className="fc-sub">{t('hero.card.departure.sub')}</T>
          </div>
        </div>

        {/* Cloud card — top-right: Traveler rating */}
        <div className="cloud-card cloud-rating">
          <div style={{ paddingTop: 32 }}>
            <T as="div" className="fc-lbl">{t('hero.card.rating.label')}</T>
            <T as="div" className="fc-val">
              4.9{' '}
              <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--ink-35)' }}>
                / 5.0
              </span>
            </T>
            <T as="div" className="fc-sub">{t('hero.card.rating.sub')}</T>
          </div>
        </div>

        {/* Cloud card — bottom-right: Destinations */}
        <div className="cloud-card cloud-dest">
          <div style={{ paddingTop: 26 }}>
            <T as="div" className="fc-lbl">{t('hero.card.destinations.label')}</T>
            <T as="div" className="fc-val">{t('hero.card.destinations.value')}</T>
            <T as="div" className="fc-sub">{t('hero.card.destinations.sub')}</T>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ textAlign: 'center', maxWidth: 680, animation: 'fadeUp 0.7s 0.1s ease both' }}>
          <T as="span" className="eyebrow" style={{ marginBottom: 20, display: 'inline-block' }}>{t('home.eyebrow')}</T>
          <h1
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 'clamp(42px, 6.2vw, 74px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: 'var(--ink)',
              marginTop: 16,
              marginBottom: 20,
            }}
          >
            <em style={{
              display: 'block', whiteSpace: 'nowrap', textAlign: 'center',
              fontWeight: 400, fontStyle: 'italic', color: '#1a5a7a',
              width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)',
            }}>
              <T>{t('hero.title1')}</T>
            </em>
            <span style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--teal)' }}>
              <T>{t('hero.title2')}</T>
            </span>
          </h1>
          <T as="p"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 15,
              fontWeight: 300,
              color: 'var(--ink-60)',
              maxWidth: 440,
              margin: '0 auto 36px',
              lineHeight: 1.75,
            }}
          >
            {t('hero.subtitle')}
          </T>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
            <Link to="/tours" className="btn-primary"><T>{t('common.exploreTours')}</T> →</Link>
            <Link to="/contact" className="btn-secondary"><T>{t('common.planYourTrip')}</T></Link>
          </div>
        </div>

        {/* Search bar + stats strip */}
        <div style={{ width: 'min(680px, 92%)', animation: 'fadeUp 0.7s 0.4s ease both' }}>
          {/* Search bar */}
          <div
            className="glass-strong"
            style={{ borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'stretch' }}
          >
            <div style={{ flex: 1, padding: '14px 20px', borderRight: '1px solid rgba(46,125,156,0.10)' }}>
              <T as="div" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-35)', marginBottom: 4 }}>
                {t('home.search.destination')}
              </T>
              <T as="div" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 13, color: 'var(--ink)' }}>{t('home.search.anywhere')}</T>
            </div>
            <div style={{ flex: 1, padding: '14px 20px', borderRight: '1px solid rgba(46,125,156,0.10)' }}>
              <T as="div" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-35)', marginBottom: 4 }}>
                {t('home.search.departure')}
              </T>
              <T as="div" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 13, color: 'var(--ink)' }}>{t('home.search.flexible')}</T>
            </div>
            <div style={{ flex: 1, padding: '14px 20px' }}>
              <T as="div" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 9.5, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-35)', marginBottom: 4 }}>
                {t('home.search.travelers')}
              </T>
              <T as="div" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 13, color: 'var(--ink)' }}>{t('home.search.onePerson')}</T>
            </div>
            <div style={{ padding: 8, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Link
                to="/tours"
                className="btn-primary"
                style={{ borderRadius: 8, padding: '10px 18px', fontSize: 13, whiteSpace: 'nowrap' }}
              >
                <T>{t('home.search.button')}</T>
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{
            borderRadius: '0 0 14px 14px',
            background: 'rgba(255,255,255,0.44)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}>
            {[
              { value: '850+', label: t('home.stats.toursLabel') },
              { value: '85+', label: t('home.stats.countriesLabel') },
              { value: '12K+', label: t('home.stats.travelersLabel') },
              { value: '4.9★', label: t('home.stats.ratingLabel') },
            ].map(({ value, label }, i) => (
              <div
                key={label}
                style={{
                  textAlign: 'center',
                  padding: '12px 0',
                  borderRight: i < 3 ? '1px solid rgba(46,125,156,0.08)' : 'none',
                }}
              >
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 20, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                  {value}
                </div>
                <T as="div" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 10, color: 'var(--ink-35)' }}>
                  {label}
                </T>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: 11.5,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: 'var(--ink-35)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            animation: 'bnc 1.6s ease-in-out infinite',
            whiteSpace: 'nowrap',
          }}
        >
          — SCROLL ↓
        </div>
      </section>

      {/* ── Featured Tours ── */}
      <section className="section">
        <div
          className="section-inner glass"
          style={{ padding: '56px 60px', borderRadius: 20 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <T as="span" className="eyebrow" style={{ marginBottom: 12, display: 'inline-block' }}>{t('home.featuredEyebrow')}</T>
            <T as="h2" className="section-h2">{t('home.featuredTours')}</T>
            <T as="p" className="section-sub" style={{ margin: '0 auto' }}>{t('home.featuredToursSubtitle')}</T>
          </div>

          {featuredTours && featuredTours.length > 0 ? (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 24,
                }}
              >
                {featuredTours.slice(0, 3).map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
              <div style={{ marginTop: 40, textAlign: 'center' }}>
                <Link to="/tours" className="btn-secondary">
                  <T>{t('common.viewAllTours')}</T> →
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Link to="/tours" className="btn-primary"><T>{t('common.exploreTours')}</T></Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="section">
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
            <div>
              <T as="span" className="eyebrow" style={{ marginBottom: 16, display: 'inline-block' }}>{t('home.whyUsEyebrow')}</T>
              <T as="h2" className="section-h2">{t('home.whyUsTitle')}</T>
              <T as="p" className="section-sub" style={{ marginTop: 16 }}>{t('home.whyUsBody')}</T>
              <div style={{ marginTop: 32 }}>
                <Link to="/contact" className="btn-primary"><T>{t('home.getInTouch')}</T></Link>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              {whyUs.map(({ title, desc }) => (
                <div key={title} className="glass" style={{ padding: '24px 20px', borderRadius: 12 }}>
                  <T as="h3"
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--ink)',
                      marginBottom: 8,
                    }}
                  >
                    {title}
                  </T>
                  <T as="p"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 12,
                      color: 'var(--ink-60)',
                      lineHeight: 1.6,
                    }}
                  >
                    {desc}
                  </T>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      {reviews && reviews.content && reviews.content.length > 0 && (
        <section className="section">
          <div
            className="section-inner glass"
            style={{ padding: '56px 60px', borderRadius: 20 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <T as="span" className="eyebrow" style={{ marginBottom: 12, display: 'inline-block' }}>{t('home.testimonialsEyebrow')}</T>
              <T as="h2" className="section-h2">{t('home.testimonials')}</T>
              <T as="p" className="section-sub" style={{ margin: '0 auto' }}>{t('home.testimonialsSubtitle')}</T>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 20,
              }}
            >
              {reviews.content.slice(0, 3).map((review) => (
                <div key={review.id} className="glass" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        style={{ fontSize: 14, color: i < review.rating ? '#f59e0b' : 'rgba(7,32,47,0.15)' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 14,
                      color: 'var(--ink-60)',
                      lineHeight: 1.7,
                      marginBottom: 20,
                      fontStyle: 'italic',
                    }}
                  >
                    &ldquo;{review.content}&rdquo;
                  </p>
                  <div>
                    <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
                      {review.authorName}
                    </p>
                    <p style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 12, color: 'var(--ink-35)', marginTop: 2 }}>
                      {review.authorLocation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="section">
        <div
          className="section-inner glass"
          style={{
            padding: '56px 48px',
            borderRadius: 20,
            textAlign: 'center',
            background: 'rgb(17 49 65 / 0.25)',
            borderColor: 'rgba(46,125,156,0.25)',
          }}
        >
          <T as="h2" className="section-h2" style={{ marginBottom: 12 }}>{t('home.ctaTitle')}</T>
          <T as="p" className="section-sub" style={{ margin: '0 auto 32px' }}>{t('home.ctaSubtitle')}</T>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            <Link to="/contact" className="btn-primary"><T>{t('common.contactUs')}</T></Link>
            <Link to="/tours" className="btn-secondary"><T>{t('common.browseTours')}</T></Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
