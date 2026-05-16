import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminToursApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminToursPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'tours', page],
    queryFn: () => adminToursApi.getAll({ page, size: 20 }).then((res) => res.data),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Manage Tours</h1>
        <button className="btn-primary btn-sm">+ Add Tour</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary-50 border-b border-secondary-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-secondary-600">Title</th>
              <th className="text-left px-4 py-3 font-medium text-secondary-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-secondary-600">Price</th>
              <th className="text-left px-4 py-3 font-medium text-secondary-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-secondary-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.content?.map((tour) => (
              <tr key={tour.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                <td className="px-4 py-3 font-medium text-secondary-800">{tour.title}</td>
                <td className="px-4 py-3 text-secondary-600">{tour.categoryName || '—'}</td>
                <td className="px-4 py-3 text-secondary-600">${tour.price?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${tour.featured ? 'badge-success' : 'badge-warning'}`}>
                    {tour.featured ? 'Featured' : 'Standard'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-primary-600 hover:underline text-xs mr-3">Edit</button>
                  <button className="text-accent-600 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button className="btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-sm text-secondary-600">Page {page + 1} of {data.totalPages}</span>
          <button className="btn-secondary btn-sm" disabled={data.last} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
