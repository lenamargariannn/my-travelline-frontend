import { Link } from 'react-router-dom';
import { HiClock, HiLocationMarker } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import type { TourSummary } from '@my-travelline/shared';
import { imageUrl } from '@/lib/imageUrl';
import { useCurrency } from '@/context/CurrencyContext';

interface TourCardProps {
  tour: TourSummary;
}

export default function TourCard({ tour }: TourCardProps) {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <Link to={`/tours/${tour.slug}`} className="card group">
      {/* Image */}
      <div className="relative h-52 bg-secondary-200 overflow-hidden">
        {tour.coverImage ? (
          <img
            src={imageUrl(tour.coverImage)}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary-400">
            <HiLocationMarker className="h-12 w-12" />
          </div>
        )}
        {tour.featured && (
          <span className="absolute top-3 left-3 badge-primary">{t('tours.featured')}</span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold text-primary-700">
          {formatPrice(tour.convertedPrice ?? tour.price)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-secondary-500 mb-2">
          {tour.categoryName && (
            <span className="badge-primary">{tour.categoryName}</span>
          )}
          {tour.destinationName && (
            <span className="text-secondary-400">• {tour.destinationName}</span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {tour.title}
        </h3>

        <p className="text-sm text-secondary-600 mt-2 line-clamp-2">
          {tour.summary}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-100">
          <div className="flex items-center text-sm text-secondary-500">
            <HiClock className="h-4 w-4 mr-1" />
            {tour.durationDays} {tour.durationDays === 1 ? t('tours.day') : t('tours.days')}
          </div>
          <span className="text-sm font-medium text-primary-600 group-hover:underline">
            {t('tours.viewDetails')} →
          </span>
        </div>
      </div>
    </Link>
  );
}
