import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toursApi, reviewsApi } from '@/api/endpoints';
import { useCurrency } from '@/hooks/useCurrency';
import BookingForm from '@/components/forms/BookingForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { imageUrl } from '@/lib/imageUrl';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { selectedCurrency, formatPrice } = useCurrency();

  const { data: tour, isLoading } = useQuery({
    queryKey: ['tour', slug, selectedCurrency, lang],
    queryFn: () => toursApi.getBySlug(slug!, selectedCurrency).then((res) => res.data),
    enabled: !!slug,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', 'tour', tour?.id],
    queryFn: () => reviewsApi.getByTour(tour!.id).then((res) => res.data),
    enabled: !!tour?.id,
  });

  if (isLoading) {
    return (
      <PageShell>
        <LoadingSpinner />
      </PageShell>
    );
  }

  if (!tour) {
    return (
      <PageShell>
        <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--ink-60)' }}>
          <T>{t('tours.notFound')}</T>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* ── Above fold: 2-column ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '40px 40px 0',
          display: 'grid',
          gridTemplateColumns: '58fr 38fr',
          gap: 40,
          alignItems: 'start',
        }}
      >
        {/* Left — cover image */}
        <div>
          <div
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(7,32,47,0.18)',
              background: 'linear-gradient(135deg, rgba(14,79,110,0.20) 0%, rgba(14,79,110,0.30) 100%)',
            }}
          >
            {tour.coverImage ? (
              <img
                src={imageUrl(tour.coverImage)}
                alt={tour.title}
                style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 480 }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div style={{ height: 420 }} />
            )}
          </div>

          {tour.images && tour.images.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {tour.images.map((img) => (
                <div
                  key={img.id}
                  style={{ width: 80, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}
                >
                  <img
                    src={imageUrl(img.s3Key)}
                    alt={img.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — booking panel */}
        <div
          className="glass-strong"
          style={{
            borderRadius: 20,
            padding: 28,
            position: 'sticky',
            top: 86,
          }}
        >
          <h1
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.25,
              marginBottom: 16,
            }}
          >
            {tour.title}
          </h1>

          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 32,
                fontWeight: 800,
                color: 'var(--teal)',
                letterSpacing: '-0.02em',
              }}
            >
              {formatPrice(tour.convertedPrice ?? tour.price)}
            </span>
            <T as="span"
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontSize: 13,
                color: 'var(--ink-35)',
                marginLeft: 6,
              }}
            >
              {t('tours.perPerson')}
            </T>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 14, color: 'var(--ink-60)' }}>
              <T as="strong" style={{ color: 'var(--ink-35)', fontWeight: 500 }}>{t('tours.detail.durationLabel')}:</T>{' '}
              {tour.durationDays} <T>{tour.durationDays === 1 ? t('tours.day') : t('tours.days')}</T>
            </div>
            <div style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 14, color: 'var(--ink-60)' }}>
              <T as="strong" style={{ color: 'var(--ink-35)', fontWeight: 500 }}>{t('tours.detail.groupSizeLabel')}:</T>{' '}
              <T>{t('tours.maxPeople', { count: tour.maxGroupSize })}</T>
            </div>
            {tour.destinationName && (
              <div style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 14, color: 'var(--ink-60)' }}>
                <T as="strong" style={{ color: 'var(--ink-35)', fontWeight: 500 }}>{t('tours.detail.destinationLabel')}:</T>{' '}
                {tour.destinationName}
              </div>
            )}
            {tour.categoryName && (
              <div style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 14, color: 'var(--ink-60)' }}>
                <T as="strong" style={{ color: 'var(--ink-35)', fontWeight: 500 }}>{t('tours.detail.categoryLabel')}:</T>{' '}
                {tour.categoryName}
              </div>
            )}
          </div>

          <BookingForm tourId={tour.id} tourTitle={tour.title} />
        </div>
      </div>

      {/* ── Description ── */}
      <section className="section">
        <div
          className="section-inner glass"
          style={{ padding: '56px 60px', borderRadius: 20 }}
        >
          <T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 12 }}>{t('tours.detail.aboutEyebrow')}</T>
          <T as="h2" className="section-h2">{t('tours.aboutThisTour')}</T>
          <p
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 15,
              color: 'var(--ink-60)',
              lineHeight: 1.75,
              marginTop: 20,
              whiteSpace: 'pre-line',
            }}
          >
            {tour.description}
          </p>
        </div>
      </section>

      {/* ── Itinerary ── */}
      {tour.itineraryDays && tour.itineraryDays.length > 0 && (
        <section className="section">
          <div
            className="section-inner glass"
            style={{ padding: '56px 60px', borderRadius: 20 }}
          >
            <T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 12 }}>{t('tours.detail.dayByDay')}</T>
            <T as="h2" className="section-h2">{t('tours.itinerary')}</T>
            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column' }}>
              {tour.itineraryDays.map((day, idx) => (
                <div key={day.id}>
                  {idx > 0 && (
                    <div style={{ height: 1, background: 'var(--ink-18)', margin: '28px 0' }} />
                  )}
                  <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: 48,
                        fontWeight: 800,
                        color: 'var(--teal)',
                        lineHeight: 1,
                        flexShrink: 0,
                        width: 64,
                      }}
                    >
                      {day.dayNumber}
                    </div>
                    <div style={{ paddingTop: 6 }}>
                      <h3
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontSize: 18,
                          fontWeight: 600,
                          color: 'var(--ink)',
                          marginBottom: 8,
                        }}
                      >
                        {day.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Noto Sans', sans-serif",
                          fontSize: 15,
                          fontWeight: 300,
                          color: 'var(--ink-60)',
                          lineHeight: 1.75,
                        }}
                      >
                        {day.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews ── */}
      {reviews && reviews.length > 0 && (
        <section className="section">
          <div
            className="section-inner glass"
            style={{ padding: '56px 60px', borderRadius: 20 }}
          >
            <T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 12 }}>{t('tours.detail.reviewsEyebrow')}</T>
            <T as="h2" className="section-h2">{t('tours.travelerReviews')}</T>
            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviews.map((review) => (
                <div key={review.id} className="glass" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
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
                      fontStyle: 'italic',
                      lineHeight: 1.65,
                      marginBottom: 12,
                    }}
                  >
                    &ldquo;{review.content}&rdquo;
                  </p>
                  <p style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 12, color: 'var(--ink-35)' }}>
                    — {review.authorName}, {review.authorLocation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding: '0 40px 80px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <Link to="/tours" className="btn-secondary">&larr; <T>{t('common.back')}</T> to all tours</Link>
        </div>
      </section>
    </PageShell>
  );
}
