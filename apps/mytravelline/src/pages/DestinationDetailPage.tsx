import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { destinationsApi, toursApi } from '@/api/endpoints';
import { useCurrency } from '@/hooks/useCurrency';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { imageUrl } from '@/lib/imageUrl';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { selectedCurrency, formatPrice } = useCurrency();

  const { data: destination, isLoading } = useQuery({
    queryKey: ['destination', slug],
    queryFn: () => destinationsApi.getBySlug(slug!).then((res) => res.data),
    enabled: !!slug,
  });

  const { data: tours } = useQuery({
    queryKey: ['tours', 'destination', slug, selectedCurrency],
    queryFn: () => toursApi.getAll({ destination: slug!, page: 0, size: 6, currency: selectedCurrency }).then((res) => res.data),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <PageShell>
        <LoadingSpinner />
      </PageShell>
    );
  }

  if (!destination) {
    return (
      <PageShell>
        <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--ink-60)' }}>
          <T>{t('destinations.notFound')}</T>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Hero strip — full-width 560px */}
      <div style={{ position: 'relative', height: 560, overflow: 'hidden' }}>
        {destination.coverImage ? (
          <img
            src={imageUrl(destination.coverImage)}
            alt={destination.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(165deg, #c8e6f7 0%, #a8d4ee 50%, #5aadd4 100%)' }} />
        )}
        {/* Bottom gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7,32,47,0.55) 0%, transparent 60%)',
          }}
        />
        {/* Destination name overlay — centered */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 700,
              color: '#fff',
              textAlign: 'center',
              textShadow: '0 2px 20px rgba(7,32,47,0.40)',
            }}
          >
            {destination.name}
          </h1>
        </div>
      </div>

      {/* 2-column layout below */}
      <section className="section">
        <div
          className="section-inner"
          style={{
            display: 'grid',
            gridTemplateColumns: '60fr 36fr',
            gap: 40,
            alignItems: 'start',
          }}
        >
          {/* Left — editorial prose */}
          <div
            className="glass"
            style={{ padding: '48px 52px', borderRadius: 20 }}
          >
            <T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 12 }}>{t('destinations.detail.aboutEyebrow', { name: destination.name })}</T>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginBottom: 20 }}>
              <T>{t('destinations.detail.discoverHeading', { name: destination.name })}</T>
            </h2>
            {destination.description ? (
              <p
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontSize: 16,
                  color: 'var(--ink-60)',
                  lineHeight: 1.85,
                  fontWeight: 400,
                }}
              >
                {destination.description}
              </p>
            ) : (
              <T as="p" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 16, color: 'var(--ink-60)', lineHeight: 1.85 }}>
                {t('destinations.detail.fallbackDesc', { name: destination.name, country: destination.country })}
              </T>
            )}
          </div>

          {/* Right — sticky tour sidebar */}
          <div className="glass" style={{ padding: '36px 28px', borderRadius: 16, position: 'sticky', top: 86 }}>
            <T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 16 }}>{t('destinations.detail.availableTours')}</T>

            {tours && tours.content.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {tours.content.map((tour) => (
                  <Link
                    key={tour.id}
                    to={`/tours/${tour.slug}`}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      textDecoration: 'none',
                      padding: '10px 0',
                      borderBottom: '1px solid var(--ink-18)',
                    }}
                  >
                    <div style={{ width: 80, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'rgba(46,125,156,0.12)' }}>
                      {tour.coverImage && (
                        <img
                          src={imageUrl(tour.coverImage)}
                          alt={tour.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--ink)',
                        lineHeight: 1.3,
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {tour.title}
                      </h4>
                      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>
                        {formatPrice(tour.convertedPrice ?? tour.price)}
                      </div>
                      <div style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 11, color: 'var(--ink-35)', marginTop: 1 }}>
                        {tour.durationDays} days
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 14, color: 'var(--ink-60)' }}>
                No tours available for this destination yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
