import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '@/api/endpoints';
import { HiGlobe, HiCalendar, HiMail, HiStar } from 'react-icons/hi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminDashboardApi.getStats().then((res) => res.data),
  });

  if (isLoading) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Tours', value: stats?.totalTours ?? 0, icon: HiGlobe, color: 'bg-blue-500' },
    { label: 'New Bookings', value: stats?.newBookings ?? 0, icon: HiCalendar, color: 'bg-green-500' },
    { label: 'Unread Messages', value: stats?.unreadMessages ?? 0, icon: HiMail, color: 'bg-yellow-500' },
    { label: 'Pending Reviews', value: stats?.pendingReviews ?? 0, icon: HiStar, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500">{card.label}</p>
                <p className="text-3xl font-bold text-secondary-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
