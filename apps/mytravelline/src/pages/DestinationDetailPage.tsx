import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { destinationsApi, toursApi } from '@/api/endpoints';
import TourCard from '@/components/ui/TourCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { imageUrl } from '@/lib/imageUrl';

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: destination, isLoading } = useQuery({
    queryKey: ['destination', slug],
    queryFn: () => destinationsApi.getBySlug(slug!).then((res) => res.data),
    enabled: !!slug,
  });

  const { data: tours } = useQuery({
    queryKey: ['tours', 'destination', slug],
    queryFn: () => toursApi.getAll({ destination: slug!, page: 0, size: 6 }).then((res) => res.data),
    enabled: !!slug,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!destination) return <div className="container-main py-20 text-center">Destination not found</div>;

  return (
    <div>
      <section className="relative h-80 bg-secondary-200">
        {destination.coverImage && (
          <img src={imageUrl(destination.coverImage)} alt={destination.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container-main text-white">
          <h1 className="text-4xl font-heading font-bold">{destination.name}</h1>
          <p className="text-white/80 mt-2">{destination.country}</p>
        </div>
      </section>

      <div className="container-main py-12">
        <p className="text-secondary-600 leading-relaxed max-w-3xl mb-12">{destination.description}</p>

        {tours && tours.content.length > 0 && (
          <div>
            <h2 className="text-2xl font-heading font-bold mb-6">Tours in {destination.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.content.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
