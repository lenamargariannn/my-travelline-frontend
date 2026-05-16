import { Routes, Route } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import ToursPage from '@/pages/public/ToursPage';
import TourDetailPage from '@/pages/public/TourDetailPage';
import DestinationsPage from '@/pages/public/DestinationsPage';
import DestinationDetailPage from '@/pages/public/DestinationDetailPage';
import GalleryPage from '@/pages/public/GalleryPage';
import BlogPage from '@/pages/public/BlogPage';
import BlogPostPage from '@/pages/public/BlogPostPage';
import AboutPage from '@/pages/public/AboutPage';
import ContactPage from '@/pages/public/ContactPage';
import NotFoundPage from '@/pages/public/NotFoundPage';

// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import AdminToursPage from '@/pages/admin/AdminToursPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
import AdminDestinationsPage from '@/pages/admin/AdminDestinationsPage';
import AdminBookingsPage from '@/pages/admin/AdminBookingsPage';
import AdminMessagesPage from '@/pages/admin/AdminMessagesPage';
import AdminBlogPage from '@/pages/admin/AdminBlogPage';
import AdminGalleryPage from '@/pages/admin/AdminGalleryPage';
import AdminReviewsPage from '@/pages/admin/AdminReviewsPage';

function App() {
  return (
    <Routes>
      {/* Public Website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tours" element={<ToursPage />} />
        <Route path="/tours/:slug" element={<TourDetailPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Login (standalone) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Dashboard (protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="tours" element={<AdminToursPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="destinations" element={<AdminDestinationsPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="blog" element={<AdminBlogPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
