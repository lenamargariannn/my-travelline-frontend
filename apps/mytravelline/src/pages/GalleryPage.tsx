import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { galleryApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

export default function GalleryPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', page, lang],
    queryFn: () => galleryApi.getAll({ page, size: 24 }).then((res) => res.data),
  });

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
        <T as="span" className="eyebrow" style={{ marginBottom: 12, display: 'inline-block' }}>{t('gallery.eyebrow')}</T>
        <T as="h1" className="section-h2" style={{ margin: '0 auto 10px' }}>{t('gallery.pageTitle')}</T>
        <T as="p" className="section-sub" style={{ margin: '0 auto' }}>{t('gallery.pageSubtitle')}</T>
      </section>

      {/* Masonry grid */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 0 80px' }}>
        {isLoading ? (
          <div style={{ padding: '0 40px' }}>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div
              style={{
                columns: '4',
                columnGap: '4px',
                padding: '0',
              }}
            >
              {data?.content?.map((image) => (
                <div
                  key={image.id}
                  style={{
                    position: 'relative',
                    breakInside: 'avoid',
                    marginBottom: 4,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    const overlay = e.currentTarget.querySelector('.gallery-overlay') as HTMLDivElement | null;
                    if (overlay) overlay.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    const overlay = e.currentTarget.querySelector('.gallery-overlay') as HTMLDivElement | null;
                    if (overlay) overlay.style.opacity = '0';
                  }}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.caption || t('gallery.imageAlt')}
                    style={{ width: '100%', display: 'block' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  {/* Glass hover overlay */}
                  <div
                    className="gallery-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                      background: 'rgba(7,32,47,0.25)',
                      opacity: 0,
                      transition: 'opacity 0.25s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 16,
                    }}
                  >
                    {(image.caption || image.destinationName) && (
                      <p
                        style={{
                          fontFamily: "'Noto Sans', sans-serif",
                          fontSize: 13,
                          color: '#fff',
                          textAlign: 'center',
                          margin: 0,
                          textShadow: '0 1px 4px rgba(7,32,47,0.5)',
                        }}
                      >
                        {image.caption || image.destinationName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {data && data.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 48, padding: '0 40px' }}>
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
      </section>
    </PageShell>
  );
}
