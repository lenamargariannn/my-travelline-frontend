import { Link } from 'react-router-dom';
import HeroSearchWidget from '@/components/hero/HeroSearchWidget';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toursApi, reviewsApi } from '@/api/endpoints';
import { useCurrency } from '@/hooks/useCurrency';
import TourCard from '@/components/ui/TourCard';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { selectedCurrency } = useCurrency();

  const { data: featuredTours } = useQuery({
    queryKey: ['tours', 'featured', selectedCurrency, lang],
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

  return (
    <PageShell>
      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop: -66,
          padding: '146px 40px 80px 80px',
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Triangular gradient overlay — bottom-left anchor, fades to transparent near center */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: [
            'radial-gradient(ellipse 70% 90% at 0% 100%, rgba(248,250,252,0.92) 0%, rgba(248,250,252,0.74) 22%, rgba(248,250,252,0.50) 42%, rgba(248,250,252,0.22) 60%, rgba(248,250,252,0.06) 76%, transparent 90%)',
            'linear-gradient(to top right, rgba(248,250,252,0.68) 0%, rgba(248,250,252,0.38) 30%, rgba(248,250,252,0.10) 50%, transparent 65%)',
          ].join(', '),
        }} />

        {/* Hero text + search */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', animation: 'fadeUp 0.7s 0.1s ease both', position: 'relative', zIndex: 1, width: '100%', maxWidth: 'calc(50vw - 40px)' }}>
          <div style={{ maxWidth: 620 }}>
            <h1
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 'clamp(42px, 6.2vw, 74px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: 'var(--ink)',
                marginTop: 16,
                marginBottom: 36,
              }}
            >
              <em style={{
                display: 'block',
                fontWeight: 800, fontStyle: 'italic', color: 'var(--teal)',
              }}>
                <T>{t('hero.title1')}</T>
              </em>
              <span style={{ fontWeight: 800, fontStyle: 'italic', color: 'var(--teal)' }}>
                <T>{t('hero.title2')}</T>
              </span>
            </h1>
            <T as="p"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 15,
                fontWeight: 450,
                color: '#0E4F6E',
                maxWidth: 440,
                margin: '0 0 52px',
                lineHeight: 1.75,
              }}
            >
              {t('hero.subtitle')}
            </T>
          </div>
          <HeroSearchWidget />
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
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
            borderColor: 'rgba(14,79,110,0.25)',
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
