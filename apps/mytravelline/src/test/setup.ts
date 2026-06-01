import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock react-i18next so t(key) returns the last segment of the key, capitalised
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const segment = key.split('.').pop() ?? key;
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    },
    i18n: { changeLanguage: vi.fn(), language: 'en' },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() { this.store = {}; }
  getItem(key: string) { return this.store[key] ?? null; }
  setItem(key: string, value: string) { this.store[key] = value; }
  removeItem(key: string) { delete this.store[key]; }
  get length() { return Object.keys(this.store).length; }
  key(index: number) { return Object.keys(this.store)[index] ?? null; }
}

Object.defineProperty(globalThis, 'localStorage', { value: new LocalStorageMock(), writable: true });
