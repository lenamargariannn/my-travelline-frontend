import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { destinationsApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { imageUrl } from '@/lib/imageUrl';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

export default function DestinationsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: destinations, isLoading } = useQuery({
    queryKey: ['destinations', lang],
    queryFn: () => destinationsApi.getAll().then((res) => res.data),
  });

  /* Group into rows of 3: first card wide (col-span 2), next two normal */
  const rows: Array<typeof destinations> = [];
  if (destinations) {
    let i = 0;
    while (i < destinations.length) {
      rows.push(destinations.slice(i, i + 3));
      i += 3;
    }
  }

  return (
    <PageShell>
      {/* Page header */}
      <section
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '64px 40px 40px',
          animation: 'fadeUp 0.7s ease both',
          textAlign: 'center',
        }}
      >
        <T as="span" className="eyebrow" style={{ marginBottom: 12, display: 'inline-block' }}>{t('destinations.eyebrow')}</T>
        <T as="h1" className="section-h2" style={{ margin: '0 auto 10px' }}>{t('destinations.pageTitle')}</T>
        <T as="p" className="section-sub" style={{ margin: '0 auto' }}>{t('destinations.pageSubtitle')}</T>
      </section>

      {/* Grid */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 40px 80px' }}>
        <div className="section-inner">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {rows.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    gap: 16,
                  }}
                >
                  {row?.map((dest, colIdx) => {
                    const isFeatured = colIdx === 0;
                    return (
                      <Link
                        key={dest.id}
                        to={`/destinations/${dest.slug}`}
                        style={{
                          position: 'relative',
                          height: isFeatured ? 320 : 160,
                          borderRadius: 16,
                          overflow: 'hidden',
                          textDecoration: 'none',
                          display: 'block',
                          background: 'rgba(46,125,156,0.15)',
                        }}
                      >
                        {dest.coverImage ? (
                          <img
                            src={imageUrl(dest.coverImage)}
                            alt={dest.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              transition: 'transform 0.35s ease',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(46,125,156,0.20) 0%, rgba(140,200,235,0.30) 100%)' }} />
                        )}

                        {/* Glass nameplate */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '16px 20px',
                            background: 'rgba(255,255,255,0.38)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            borderTop: '1px solid rgba(255,255,255,0.6)',
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: "'Nunito', sans-serif",
                              fontSize: 18,
                              fontWeight: 600,
                              color: '#fff',
                              margin: 0,
                              textShadow: '0 1px 4px rgba(7,32,47,0.35)',
                            }}
                          >
                            {dest.name}
                          </h3>
                          <p
                            style={{
                              fontFamily: "'Noto Sans', sans-serif",
                              fontSize: 12,
                              fontWeight: 300,
                              color: 'rgba(255,255,255,0.75)',
                              marginTop: 2,
                            }}
                          >
                            {dest.country}
                          </p>
                        </div>
                      </Link>
                    );
                  })}

                  {/* Fill empty slots in last row */}
                  {row && row.length === 2 && <div />}
                  {row && row.length === 1 && (
                    <>
                      <div />
                      <div />
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
