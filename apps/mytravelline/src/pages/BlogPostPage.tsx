import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { blogApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { imageUrl } from '@/lib/imageUrl';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogApi.getBySlug(slug!).then((res) => res.data),
    enabled: !!slug,
  });

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      setProgress((window.scrollY / docHeight) * 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <PageShell>
        <LoadingSpinner />
      </PageShell>
    );
  }

  if (!post) {
    return (
      <PageShell>
        <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--ink-60)' }}>
          <T>{t('blog.notFound')}</T>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Reading progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: 3,
          background: 'var(--teal)',
          zIndex: 30,
          width: `${progress}%`,
          transition: 'width 0.1s linear',
        }}
      />

      {/* Article panel */}
      <section style={{ position: 'relative', zIndex: 10, padding: '52px 40px 80px' }}>
        <article
          className="glass"
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '56px 64px',
            borderRadius: 20,
          }}
        >
          {/* Category eyebrow */}
          {post.tags && (
            <span className="eyebrow" style={{ display: 'inline-block', marginBottom: 20 }}>
              {post.tags.split(',')[0].trim()}
            </span>
          )}

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 40,
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: 16,
              marginTop: post.tags ? 0 : 0,
            }}
          >
            {post.title}
          </h1>

          {/* Date + author */}
          <p
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 13,
              fontWeight: 300,
              color: 'var(--ink-35)',
              marginBottom: 32,
            }}
          >
            {post.publishedAt && format(new Date(post.publishedAt), 'dd MMM yyyy')}
            {post.author && ` · ${post.author}`}
          </p>

          {/* Cover image */}
          {post.coverImage && (
            <div
              style={{
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 40,
              }}
            >
              <img
                src={imageUrl(post.coverImage)}
                alt={post.title}
                style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Body with drop cap */}
          <div
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: 16.5,
              fontWeight: 400,
              color: 'var(--ink-60)',
              lineHeight: 1.85,
            }}
          >
            {post.content.split('\n\n').map((para, i) => {
              if (!para.trim()) return null;
              if (i === 0) {
                return (
                  <p key={i} style={{ marginBottom: 24 }}>
                    <span
                      style={{
                        float: 'left',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        fontSize: '4em',
                        lineHeight: 0.75,
                        marginRight: '0.1em',
                        marginTop: '0.08em',
                        color: 'var(--teal)',
                      }}
                    >
                      {para[0]}
                    </span>
                    {para.slice(1)}
                  </p>
                );
              }
              if (para.startsWith('## ')) {
                return (
                  <h2
                    key={i}
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: 22,
                      fontWeight: 600,
                      color: 'var(--ink)',
                      marginTop: 32,
                      marginBottom: 16,
                    }}
                  >
                    {para.slice(3)}
                  </h2>
                );
              }
              if (para.startsWith('# ')) {
                return (
                  <h2
                    key={i}
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: 22,
                      fontWeight: 600,
                      color: 'var(--ink)',
                      marginTop: 32,
                      marginBottom: 16,
                    }}
                  >
                    {para.slice(2)}
                  </h2>
                );
              }
              return <p key={i} style={{ marginBottom: 24 }}>{para}</p>;
            })}
          </div>
        </article>
      </section>
    </PageShell>
  );
}
