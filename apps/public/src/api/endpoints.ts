import apiClient from './client';
import type {
  Tour,
  TourSummary,
  Category,
  Destination,
  BlogPost,
  GalleryImage,
  Review,
  PageResponse,
  CreateBookingRequest,
  CreateContactRequest,
} from '@my-travelline/shared';

export const toursApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<PageResponse<TourSummary>>('/tours', { params }),

  getFeatured: () =>
    apiClient.get<TourSummary[]>('/tours/featured'),

  getBySlug: (slug: string) =>
    apiClient.get<Tour>(`/tours/${slug}`),
};

export const categoriesApi = {
  getAll: () => apiClient.get<Category[]>('/categories'),

  getBySlug: (slug: string) =>
    apiClient.get<Category>(`/categories/${slug}`),
};

export const destinationsApi = {
  getAll: () => apiClient.get<Destination[]>('/destinations'),

  getBySlug: (slug: string) =>
    apiClient.get<Destination>(`/destinations/${slug}`),
};

export const blogApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<PageResponse<BlogPost>>('/blog', { params }),

  getBySlug: (slug: string) =>
    apiClient.get<BlogPost>(`/blog/${slug}`),
};

export const galleryApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<PageResponse<GalleryImage>>('/gallery', { params }),

  getByDestination: (destinationId: number) =>
    apiClient.get<GalleryImage[]>(`/gallery/destination/${destinationId}`),
};

export const reviewsApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get<PageResponse<Review>>('/reviews', { params }),

  getByTour: (tourId: number) =>
    apiClient.get<Review[]>(`/reviews/tour/${tourId}`),
};

export const bookingsApi = {
  create: (data: CreateBookingRequest) =>
    apiClient.post('/bookings', data),
};

export const contactApi = {
  send: (data: CreateContactRequest) =>
    apiClient.post('/contact', data),
};
