const S3_BASE = (import.meta.env.VITE_S3_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export function imageUrl(key: string | undefined | null): string {
  if (!key) return '';
  if (key.startsWith('http')) return key;
  return S3_BASE ? `${S3_BASE}/${key}` : '';
}
