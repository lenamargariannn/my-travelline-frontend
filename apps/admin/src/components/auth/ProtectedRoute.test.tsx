import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '@/hooks/AuthProvider';

beforeEach(() => {
  localStorage.clear();
});

const renderProtected = () =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

describe('ProtectedRoute', () => {
  it('redirects to /login when no token', () => {
    renderProtected();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when token exists', async () => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('user', JSON.stringify({ email: 'a@b.com', name: 'Ana', role: 'ADMIN' }));
    renderProtected();
    await waitFor(() => expect(screen.getByText('Protected Content')).toBeInTheDocument());
  });
});


