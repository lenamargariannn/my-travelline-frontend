import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogApi.getBySlug(slug!).then((res) => res.data),
    enabled: !!slug,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!post) return <div className="container-main py-20 text-center">Post not found</div>;

  return (
    <div className="section-padding">
      <article className="container-main max-w-3xl">
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="w-full h-72 object-cover rounded-xl mb-8" />
        )}

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900">{post.title}</h1>
          <div className="flex items-center gap-3 mt-4 text-sm text-secondary-500">
            {post.publishedAt && <span>{format(new Date(post.publishedAt), 'MMMM dd, yyyy')}</span>}
            {post.author && <span>• {post.author}</span>}
          </div>
          {post.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.split(',').map((tag) => (
                <span key={tag.trim()} className="badge-primary">{tag.trim()}</span>
              ))}
            </div>
          )}
        </header>

        <div className="text-secondary-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>
    </div>
  );
}
