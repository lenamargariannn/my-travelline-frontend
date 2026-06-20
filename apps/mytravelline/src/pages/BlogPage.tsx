import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { imageUrl } from '@/lib/imageUrl';
import { format } from 'date-fns';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['blog', page, lang],
    queryFn: () => blogApi.getAll({ page, size: 10 }).then((res) => res.data),
  });

  const posts = data?.content ?? [];
  const featured = page === 0 ? posts[0] : null;
  const rest = page === 0 ? posts.slice(1) : posts;

  const formatDate = (d: string) => format(new Date(d), 'dd MMM yyyy');

  return (
    <PageShell>
      {/* Page header */}
      <section
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '64px 40px 40px',
          textAlign: 'center',
          animation: 'fadeUp 0.7s ease both',
        }}
      >
        <T as="span" className="eyebrow" style={{ marginBottom: 12, display: 'inline-block' }}>{t('blog.eyebrow')}</T>
        <T as="h1" className="section-h2" style={{ margin: '0 auto 10px' }}>{t('blog.pageTitle')}</T>
        <T as="p" className="section-sub" style={{ margin: '0 auto' }}>{t('blog.pageSubtitle')}</T>
      </section>

      <section style={{ position: 'relative', zIndex: 10, padding: '0 40px 80px' }}>
        <div className="section-inner">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <div
                  className="card"
                  style={{ display: 'grid', gridTemplateColumns: '45fr 55fr', marginBottom: 40, borderRadius: 20 }}
                >
                  <div style={{ height: 360, overflow: 'hidden', background: 'rgba(14,79,110,0.12)', flexShrink: 0 }}>
                    {featured.coverImage && (
                      <img
                        src={imageUrl(featured.coverImage)}
                        alt={featured.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <div style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {featured.tags && (
                      <span className="eyebrow" style={{ display: 'inline-block', marginBottom: 16 }}>
                        {featured.tags.split(',')[0].trim()}
                      </span>
                    )}
                    <h2
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: 32,
                        fontWeight: 700,
                        color: 'var(--ink)',
                        lineHeight: 1.2,
                        marginBottom: 16,
                      }}
                    >
                      {featured.title}
                    </h2>
                    {featured.summary && (
                      <p
                        style={{
                          fontFamily: "'Noto Sans', sans-serif",
                          fontSize: 15,
                          fontWeight: 300,
                          color: 'var(--ink-60)',
                          lineHeight: 1.75,
                          marginBottom: 20,
                        }}
                      >
                        {featured.summary}
                      </p>
                    )}
                    <p
                      style={{
                        fontFamily: "'Noto Sans', sans-serif",
                        fontSize: 12,
                        fontWeight: 300,
                        color: 'var(--ink-35)',
                        marginBottom: 28,
                      }}
                    >
                      {featured.publishedAt && formatDate(featured.publishedAt)}
                      {featured.author && ` · ${featured.author}`}
                    </p>
                    <div>
                      <Link to={`/blog/${featured.slug}`} className="btn-secondary">
                        Read Article →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Remaining posts grid */}
              {rest.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 24,
                  }}
                >
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="card"
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <div style={{ height: 200, background: 'rgba(14,79,110,0.10)', overflow: 'hidden' }}>
                        {post.coverImage && (
                          <img
                            src={imageUrl(post.coverImage)}
                            alt={post.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <div style={{ padding: '20px 22px 24px' }}>
                        {post.tags && (
                          <span className="eyebrow" style={{ display: 'inline-block', marginBottom: 10 }}>
                            {post.tags.split(',')[0].trim()}
                          </span>
                        )}
                        <h3
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontSize: 18,
                            fontWeight: 600,
                            color: 'var(--ink)',
                            lineHeight: 1.35,
                            marginBottom: 8,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {post.title}
                        </h3>
                        <p
                          style={{
                            fontFamily: "'Noto Sans', sans-serif",
                            fontSize: 12,
                            fontWeight: 300,
                            color: 'var(--ink-35)',
                          }}
                        >
                          {post.publishedAt && formatDate(post.publishedAt)}
                          {post.author && ` · ${post.author}`}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {data && data.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 48 }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '8px 20px', fontSize: 13 }}
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    <T>{t('common.previous')}</T>
                  </button>
                  <T as="span" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 13, color: 'var(--ink-60)' }}>
                    {t('common.pageOf', { current: page + 1, total: data.totalPages })}
                  </T>
                  <button
                    className="btn-secondary"
                    style={{ padding: '8px 20px', fontSize: 13 }}
                    disabled={data.last}
                    onClick={() => setPage(page + 1)}
                  >
                    <T>{t('common.next')}</T>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
