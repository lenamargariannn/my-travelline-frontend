import apiClient from './client';
import type {
  Tour,
  TourSummary,
  Category,
  Destination,
  BlogPost,
  GalleryImage,
  Review,
  Booking,
  ContactMessage,
  PageResponse,
  LoginRequest,
  LoginResponse,
  CreateTourRequest,
  CreateBlogPostRequest,
  DashboardStats,
} from '@my-travelline/shared';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/admin/auth/login', data),

  refresh: (refreshToken: string) =>
    apiClient.post<LoginResponse>('/admin/auth/refresh', { refreshToken }),
};

export const adminDashboardApi = {
  getStats: () => apiClient.get<DashboardStats>('/admin/dashboard'),
};

export const adminToursApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<PageResponse<TourSummary>>('/admin/tours', { params }),

  getById: (id: number) =>
    apiClient.get<Tour>(`/admin/tours/${id}`),

  create: (data: CreateTourRequest) =>
    apiClient.post<Tour>('/admin/tours', data),

  updateStatus: (id: number, status: string) =>
    apiClient.patch<Tour>(`/admin/tours/${id}/status`, { status }),

  delete: (id: number) =>
    apiClient.delete(`/admin/tours/${id}`),
};

export const adminCategoriesApi = {
  getAll: () => apiClient.get<Category[]>('/admin/categories'),

  getById: (id: number) =>
    apiClient.get<Category>(`/admin/categories/${id}`),

  create: (data: Partial<Category>) =>
    apiClient.post<Category>('/admin/categories', data),

  update: (id: number, data: Partial<Category>) =>
    apiClient.put<Category>(`/admin/categories/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/admin/categories/${id}`),
};

export const adminDestinationsApi = {
  getAll: () => apiClient.get<Destination[]>('/admin/destinations'),

  getById: (id: number) =>
    apiClient.get<Destination>(`/admin/destinations/${id}`),

  create: (data: Partial<Destination>) =>
    apiClient.post<Destination>('/admin/destinations', data),

  update: (id: number, data: Partial<Destination>) =>
    apiClient.put<Destination>(`/admin/destinations/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/admin/destinations/${id}`),
};

export const adminBookingsApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<PageResponse<Booking>>('/admin/bookings', { params }),

  getById: (id: number) =>
    apiClient.get<Booking>(`/admin/bookings/${id}`),

  updateStatus: (id: number, status: string) =>
    apiClient.patch<Booking>(`/admin/bookings/${id}/status`, { status }),
};

export const adminMessagesApi = {
  getAll: (params?: Record<string, string | number | boolean>) =>
    apiClient.get<PageResponse<ContactMessage>>('/admin/contacts', { params }),

  getById: (id: number) =>
    apiClient.get<ContactMessage>(`/admin/contacts/${id}`),

  markRead: (id: number) =>
    apiClient.patch<ContactMessage>(`/admin/contacts/${id}/read`),

  delete: (id: number) =>
    apiClient.delete(`/admin/contacts/${id}`),
};

export const adminBlogApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<PageResponse<BlogPost>>('/admin/blog', { params }),

  getById: (id: number) =>
    apiClient.get<BlogPost>(`/admin/blog/${id}`),

  create: (data: CreateBlogPostRequest) =>
    apiClient.post<BlogPost>('/admin/blog', data),

  update: (id: number, data: CreateBlogPostRequest) =>
    apiClient.put<BlogPost>(`/admin/blog/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/admin/blog/${id}`),
};

export const adminGalleryApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<PageResponse<GalleryImage>>('/admin/gallery', { params }),

  delete: (id: number) =>
    apiClient.delete(`/admin/gallery/${id}`),
};

export const adminReviewsApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<PageResponse<Review>>('/admin/reviews', { params }),

  approve: (id: number) =>
    apiClient.patch<Review>(`/admin/reviews/${id}/approve`),

  reject: (id: number) =>
    apiClient.patch<Review>(`/admin/reviews/${id}/reject`),

  delete: (id: number) =>
    apiClient.delete(`/admin/reviews/${id}`),
};

export const adminUploadApi = {
  upload: (file: File, folder: string = 'uploads') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return apiClient.post<{ key: string; url: string }>('/admin/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (key: string) =>
    apiClient.delete('/admin/uploads', { params: { key } }),
};
