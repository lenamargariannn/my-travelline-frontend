import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { galleryApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function GalleryPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', page],
    queryFn: () => galleryApi.getAll({ page, size: 12 }).then((res) => res.data),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="section-padding">
      <div className="container-main">
        <div className="text-center mb-12">
          <h1 className="section-title">Gallery</h1>
          <p className="section-subtitle mx-auto">
            A visual journey through our most beautiful destinations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.content?.map((image) => (
            <div key={image.id} className="group relative h-64 rounded-lg overflow-hidden">
              <img
                src={image.imageUrl}
                alt={image.caption || 'Gallery image'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">{image.caption}</p>
                  {image.destinationName && (
                    <p className="text-white/70 text-xs mt-1">{image.destinationName}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button className="btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
            <span className="text-sm text-secondary-600">Page {page + 1} of {data.totalPages}</span>
            <button className="btn-secondary btn-sm" disabled={data.last} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
