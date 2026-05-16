import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TourCard from './TourCard';
import type { TourSummary } from '@/types';

const mockTour: TourSummary = {
  id: 1,
  slug: 'paris-adventure',
  title: 'Paris Adventure',
  summary: 'Explore the city of lights',
  price: 1299,
  durationDays: 7,
  coverImage: '',
  featured: true,
  categoryName: 'Cultural',
  destinationName: 'Paris',
};

const renderCard = (tour: TourSummary = mockTour) =>
  render(
    <MemoryRouter>
      <TourCard tour={tour} />
    </MemoryRouter>
  );

describe('TourCard', () => {
  it('renders the tour title', () => {
    renderCard();
    expect(screen.getByText('Paris Adventure')).toBeInTheDocument();
  });

  it('renders the formatted price', () => {
    renderCard();
    expect(screen.getByText('$1,299')).toBeInTheDocument();
  });

  it('renders duration in days', () => {
    renderCard();
    expect(screen.getByText('7 Days')).toBeInTheDocument();
  });

  it('renders singular "Day" for 1-day tours', () => {
    renderCard({ ...mockTour, durationDays: 1 });
    expect(screen.getByText('1 Day')).toBeInTheDocument();
  });

  it('shows Featured badge when tour.featured is true', () => {
    renderCard();
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('hides Featured badge when tour.featured is false', () => {
    renderCard({ ...mockTour, featured: false });
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('links to the correct tour detail page', () => {
    renderCard();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/tours/paris-adventure');
  });

  it('renders category and destination names', () => {
    renderCard();
    expect(screen.getByText('Cultural')).toBeInTheDocument();
    // destination appears as "• Paris" in the span
    expect(screen.getByText('• Paris')).toBeInTheDocument();
  });
});
