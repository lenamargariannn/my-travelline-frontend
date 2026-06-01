import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { destinationsApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { imageUrl } from '@/lib/imageUrl';

export default function DestinationsPage() {
  const { data: destinations, isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: () => destinationsApi.getAll().then((res) => res.data),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="section-padding">
      <div className="container-main">
        <div className="text-center mb-12">
          <h1 className="section-title">Destinations</h1>
          <p className="section-subtitle mx-auto">
            Explore breathtaking destinations around the world
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations?.map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.slug}`}
              className="group relative h-72 rounded-xl overflow-hidden card"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
              {dest.coverImage ? (
                <img src={imageUrl(dest.coverImage)} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div className="w-full h-full bg-primary-100" />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <h3 className="text-xl font-heading font-bold">{dest.name}</h3>
                <p className="text-sm text-white/80 mt-1">{dest.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
