import { Navigate, Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import AdminLoginPage from '@/pages/AdminLoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminToursPage from '@/pages/AdminToursPage';
import AdminCategoriesPage from '@/pages/AdminCategoriesPage';
import AdminDestinationsPage from '@/pages/AdminDestinationsPage';
import AdminBookingsPage from '@/pages/AdminBookingsPage';
import AdminMessagesPage from '@/pages/AdminMessagesPage';
import AdminBlogPage from '@/pages/AdminBlogPage';
import AdminGalleryPage from '@/pages/AdminGalleryPage';
import AdminReviewsPage from '@/pages/AdminReviewsPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tours" element={<AdminToursPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="destinations" element={<AdminDestinationsPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="contacts" element={<AdminMessagesPage />} />
        <Route path="blog" element={<AdminBlogPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
