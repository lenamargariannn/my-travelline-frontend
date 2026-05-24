import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminToursApi, adminCategoriesApi, adminDestinationsApi } from '@/api/endpoints';
import type { Tour, TourSummary, CreateTourRequest } from '@my-travelline/shared';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

const toSlug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const emptyForm = (): TourFormState => ({
  title: '', slug: '', summary: '', description: '', price: '',
  durationDays: '', maxGroupSize: '', coverImage: '', featured: false,
  categoryId: '', destinationId: '',
  itineraryDays: [],
});

interface TourFormState {
  title: string; slug: string; summary: string; description: string;
  price: string; durationDays: string; maxGroupSize: string;
  coverImage: string; featured: boolean;
  categoryId: string; destinationId: string;
  itineraryDays: { dayNumber: number; title: string; description: string }[];
}

function toRequest(f: TourFormState): CreateTourRequest {
  return {
    title: f.title.trim(),
    slug: f.slug.trim(),
    summary: f.summary.trim() || undefined,
    description: f.description.trim() || undefined,
    price: parseFloat(f.price) || 0,
    durationDays: parseInt(f.durationDays) || undefined,
    maxGroupSize: parseInt(f.maxGroupSize) || undefined,
    coverImage: f.coverImage.trim() || undefined,
    featured: f.featured,
    categoryId: f.categoryId ? parseInt(f.categoryId) : undefined,
    destinationId: f.destinationId ? parseInt(f.destinationId) : undefined,
    itineraryDays: f.itineraryDays.length
      ? f.itineraryDays.map(({ dayNumber, title, description }) => ({ dayNumber, title, description }))
      : undefined,
  };
}

function fromTour(tour: Tour): TourFormState {
  return {
    title: tour.title,
    slug: tour.slug,
    summary: tour.summary ?? '',
    description: tour.description ?? '',
    price: String(tour.price ?? ''),
    durationDays: String(tour.durationDays ?? ''),
    maxGroupSize: String(tour.maxGroupSize ?? ''),
    coverImage: tour.coverImage ?? '',
    featured: tour.featured,
    categoryId: tour.categoryId ? String(tour.categoryId) : '',
    destinationId: tour.destinationId ? String(tour.destinationId) : '',
    itineraryDays: (tour.itineraryDays ?? []).map(({ dayNumber, title, description }) => ({ dayNumber, title, description })),
  };
}

interface TourFormProps {
  form: TourFormState;
  onChange: (f: TourFormState) => void;
}

