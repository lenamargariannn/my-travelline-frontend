import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toursApi, destinationsApi, reviewsApi } from '@/api/endpoints';
import TourCard from '@/components/ui/TourCard';
import { HiArrowRight } from 'react-icons/hi';

export default function HomePage() {
  const { data: featuredTours } = useQuery({
    queryKey: ['tours', 'featured'],
    queryFn: () => toursApi.getFeatured().then((res) => res.data),
  });

  const { data: destinations } = useQuery({
    queryKey: ['destinations'],
    queryFn: () => destinationsApi.getAll().then((res) => res.data),
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewsApi.getAll({ page: 0, size: 3 }).then((res) => res.data),
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-hero-gradient min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-main relative z-10 text-center text-white py-24">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
            Creating Timeless
            <br />
            <span className="text-primary-200">Memories</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Discover extraordinary destinations and curated travel experiences
            designed to create unforgettable moments that last a lifetime.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/tours" className="btn-accent btn-lg">
              Explore Tours
            </Link>
            <Link to="/contact" className="btn bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 btn-lg">
              Plan Your Trip
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Tours</h2>
            <p className="section-subtitle mx-auto">
              Hand-picked travel experiences loved by our guests
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours?.slice(0, 6).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/tours" className="btn-secondary inline-flex items-center gap-2">
              View All Tours <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section-padding bg-secondary-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle mx-auto">
              Explore our most sought-after travel destinations
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations?.slice(0, 6).map((dest) => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.slug}`}
                className="group relative h-64 rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-primary-900/40 group-hover:bg-primary-900/20 transition-colors z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                  <h3 className="text-xl font-heading font-bold">{dest.name}</h3>
                  <p className="text-sm text-white/80 mt-1">{dest.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Travelers Say</h2>
            <p className="section-subtitle mx-auto">
              Real stories from real travelers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews?.content?.slice(0, 3).map((review) => (
              <div key={review.id} className="card-bordered p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-secondary-200'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-secondary-600 text-sm leading-relaxed mb-4">
                  "{review.content}"
                </p>
                <div>
                  <p className="font-semibold text-secondary-800 text-sm">{review.authorName}</p>
                  <p className="text-xs text-secondary-500">{review.authorLocation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 py-16">
        <div className="container-main text-center text-white">
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            Ready for Your Next Adventure?
          </h2>
          <p className="mt-4 text-primary-100 max-w-xl mx-auto">
            Let us help you plan the perfect trip. Contact our travel experts today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-3 rounded-lg">
              Contact Us
            </Link>
            <Link to="/tours" className="btn border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg">
              Browse Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
