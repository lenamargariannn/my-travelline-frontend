import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminMessagesApi } from '@/api/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminMessagesPage() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'messages', page],
    queryFn: () => adminMessagesApi.getAll({ page, size: 20 }).then((res) => res.data),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => adminMessagesApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
      toast.success('Marked as read');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminMessagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
      toast.success('Message deleted');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Contact Messages</h1>

      <div className="space-y-4">
        {data?.content?.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-xl p-5 border ${msg.read ? 'border-secondary-100' : 'border-primary-200 bg-primary-50/30'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-secondary-800">{msg.name}</h3>
                  {!msg.read && <span className="badge-primary">New</span>}
                </div>
                <p className="text-xs text-secondary-500 mt-1">{msg.email} • {msg.createdAt && format(new Date(msg.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                {msg.subject && <p className="text-sm font-medium text-secondary-700 mt-2">{msg.subject}</p>}
                <p className="text-sm text-secondary-600 mt-1">{msg.message}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                {!msg.read && (
                  <button onClick={() => markReadMutation.mutate(msg.id)} className="text-primary-600 hover:underline text-xs">Mark Read</button>
                )}
                <button onClick={() => deleteMutation.mutate(msg.id)} className="text-accent-600 hover:underline text-xs">Delete</button>
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
