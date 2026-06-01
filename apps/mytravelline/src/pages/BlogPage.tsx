import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { blogApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { imageUrl } from '@/lib/imageUrl';
import { format } from 'date-fns';

export default function BlogPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['blog', page],
    queryFn: () => blogApi.getAll({ page, size: 9 }).then((res) => res.data),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="section-padding">
      <div className="container-main">
        <div className="text-center mb-12">
          <h1 className="section-title">Travel Blog</h1>
          <p className="section-subtitle mx-auto">
            Stories, tips, and inspiration for your next adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.content?.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="card group">
              <div className="h-48 bg-secondary-200 overflow-hidden">
                {post.coverImage && (
                  <img src={imageUrl(post.coverImage)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
              </div>
              <div className="p-5">
                <p className="text-xs text-secondary-500 mb-2">
                  {post.publishedAt && format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                  {post.author && ` • ${post.author}`}
                </p>
                <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-secondary-600 mt-2 line-clamp-3">{post.summary}</p>
              </div>
            </Link>
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
