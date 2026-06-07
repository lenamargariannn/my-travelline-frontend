import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminGalleryApi, adminDestinationsApi, adminUploadApi, adminTranslationsApi } from '@/api/endpoints';
import type { GalleryImage, TranslationMap } from '@my-travelline/shared';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import TranslationEditor from '@/components/TranslationEditor';

interface UploadFormState {
  caption: string;
  destinationId: string;
  sortOrder: string;
}

const emptyUploadForm = (): UploadFormState => ({ caption: '', destinationId: '', sortOrder: '' });

const TRANSLATION_FIELDS = [
  { key: 'caption', label: 'Caption', multiline: true },
];

function ConfirmDelete({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal open onClose={onCancel} title="Delete Image" size="sm">
      <p className="text-secondary-600 mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
      <div className="flex gap-3 justify-end">
        <button className="btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
        <button className="btn-accent btn-sm" onClick={onConfirm}>Delete</button>
      </div>
    </Modal>
  );
}

export default function AdminGalleryPage() {
  const [page, setPage] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadFormState>(emptyUploadForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [translationMap, setTranslationMap] = useState<TranslationMap>({});
  const [savingTranslations, setSavingTranslations] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'gallery', page],
    queryFn: () => adminGalleryApi.getAll({ page, size: 24 }).then(r => r.data),
  });

  const { data: destinations } = useQuery({
    queryKey: ['admin', 'destinations'],
    queryFn: () => adminDestinationsApi.getAll().then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminGalleryApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] }); toast.success('Image deleted'); setConfirmDeleteId(null); },
    onError: () => toast.error('Failed to delete image'),
  });

  const openUpload = () => { setUploadForm(emptyUploadForm()); setSelectedFile(null); setUploadOpen(true); };
  const closeUpload = () => { setUploadOpen(false); setUploadForm(emptyUploadForm()); setSelectedFile(null); };

  const openEditTranslations = async (img: GalleryImage) => {
    const translationsRes = await adminTranslationsApi.getGalleryImage(img.id).catch(() => ({ data: {} as TranslationMap }));
    setTranslationMap(translationsRes.data ?? {});
    setEditingImage(img);
  };

  const closeEditTranslations = () => { setEditingImage(null); setTranslationMap({}); };

  const handleSaveTranslations = async () => {
    if (!editingImage) return;
    setSavingTranslations(true);
    try {
      await adminTranslationsApi.saveGalleryImage(editingImage.id, translationMap);
      toast.success('Translations saved');
      closeEditTranslations();
    } catch {
      toast.error('Failed to save translations');
    } finally {
      setSavingTranslations(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }
    setUploading(true);
    try {
      const { data: uploaded } = await adminUploadApi.upload(selectedFile, 'gallery');
      await adminGalleryApi.create({
        s3Key: uploaded.key,
        imageUrl: uploaded.url,
        caption: uploadForm.caption.trim() || undefined,
        sortOrder: uploadForm.sortOrder ? parseInt(uploadForm.sortOrder) : undefined,
        destinationId: uploadForm.destinationId ? parseInt(uploadForm.destinationId) : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
      toast.success('Image uploaded');
      closeUpload();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const setField = (patch: Partial<UploadFormState>) => setUploadForm(f => ({ ...f, ...patch }));

  if (isLoading) return <LoadingSpinner />;

  const images: GalleryImage[] = data?.content ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Gallery</h1>
        <button className="btn-primary btn-sm" onClick={openUpload}>+ Upload Image</button>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-xl border border-secondary-100 p-12 text-center text-secondary-400">No images yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative bg-secondary-100 rounded-lg overflow-hidden aspect-square">
              {img.imageUrl ? (
                <img src={img.imageUrl} alt={img.caption || img.s3Key} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-secondary-400 text-xs p-2 text-center break-all">
                  {img.s3Key}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                {img.caption && <p className="text-white text-xs text-center line-clamp-2">{img.caption}</p>}
                {img.destinationName && <p className="text-secondary-300 text-xs">{img.destinationName}</p>}
                <button
                  onClick={() => openEditTranslations(img)}
                  className="mt-1 text-xs text-blue-300 hover:text-blue-100"
                >
                  Translate
                </button>
                <button
                  onClick={() => setConfirmDeleteId(img.id)}
                  className="text-xs text-red-300 hover:text-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button className="btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-sm text-secondary-600">Page {page + 1} of {data.totalPages}</span>
          <button className="btn-secondary btn-sm" disabled={data.last} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      <Modal open={uploadOpen} onClose={closeUpload} title="Upload Image" size="md">
        <div className="space-y-4">
          <div>
            <label className="input-label">Image File *</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="block w-full text-sm text-secondary-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
              onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div>
            <label className="input-label">Caption</label>
            <input className="input-field" placeholder="Optional caption" value={uploadForm.caption} onChange={e => setField({ caption: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Destination</label>
              <select className="input-field" value={uploadForm.destinationId} onChange={e => setField({ destinationId: e.target.value })}>
                <option value="">— None —</option>
                {destinations?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Sort Order</label>
              <input className="input-field" type="number" min="0" value={uploadForm.sortOrder} onChange={e => setField({ sortOrder: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200 mt-6">
          <button className="btn-secondary btn-sm" onClick={closeUpload}>Cancel</button>
          <button className="btn-primary btn-sm" onClick={handleUpload} disabled={uploading || !selectedFile}>
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </Modal>

      <Modal open={editingImage != null} onClose={closeEditTranslations} title="Image Translations" size="sm">
        {editingImage && (
          <>
            {editingImage.caption && (
              <p className="text-xs text-secondary-500 mb-4">Caption: {editingImage.caption}</p>
            )}
            <TranslationEditor
              fields={TRANSLATION_FIELDS}
              value={translationMap}
              onChange={setTranslationMap}
            />
            <div className="flex gap-3 justify-end pt-4 border-t border-secondary-200 mt-6">
              <button className="btn-secondary btn-sm" onClick={closeEditTranslations}>Cancel</button>
              <button className="btn-primary btn-sm" onClick={handleSaveTranslations} disabled={savingTranslations}>
                {savingTranslations ? 'Saving…' : 'Save Translations'}
              </button>
            </div>
          </>
        )}
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
