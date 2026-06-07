import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminDestinationsApi, adminTranslationsApi } from '@/api/endpoints';
import type { Destination, TranslationMap } from '@my-travelline/shared';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import ImageUploader from '@/components/ui/ImageUploader';
import TranslationEditor from '@/components/TranslationEditor';

const toSlug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

interface DestinationFormState {
  name: string;
  slug: string;
  country: string;
  description: string;
  coverImage: string;
  active: boolean;
}

const emptyForm = (): DestinationFormState => ({
  name: '', slug: '', country: '', description: '', coverImage: '', active: true,
});

function fromDestination(d: Destination): DestinationFormState {
  return {
    name: d.name,
    slug: d.slug,
    country: d.country ?? '',
    description: d.description ?? '',
    coverImage: d.coverImage ?? '',
    active: d.active,
  };
}

function toRequest(f: DestinationFormState): Partial<Destination> {
  return {
    name: f.name.trim(),
    slug: f.slug.trim(),
    country: f.country.trim() || undefined,
    description: f.description.trim() || undefined,
    coverImage: f.coverImage.trim() || undefined,
    active: f.active,
  };
}

interface FormProps { form: DestinationFormState; onChange: (f: DestinationFormState) => void; }

function DestinationForm({ form, onChange }: FormProps) {
  const set = (patch: Partial<DestinationFormState>) => onChange({ ...form, ...patch });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">Name *</label>
          <input
            className="input-field"
            value={form.name}
            onChange={e => { const name = e.target.value; set({ name, slug: toSlug(name) }); }}
          />
        </div>
        <div>
          <label className="input-label">Slug *</label>
          <input className="input-field" value={form.slug} onChange={e => set({ slug: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="input-label">Country</label>
        <input className="input-field" placeholder="e.g. France" value={form.country} onChange={e => set({ country: e.target.value })} />
      </div>

      <div>
        <label className="input-label">Description</label>
        <textarea className="input-field" rows={3} value={form.description} onChange={e => set({ description: e.target.value })} />
      </div>

      <ImageUploader
        label="Cover Image"
        folder="destinations"
        value={form.coverImage}
        onChange={coverImage => set({ coverImage })}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="h-4 w-4 accent-primary-600" checked={form.active} onChange={e => set({ active: e.target.checked })} />
        <span className="text-sm font-medium text-secondary-700">Active</span>
      </label>
    </div>
  );
}

function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal open onClose={onCancel} title="Delete Destination" size="sm">
      <p className="text-secondary-600 mb-6">Are you sure you want to delete this destination? This action cannot be undone.</p>
      <div className="flex gap-3 justify-end">
        <button className="btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn-accent btn-sm" onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  );
}

const TRANSLATION_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description', multiline: true },
];

export default function AdminDestinationsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DestinationFormState>(emptyForm);
  const [translationMap, setTranslationMap] = useState<TranslationMap>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: destinations, isLoading } = useQuery({
    queryKey: ['admin', 'destinations'],
    queryFn: () => adminDestinationsApi.getAll().then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminDestinationsApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'destinations'] }); toast.success('Destination deleted'); setConfirmDeleteId(null); },
    onError: () => toast.error('Failed to delete destination'),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setTranslationMap({});
    setModalOpen(true);
  };

  const openEdit = async (dest: Destination) => {
    const [translationsRes] = await Promise.all([
      adminTranslationsApi.getDestination(dest.id).catch(() => ({ data: {} as TranslationMap })),
    ]);
    setForm(fromDestination(dest));
    setTranslationMap(translationsRes.data ?? {});
    setEditingId(dest.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    setTranslationMap({});
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Name and slug are required');
      return;
    }
    setSubmitting(true);
    try {
      const req = toRequest(form);
      let entityId = editingId;
      if (editingId != null) {
        await adminDestinationsApi.update(editingId, req);
        queryClient.invalidateQueries({ queryKey: ['admin', 'destinations'] });
        toast.success('Destination updated');
      } else {
        const res = await adminDestinationsApi.create(req);
        entityId = res.data.id;
        queryClient.invalidateQueries({ queryKey: ['admin', 'destinations'] });
        toast.success('Destination created');
      }
      if (entityId != null) {
        await adminTranslationsApi.saveDestination(entityId, translationMap).catch(() => {
          toast.error('Failed to save translations');
        });
      }
      closeModal();
    } catch {
      toast.error('Failed to save destination');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const list = destinations ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Destinations</h1>
        <button className="btn-primary btn-sm" onClick={openCreate}>+ Add Destination</button>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-secondary-100 p-12 text-center text-secondary-400">No destinations yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Country</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((dest) => (
                <tr key={dest.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="px-4 py-3 font-medium text-secondary-800">{dest.name}</td>
                  <td className="px-4 py-3 text-secondary-600">{dest.country || '—'}</td>
                  <td className="px-4 py-3 text-secondary-500 font-mono text-xs">{dest.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${dest.active ? 'badge-success' : 'badge-warning'}`}>
                      {dest.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(dest)} className="text-primary-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => setConfirmDeleteId(dest.id)} className="text-accent-600 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit Destination' : 'New Destination'} size="md">
        <DestinationForm form={form} onChange={setForm} />
        <div className="mt-6">
          <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-2">Translations</p>
          <TranslationEditor
            fields={TRANSLATION_FIELDS}
            value={translationMap}
            onChange={setTranslationMap}
          />
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200 mt-6">
          <button className="btn-secondary btn-sm" onClick={closeModal}>Cancel</button>
          <button className="btn-primary btn-sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Create Destination'}
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
