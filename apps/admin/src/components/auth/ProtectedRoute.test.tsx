import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

beforeEach(() => {
  localStorage.clear();
});

const renderProtected = () =>
  render(
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
  );

describe('ProtectedRoute', () => {
  it('redirects to /login when no token', () => {
    renderProtected();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when token exists', () => {
    localStorage.setItem('accessToken', 'test-token');
    renderProtected();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
