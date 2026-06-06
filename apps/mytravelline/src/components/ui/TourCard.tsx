import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TourSummary } from '@my-travelline/shared';
import { imageUrl } from '@/lib/imageUrl';
import { useCurrency } from '@/hooks/useCurrency';

interface TourCardProps {
  tour: TourSummary;
}

export default function TourCard({ tour }: TourCardProps) {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <Link to={`/tours/${tour.slug}`} className="card" style={{ display: 'block' }}>
      {/* Image */}
      <div style={{ height: 210, overflow: 'hidden', position: 'relative' }}>
        {tour.coverImage ? (
          <img
            src={imageUrl(tour.coverImage)}
            alt={tour.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(46,125,156,0.20) 0%, rgba(140,200,235,0.30) 100%)',
          }} />
        )}
        {tour.featured && (
          <span style={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--teal)',
            background: 'rgba(255,255,255,0.90)',
            border: '1px solid rgba(46,125,156,0.25)',
            borderRadius: 6,
            padding: '3px 8px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {t('tours.featured')}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 20px' }}>
        {(tour.destinationName || tour.categoryName) && (
          <p style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: 10.5,
            fontWeight: 500,
            color: 'var(--ink-35)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}>
            {[tour.destinationName, tour.categoryName].filter(Boolean).join(' · ')}
          </p>
        )}
        <h3 style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--ink)',
          lineHeight: 1.3,
          marginBottom: 8,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {tour.title}
        </h3>
        <p style={{
          fontFamily: "'Noto Sans', sans-serif",
          fontSize: 13,
          color: 'var(--ink-60)',
          lineHeight: 1.6,
          marginBottom: 16,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {tour.summary}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 20,
              fontWeight: 800,
              color: 'var(--teal)',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>
              {formatPrice(tour.convertedPrice ?? tour.price)}
            </div>
            <div style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 11,
              color: 'var(--ink-35)',
              marginTop: 2,
            }}>
              {tour.durationDays} {tour.durationDays === 1 ? t('tours.day') : t('tours.days')}
            </div>
          </div>
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--teal)',
            background: 'rgba(46,125,156,0.10)',
            border: '1px solid rgba(46,125,156,0.20)',
            borderRadius: 8,
            padding: '6px 12px',
          }}>
            {t('tours.viewDetails')} →
          </span>
        </div>
      </div>
    </Link>
  );
}
