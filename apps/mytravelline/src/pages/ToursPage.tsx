import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toursApi, categoriesApi, destinationsApi } from '@/api/endpoints';
import { useCurrency } from '@/hooks/useCurrency';
import TourCard from '@/components/ui/TourCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ToursPage() {
  const { t } = useTranslation();
  const { selectedCurrency } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);

  const category = searchParams.get('category') || '';
  const destination = searchParams.get('destination') || '';
  const search = searchParams.get('search') || '';

  const { data: toursData, isLoading } = useQuery({
    queryKey: ['tours', page, category, destination, search, selectedCurrency],
    queryFn: () =>
      toursApi
        .getAll({ page, size: 12, currency: selectedCurrency, ...(category && { category }), ...(destination && { destination }), ...(search && { search }) })
        .then((res) => res.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then((res) => res.data),
  });

  const { data: destinations } = useQuery({
    queryKey: ['destinations'],
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

  return (
    <div className="section-padding">
      <div className="container-main">
        <div className="text-center mb-12">
          <h1 className="section-title">{t('tours.pageTitle')}</h1>
          <p className="section-subtitle mx-auto">{t('tours.pageSubtitle')}</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-[#E8F9FF] rounded-lg">
          <select
            className="input-field max-w-xs"
            value={category}
            onChange={(e) => handleFilter('category', e.target.value)}
          >
            <option value="">{t('tours.allCategories')}</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          <select
            className="input-field max-w-xs"
            value={destination}
            onChange={(e) => handleFilter('destination', e.target.value)}
          >
            <option value="">{t('tours.allDestinations')}</option>
            {destinations?.map((dest) => (
              <option key={dest.id} value={dest.slug}>{dest.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder={t('tours.searchPlaceholder')}
            className="input-field max-w-xs"
            value={search}
            onChange={(e) => handleFilter('search', e.target.value)}
          />
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {toursData?.content?.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>

            {toursData?.content?.length === 0 && (
              <div className="text-center py-16 text-secondary-500">
                <p className="text-lg">{t('tours.noToursFound')}</p>
                <button onClick={() => setSearchParams({})} className="btn-primary mt-4">
                  {t('tours.clearFilters')}
                </button>
              </div>
            )}

            {toursData && toursData.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button className="btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  {t('common.previous')}
                </button>
                <span className="text-sm text-secondary-600">
                  {t('common.pageOf', { current: page + 1, total: toursData.totalPages })}
                </span>
                <button className="btn-secondary btn-sm" disabled={toursData.last} onClick={() => setPage(page + 1)}>
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
