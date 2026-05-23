import { renderHook, act } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

beforeEach(() => {
  localStorage.clear();
});

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
    spy.mockRestore();
  });

  it('returns null user when localStorage is empty', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('restores user from localStorage on mount', () => {
    localStorage.setItem('accessToken', 'tok');
    localStorage.setItem('user', JSON.stringify({ email: 'a@b.com', name: 'Ana', role: 'ADMIN' }));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.user).toEqual({ email: 'a@b.com', name: 'Ana', role: 'ADMIN' });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login stores tokens and updates user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      result.current.login('access123', 'refresh123', { email: 'a@b.com', name: 'Ana', role: 'ADMIN' });
    });

    expect(result.current.user).toEqual({ email: 'a@b.com', name: 'Ana', role: 'ADMIN' });
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('accessToken')).toBe('access123');
    expect(localStorage.getItem('refreshToken')).toBe('refresh123');
  });

  it('logout clears tokens and resets user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      result.current.login('access123', 'refresh123', { email: 'a@b.com', name: 'Ana', role: 'ADMIN' });
    });
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });
});