function TourForm({ form, onChange }: TourFormProps) {
  const { data: categories } = useQuery({ queryKey: ['admin', 'categories'], queryFn: () => adminCategoriesApi.getAll().then(r => r.data) });
  const { data: destinations } = useQuery({ queryKey: ['admin', 'destinations'], queryFn: () => adminDestinationsApi.getAll().then(r => r.data) });

  const set = (patch: Partial<TourFormState>) => onChange({ ...form, ...patch });

  const addDay = () => {
    const dayNumber = form.itineraryDays.length + 1;
    set({ itineraryDays: [...form.itineraryDays, { dayNumber, title: '', description: '' }] });
  };
  const removeDay = (idx: number) =>
    set({ itineraryDays: form.itineraryDays.filter((_, i) => i !== idx).map((d, i) => ({ ...d, dayNumber: i + 1 })) });
  const updateDay = (idx: number, patch: Partial<{ title: string; description: string }>) =>
    set({ itineraryDays: form.itineraryDays.map((d, i) => i === idx ? { ...d, ...patch } : d) });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">Title *</label>
          <input className="input-field" value={form.title} onChange={e => {
            const title = e.target.value;
            set({ title, slug: toSlug(title) });
          }} />
        </div>
        <div>
          <label className="input-label">Slug *</label>
          <input className="input-field" value={form.slug} onChange={e => set({ slug: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="input-label">Summary</label>
        <textarea className="input-field" rows={2} value={form.summary} onChange={e => set({ summary: e.target.value })} />
      </div>

      <div>
        <label className="input-label">Description</label>
        <textarea className="input-field" rows={4} value={form.description} onChange={e => set({ description: e.target.value })} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="input-label">Price (USD) *</label>
          <input className="input-field" type="number" min="0" step="0.01" value={form.price} onChange={e => set({ price: e.target.value })} />
        </div>
        <div>
          <label className="input-label">Duration (days)</label>
          <input className="input-field" type="number" min="1" value={form.durationDays} onChange={e => set({ durationDays: e.target.value })} />
        </div>
        <div>
          <label className="input-label">Max Group Size</label>
          <input className="input-field" type="number" min="1" value={form.maxGroupSize} onChange={e => set({ maxGroupSize: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">Category</label>
          <select className="input-field" value={form.categoryId} onChange={e => set({ categoryId: e.target.value })}>
            <option value="">— None —</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="input-label">Destination</label>
          <select className="input-field" value={form.destinationId} onChange={e => set({ destinationId: e.target.value })}>
            <option value="">— None —</option>
            {destinations?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="input-label">Cover Image Key (S3)</label>
        <input className="input-field" placeholder="e.g. tours/paris-hero.jpg" value={form.coverImage} onChange={e => set({ coverImage: e.target.value })} />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="h-4 w-4 accent-primary-600" checked={form.featured} onChange={e => set({ featured: e.target.checked })} />
        <span className="text-sm font-medium text-secondary-700">Featured tour</span>
      </label>

      {/* Itinerary Days */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="input-label mb-0">Itinerary Days</label>
          <button type="button" onClick={addDay} className="text-xs text-primary-600 hover:underline">+ Add Day</button>
        </div>
        <div className="space-y-3">
          {form.itineraryDays.map((day, idx) => (
            <div key={idx} className="border border-secondary-200 rounded-lg p-3 bg-secondary-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-secondary-600">Day {day.dayNumber}</span>
                <button type="button" onClick={() => removeDay(idx)} className="text-xs text-accent-600 hover:underline">Remove</button>
              </div>
              <input
                className="input-field mb-2"
                placeholder="Title"
                value={day.title}
                onChange={e => updateDay(idx, { title: e.target.value })}
              />
              <textarea
                className="input-field"
                rows={2}
                placeholder="Description"
                value={day.description}
                onChange={e => updateDay(idx, { description: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal open onClose={onCancel} title="Delete Tour" size="sm">
      <p className="text-secondary-600 mb-6">Are you sure you want to delete this tour? This action cannot be undone.</p>
      <div className="flex gap-3 justify-end">
        <button className="btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn-accent btn-sm" onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  );
}

export default function AdminToursPage() {
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TourFormState>(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'tours', page],
    queryFn: () => adminToursApi.getAll({ page, size: 20 }).then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (req: CreateTourRequest) => adminToursApi.create(req),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] }); toast.success('Tour created'); closeModal(); },
    onError: () => toast.error('Failed to create tour'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, req }: { id: number; req: CreateTourRequest }) => adminToursApi.update(id, req),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] }); toast.success('Tour updated'); closeModal(); },
    onError: () => toast.error('Failed to update tour'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminToursApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] }); toast.success('Tour deleted'); setConfirmDeleteId(null); },
    onError: () => toast.error('Failed to delete tour'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => adminToursApi.updateStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] }); toast.success('Status updated'); },
    onError: () => toast.error('Failed to update status'),
  });

  const openCreate = () => { setEditingId(null); setForm(emptyForm()); setModalOpen(true); };

  const openEdit = async (tour: TourSummary) => {
    try {
      const full = await adminToursApi.getById(tour.id).then(r => r.data);
      setForm(fromTour(full));
      setEditingId(tour.id);
      setModalOpen(true);
    } catch {
      toast.error('Failed to load tour details');
    }
  };

  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(emptyForm()); };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.price) {
      toast.error('Title, slug, and price are required');
      return;
    }
    setSubmitting(true);
    const req = toRequest(form);
    if (editingId != null) {
      await updateMutation.mutateAsync({ id: editingId, req });
    } else {
      await createMutation.mutateAsync(req);
    }
    setSubmitting(false);
  };

  if (isLoading) return <LoadingSpinner />;

  const tours = data?.content ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Tours</h1>
        <button className="btn-primary btn-sm" onClick={openCreate}>+ Add Tour</button>
      </div>

      {tours.length === 0 ? (
        <div className="bg-white rounded-xl border border-secondary-100 p-12 text-center text-secondary-400">No tours yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-x-auto">
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
              {tours.map((tour) => (
                <tr key={tour.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="px-4 py-3 font-medium text-secondary-800">{tour.title}</td>
                  <td className="px-4 py-3 text-secondary-600">{tour.categoryName || '—'}</td>
                  <td className="px-4 py-3 text-secondary-600">${tour.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${tour.featured ? 'badge-success' : 'badge-warning'}`}>
                      {tour.featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(tour)} className="text-primary-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => statusMutation.mutate({ id: tour.id, status: 'PUBLISHED' })} className="text-green-600 hover:underline text-xs">Publish</button>
                    <button onClick={() => statusMutation.mutate({ id: tour.id, status: 'DRAFT' })} className="text-yellow-600 hover:underline text-xs">Draft</button>
                    <button onClick={() => setConfirmDeleteId(tour.id)} className="text-accent-600 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button className="btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-sm text-secondary-600">Page {page + 1} of {data.totalPages}</span>
          <button className="btn-secondary btn-sm" disabled={data.last} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit Tour' : 'New Tour'} size="xl">
        <TourForm form={form} onChange={setForm} />
        <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200 mt-6">
          <button className="btn-secondary btn-sm" onClick={closeModal}>Cancel</button>
          <button className="btn-primary btn-sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Create Tour'}
          </button>
        </div>
      </Modal>

      {confirmDeleteId != null && (
        <ConfirmDelete
          onConfirm={() => deleteMutation.mutate(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
