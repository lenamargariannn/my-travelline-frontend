import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toursApi, categoriesApi, destinationsApi } from '@/api/endpoints';
import { useCurrency } from '@/hooks/useCurrency';
import TourCard from '@/components/ui/TourCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

export default function ToursPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { selectedCurrency } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);

  const category = searchParams.get('category') || '';
  const destination = searchParams.get('destination') || '';
  const search = searchParams.get('search') || '';

  const { data: toursData, isLoading } = useQuery({
    queryKey: ['tours', page, category, destination, search, selectedCurrency, lang],
    queryFn: () =>
      toursApi
        .getAll({ page, size: 12, currency: selectedCurrency, ...(category && { category }), ...(destination && { destination }), ...(search && { search }) })
        .then((res) => res.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories', lang],
    queryFn: () => categoriesApi.getAll().then((res) => res.data),
  });

  const { data: destinations } = useQuery({
    queryKey: ['destinations', lang],
    queryFn: () => destinationsApi.getAll().then((res) => res.data),
  });

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
    setPage(0);
  };

  const selectStyle: React.CSSProperties = {
    padding: '10px 14px',
    fontFamily: "'Noto Sans', sans-serif",
    fontSize: 14,
    color: 'var(--ink)',
    background: 'rgba(255,255,255,0.60)',
    border: '1px solid rgba(46,125,156,0.20)',
    borderRadius: 12,
    outline: 'none',
    cursor: 'pointer',
    minWidth: 180,
    backdropFilter: 'blur(8px)',
    width: '100%',
  };
  const filterColStyle: React.CSSProperties = {
    flex: '1 1 0',
    minWidth: 140,
  };

  const searchColStyle: React.CSSProperties = {
    flex: '2 1 0',
    minWidth: 180,
  };
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
        <div className="section-inner">
          <T as="span" className="eyebrow" style={{ marginBottom: 12, display: 'inline-block' }}>{t('tours.eyebrow')}</T>
          <T as="h1" className="section-h2" style={{ margin: '0 auto 10px' }}>{t('tours.pageTitle')}</T>
          <T as="p" className="section-sub" style={{ margin: '0 auto' }}>{t('tours.pageSubtitle')}</T>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '0 40px 32px' }}>
        <div className="section-inner">
          <div
            className="glass"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              padding: '20px 24px',
            }}
          >
            <div style={filterColStyle}>
              <select
                  style={selectStyle}
                  value={category}
                  onChange={(e) => handleFilter('category', e.target.value)}
              >
                <option value="">{t('tours.allCategories')}</option>
                {categories?.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={filterColStyle}>
              <select
                  style={selectStyle}
                  value={destination}
                  onChange={(e) => handleFilter('destination', e.target.value)}
              >
                <option value="">{t('tours.allDestinations')}</option>
                {destinations?.map((dest) => (
                    <option key={dest.id} value={dest.slug}>{dest.name}</option>
                ))}
              </select>
            </div>

            <div style={searchColStyle}>
              <input
                  type="text"
                  placeholder={t('tours.searchPlaceholder')}
                  style={{ ...selectStyle, cursor: 'text' }}
                  value={search}
                  onChange={(e) => handleFilter('search', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tour grid */}
      <section style={{ padding: '0 40px 80px' }}>
        <div className="section-inner">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {toursData?.content?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <T as="p"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 16,
                      color: 'var(--ink-60)',
                      marginBottom: 24,
                    }}
                  >
                    {t('tours.noToursFound')}
                  </T>
                  <button onClick={() => setSearchParams({})} className="btn-primary">
                    <T>{t('tours.clearFilters')}</T>
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: 24,
                  }}
                >
                  {toursData?.content?.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              )}

              {toursData && toursData.totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 16,
                    marginTop: 48,
                  }}
                >
                  <button
                    className="btn-secondary"
                    style={{ padding: '8px 20px', fontSize: 13 }}
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    <T>{t('common.previous')}</T>
                  </button>
                  <T as="span"
                    style={{
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: 13,
                      color: 'var(--ink-60)',
                    }}
                  >
                    {t('common.pageOf', { current: page + 1, total: toursData.totalPages })}
                  </T>
                  <button
                    className="btn-secondary"
                    style={{ padding: '8px 20px', fontSize: 13 }}
                    disabled={toursData.last}
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
