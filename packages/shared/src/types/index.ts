// ============================================================
// API Response Types
// ============================================================

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// ============================================================
// Core Domain Types
// ============================================================

export interface Tour {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  price: number;
  durationDays: number;
  maxGroupSize: number;
  coverImage: string;
  featured: boolean;
  status: TourStatus;
  categoryId: number;
  categoryName: string;
  destinationId: number;
  destinationName: string;
  images: TourImage[];
  itineraryDays: TourItineraryDay[];
}

export type TourStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface TourSummary {
  id: number;
  slug: string;
  title: string;
  summary: string;
  price: number;
  durationDays: number;
  coverImage: string;
  featured: boolean;
  categoryName: string;
  destinationName: string;
}

export interface TourImage {
  id: number;
  s3Key: string;
  caption: string;
  sortOrder: number;
}

export interface TourItineraryDay {
  id: number;
  dayNumber: number;
  title: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  active: boolean;
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  country: string;
  description: string;
  coverImage: string;
  active: boolean;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string;
  published: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface GalleryImage {
  id: number;
  s3Key: string;
  imageUrl: string;
  caption: string;
  sortOrder: number;
  destinationId: number;
  destinationName: string;
  createdAt: string;
}

export interface Review {
  id: number;
  authorName: string;
  authorLocation: string;
  rating: number;
  content: string;
  approved: boolean;
  tourId: number;
  tourTitle: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  travelDate: string;
  guests: number;
  message: string;
  status: BookingStatus;
  tourId: number;
  tourTitle: string;
  createdAt: string;
}

export type BookingStatus = 'NEW' | 'CONFIRMED' | 'CANCELLED';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ============================================================
// Request Types
// ============================================================

export interface CreateBookingRequest {
  customerName: string;
  email: string;
  phone?: string;
  travelDate?: string;
  guests: number;
  message?: string;
  tourId: number;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface CreateTourRequest {
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  price: number;
  durationDays?: number;
  maxGroupSize?: number;
  coverImage?: string;
  featured: boolean;
  categoryId?: number;
  destinationId?: number;
  itineraryDays?: Omit<TourItineraryDay, 'id'>[];
}

export interface CreateBlogPostRequest {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImage?: string;
  author?: string;
  tags?: string;
  published: boolean;
}

// ============================================================
// Admin Dashboard Types
// ============================================================

export interface DashboardStats {
  totalTours: number;
  newBookings: number;
  unreadMessages: number;
  pendingReviews: number;
}

