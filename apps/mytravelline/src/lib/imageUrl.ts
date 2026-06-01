const CDN_BASE = (import.meta.env.VITE_CDN_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export function imageUrl(key: string | undefined | null): string {
  if (!key) return '';
  if (key.startsWith('http')) return key;
  return CDN_BASE ? `${CDN_BASE}/${key}` : `/${key}`;
}
