import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { adminUploadApi } from '@/api/endpoints';

interface ImageUploaderProps {
  value: string;
  onChange: (key: string) => void;
  folder: string;
  label?: string;
}

export default function ImageUploader({ value, onChange, folder, label = 'Cover Image' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setUploading(true);
    try {
      const { data } = await adminUploadApi.upload(file, folder);
      onChange(data.key);
      setPreviewUrl(data.url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    onChange('');
    setPreviewUrl(null);
  };

  const displayUrl = previewUrl ?? (value.startsWith('http') ? value : null);

  return (
    <div>
      <label className="input-label">{label}</label>

      {value ? (
        <div className="border border-secondary-200 rounded-lg p-3 bg-secondary-50 flex items-start gap-3">
          {displayUrl && (
            <img
              src={displayUrl}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-md flex-shrink-0 border border-secondary-200"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-secondary-500 mb-1">S3 key</p>
            <p className="text-xs font-mono text-secondary-700 break-all">{value}</p>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                className="text-xs text-primary-600 hover:underline"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : 'Replace'}
              </button>
              <button
                type="button"
                className="text-xs text-accent-600 hover:underline"
                onClick={handleClear}
                disabled={uploading}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {uploading ? (
            <p className="text-sm text-secondary-500">Uploading…</p>
          ) : (
            <>
              <p className="text-sm text-secondary-500">Drop an image here or</p>
              <p className="text-xs text-primary-600 font-medium mt-1">click to browse</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
