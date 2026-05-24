import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminCategoriesApi } from '@/api/endpoints';
import type { Category } from '@my-travelline/shared';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

const toSlug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  active: boolean;
}

const emptyForm = (): CategoryFormState => ({
  name: '', slug: '', description: '', coverImage: '', active: true,
});

function fromCategory(c: Category): CategoryFormState {
  return {
    name: c.name,
    slug: c.slug,
    description: c.description ?? '',
    coverImage: c.coverImage ?? '',
    active: c.active,
  };
}

function toRequest(f: CategoryFormState): Partial<Category> {
  return {
    name: f.name.trim(),
    slug: f.slug.trim(),
    description: f.description.trim() || undefined,
    coverImage: f.coverImage.trim() || undefined,
    active: f.active,
  };
}

interface FormProps { form: CategoryFormState; onChange: (f: CategoryFormState) => void; }

function CategoryForm({ form, onChange }: FormProps) {
  const set = (patch: Partial<CategoryFormState>) => onChange({ ...form, ...patch });

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
        <label className="input-label">Description</label>
        <textarea className="input-field" rows={3} value={form.description} onChange={e => set({ description: e.target.value })} />
      </div>

      <div>
        <label className="input-label">Cover Image Key (S3)</label>
        <input
          className="input-field"
          placeholder="e.g. categories/adventure.jpg"
          value={form.coverImage}
          onChange={e => set({ coverImage: e.target.value })}
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="h-4 w-4 accent-primary-600" checked={form.active} onChange={e => set({ active: e.target.checked })} />
        <span className="text-sm font-medium text-secondary-700">Active</span>
      </label>
    </div>
  );
}

function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal open onClose={onCancel} title="Delete Category" size="sm">
      <p className="text-secondary-600 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
      <div className="flex gap-3 justify-end">
        <button className="btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn-accent btn-sm" onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  );
}

export default function AdminCategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => adminCategoriesApi.getAll().then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Category>) => adminCategoriesApi.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); toast.success('Category created'); closeModal(); },
    onError: () => toast.error('Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) => adminCategoriesApi.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); toast.success('Category updated'); closeModal(); },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminCategoriesApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); toast.success('Category deleted'); setConfirmDeleteId(null); },
    onError: () => toast.error('Failed to delete category'),
  });

  const openCreate = () => { setEditingId(null); setForm(emptyForm()); setModalOpen(true); };
  const openEdit = (cat: Category) => { setForm(fromCategory(cat)); setEditingId(cat.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(emptyForm()); };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Name and slug are required');
      return;
    }
    setSubmitting(true);
    const req = toRequest(form);
    if (editingId != null) {
      await updateMutation.mutateAsync({ id: editingId, data: req });
    } else {
      await createMutation.mutateAsync(req);
    }
    setSubmitting(false);
  };

  if (isLoading) return <LoadingSpinner />;

  const list = categories ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Categories</h1>
        <button className="btn-primary btn-sm" onClick={openCreate}>+ Add Category</button>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-secondary-100 p-12 text-center text-secondary-400">No categories yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((cat) => (
                <tr key={cat.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="px-4 py-3 font-medium text-secondary-800">{cat.name}</td>
                  <td className="px-4 py-3 text-secondary-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${cat.active ? 'badge-success' : 'badge-warning'}`}>
                      {cat.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(cat)} className="text-primary-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => setConfirmDeleteId(cat.id)} className="text-accent-600 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit Category' : 'New Category'} size="md">
        <CategoryForm form={form} onChange={setForm} />
        <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200 mt-6">
          <button className="btn-secondary btn-sm" onClick={closeModal}>Cancel</button>
          <button className="btn-primary btn-sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Create Category'}
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
