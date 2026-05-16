import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminBookingsApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminBookingsPage() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'bookings', page],
    queryFn: () => adminBookingsApi.getAll({ page, size: 20 }).then((res) => res.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminBookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      toast.success('Booking status updated');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Manage Bookings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary-50 border-b border-secondary-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-secondary-600">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-secondary-600">Tour</th>
              <th className="text-left px-4 py-3 font-medium text-secondary-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-secondary-600">Guests</th>
              <th className="text-left px-4 py-3 font-medium text-secondary-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-secondary-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.content?.map((booking) => (
              <tr key={booking.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-secondary-800">{booking.customerName}</p>
                  <p className="text-xs text-secondary-500">{booking.email}</p>
                </td>
                <td className="px-4 py-3 text-secondary-600">{booking.tourTitle || '—'}</td>
                <td className="px-4 py-3 text-secondary-600">
                  {booking.createdAt && format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-4 py-3 text-secondary-600">{booking.guests}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${
                    booking.status === 'NEW' ? 'badge-warning' :
                    booking.status === 'CONFIRMED' ? 'badge-success' : 'badge-danger'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {booking.status === 'NEW' && (
                    <>
                      <button
                        onClick={() => statusMutation.mutate({ id: booking.id, status: 'CONFIRMED' })}
                        className="text-green-600 hover:underline text-xs mr-2"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => statusMutation.mutate({ id: booking.id, status: 'CANCELLED' })}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Cancel
                      </button>
                    </>
                  )}
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
