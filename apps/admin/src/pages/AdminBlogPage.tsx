import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminBlogApi } from '@/api/endpoints';
import type { BlogPost, CreateBlogPostRequest } from '@my-travelline/shared';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import ImageUploader from '@/components/ui/ImageUploader';

const toSlug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

interface BlogFormState {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string;
  published: boolean;
}

const emptyForm = (): BlogFormState => ({
  title: '', slug: '', summary: '', content: '', coverImage: '', author: '', tags: '', published: false,
});

function fromPost(p: BlogPost): BlogFormState {
  return {
    title: p.title,
    slug: p.slug,
    summary: p.summary ?? '',
    content: p.content ?? '',
    coverImage: p.coverImage ?? '',
    author: p.author ?? '',
    tags: p.tags ?? '',
    published: p.published,
  };
}

function toRequest(f: BlogFormState): CreateBlogPostRequest {
  return {
    title: f.title.trim(),
    slug: f.slug.trim(),
    summary: f.summary.trim() || undefined,
    content: f.content.trim(),
    coverImage: f.coverImage.trim() || undefined,
    author: f.author.trim() || undefined,
    tags: f.tags.trim() || undefined,
    published: f.published,
  };
}

interface FormProps { form: BlogFormState; onChange: (f: BlogFormState) => void; }

function BlogForm({ form, onChange }: FormProps) {
  const set = (patch: Partial<BlogFormState>) => onChange({ ...form, ...patch });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">Title *</label>
          <input
            className="input-field"
            value={form.title}
            onChange={e => { const title = e.target.value; set({ title, slug: toSlug(title) }); }}
          />
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
        <label className="input-label">Content *</label>
        <textarea className="input-field" rows={8} value={form.content} onChange={e => set({ content: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">Author</label>
          <input className="input-field" placeholder="e.g. Jane Smith" value={form.author} onChange={e => set({ author: e.target.value })} />
        </div>
        <div>
          <label className="input-label">Tags</label>
          <input className="input-field" placeholder="e.g. travel, europe, tips" value={form.tags} onChange={e => set({ tags: e.target.value })} />
        </div>
      </div>

      <ImageUploader
        label="Cover Image"
        folder="blog"
        value={form.coverImage}
        onChange={coverImage => set({ coverImage })}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="h-4 w-4 accent-primary-600" checked={form.published} onChange={e => set({ published: e.target.checked })} />
        <span className="text-sm font-medium text-secondary-700">Published</span>
      </label>
    </div>
  );
}

function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal open onClose={onCancel} title="Delete Post" size="sm">
      <p className="text-secondary-600 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
      <div className="flex gap-3 justify-end">
        <button className="btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn-accent btn-sm" onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  );
}

export default function AdminBlogPage() {
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogFormState>(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'blog', page],
    queryFn: () => adminBlogApi.getAll({ page, size: 20 }).then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (req: CreateBlogPostRequest) => adminBlogApi.create(req),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] }); toast.success('Post created'); closeModal(); },
    onError: () => toast.error('Failed to create post'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, req }: { id: number; req: CreateBlogPostRequest }) => adminBlogApi.update(id, req),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] }); toast.success('Post updated'); closeModal(); },
    onError: () => toast.error('Failed to update post'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminBlogApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] }); toast.success('Post deleted'); setConfirmDeleteId(null); },
    onError: () => toast.error('Failed to delete post'),
  });

  const openCreate = () => { setEditingId(null); setForm(emptyForm()); setModalOpen(true); };

  const openEdit = async (post: BlogPost) => {
    try {
      const full = await adminBlogApi.getById(post.id).then(r => r.data);
      setForm(fromPost(full));
      setEditingId(full.id);
      setModalOpen(true);
    } catch {
      toast.error('Failed to load post');
    }
  };

  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(emptyForm()); };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      toast.error('Title, slug, and content are required');
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

  const posts = data?.content ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Blog Posts</h1>
        <button className="btn-primary btn-sm" onClick={openCreate}>+ New Post</button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-secondary-100 p-12 text-center text-secondary-400">No posts yet.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Author</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Date</th>
                <th className="text-right px-4 py-3 font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="px-4 py-3 font-medium text-secondary-800">{post.title}</td>
                  <td className="px-4 py-3 text-secondary-600">{post.author || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${post.published ? 'badge-success' : 'badge-warning'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary-500 text-xs">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(post)} className="text-primary-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => setConfirmDeleteId(post.id)} className="text-accent-600 hover:underline text-xs">Delete</button>
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

      <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit Post' : 'New Post'} size="xl">
        <BlogForm form={form} onChange={setForm} />
        <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200 mt-6">
          <button className="btn-secondary btn-sm" onClick={closeModal}>Cancel</button>
          <button className="btn-primary btn-sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Create Post'}
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
