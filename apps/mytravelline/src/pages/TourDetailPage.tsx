import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toursApi, reviewsApi } from '@/api/endpoints';
import { useCurrency } from '@/hooks/useCurrency';
import BookingForm from '@/components/forms/BookingForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { imageUrl } from '@/lib/imageUrl';
import { HiClock, HiUsers, HiLocationMarker, HiTag } from 'react-icons/hi';

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { selectedCurrency, formatPrice } = useCurrency();

  const { data: tour, isLoading } = useQuery({
    queryKey: ['tour', slug, selectedCurrency],
    queryFn: () => toursApi.getBySlug(slug!, selectedCurrency).then((res) => res.data),
    enabled: !!slug,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', 'tour', tour?.id],
    queryFn: () => reviewsApi.getByTour(tour!.id).then((res) => res.data),
    enabled: !!tour?.id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!tour) return <div className="container-main py-20 text-center">{t('tours.notFound')}</div>;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-96 bg-secondary-200">
        {tour.coverImage && (
          <img src={imageUrl(tour.coverImage)} alt={tour.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container-main text-white">
          <div className="flex items-center gap-2 mb-3">
            {tour.categoryName && <span className="badge-primary">{tour.categoryName}</span>}
            {tour.destinationName && (
              <span className="badge bg-white/20 text-white">{tour.destinationName}</span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold">{tour.title}</h1>
        </div>
      </section>

      <div className="container-main py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 p-6 bg-secondary-50 rounded-lg">
              <div className="flex items-center gap-2">
                <HiClock className="h-5 w-5 text-primary-600" />
                <span className="text-sm">{tour.durationDays} {tour.durationDays === 1 ? t('tours.day') : t('tours.days')}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiUsers className="h-5 w-5 text-primary-600" />
                <span className="text-sm">{t('tours.maxPeople', { count: tour.maxGroupSize })}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiLocationMarker className="h-5 w-5 text-primary-600" />
                <span className="text-sm">{tour.destinationName}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiTag className="h-5 w-5 text-primary-600" />
                <span className="text-sm">{tour.categoryName}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">{t('tours.aboutThisTour')}</h2>
              <p className="text-secondary-600 leading-relaxed whitespace-pre-line">{tour.description}</p>
            </div>

            {/* Itinerary */}
            {tour.itineraryDays && tour.itineraryDays.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6">{t('tours.itinerary')}</h2>
                <div className="space-y-4">
                  {tour.itineraryDays.map((day) => (
                    <div key={day.id} className="flex gap-4 p-4 bg-secondary-50 rounded-lg">
                      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                        {day.dayNumber}
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-800">{day.title}</h3>
                        <p className="text-sm text-secondary-600 mt-1">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6">{t('tours.travelerReviews')}</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border border-secondary-200 rounded-lg">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-secondary-200'}>★</span>
                        ))}
                      </div>
                      <p className="text-sm text-secondary-600">"{review.content}"</p>
                      <p className="text-xs text-secondary-500 mt-2">— {review.authorName}, {review.authorLocation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="card p-6">
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-primary-700">
                    {formatPrice(tour.convertedPrice ?? tour.price)}
                  </span>
                  <span className="text-secondary-500 text-sm"> {t('tours.perPerson')}</span>
                </div>
                <BookingForm tourId={tour.id} tourTitle={tour.title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
