import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminReviewsApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'reviews', page],
    queryFn: () => adminReviewsApi.getAll({ page, size: 20 }).then((res) => res.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => adminReviewsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review approved');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => adminReviewsApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review rejected');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminReviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review deleted');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Manage Reviews</h1>

      <div className="space-y-4">
        {data?.content?.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-5 border border-secondary-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-secondary-800">{review.authorName}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-secondary-200'}`}>★</span>
                    ))}
                  </div>
                  <span className={`badge ${review.approved ? 'badge-success' : 'badge-warning'}`}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  {review.authorLocation} • Tour: {review.tourTitle || '—'}
                </p>
                <p className="text-sm text-secondary-600 mt-2">"{review.content}"</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                {!review.approved && (
                  <button onClick={() => approveMutation.mutate(review.id)} className="text-green-600 hover:underline text-xs">Approve</button>
                )}
                {review.approved && (
                  <button onClick={() => rejectMutation.mutate(review.id)} className="text-yellow-600 hover:underline text-xs">Reject</button>
                )}
                <button onClick={() => deleteMutation.mutate(review.id)} className="text-red-600 hover:underline text-xs">Delete</button>
              </div>
            </div>
          </div>
        ))}
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
