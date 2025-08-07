'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, BarChart3, CalendarPlus, UserCog } from 'lucide-react';
import { Users, CreditCard, Star, Eye } from 'lucide-react';

export default function OrganizerDashboard() {
  const [data, setData] = useState(null);
  const router = useRouter();
  const tabs = ['My Events', 'Upcoming', 'Analytics'];
  const [activeTab, setActiveTab] = useState('My Events');
  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [analytics, setAnalytics] = useState(null);

 useEffect(() => {
  const fetchAllTabs = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return router.push('/login');

    try {
      const res = await fetch('https://servertikiti-production.up.railway.app/auth/session', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { user } = await res.json();

      if (!user || user.role !== 'organizer') {
        router.push('/login');
        return;
      }

      const eventsRes = await fetch(`https://servertikiti-production.up.railway.app/organiser/${user.id}/events`);
      setEvents(await eventsRes.json());

      const upcomingRes = await fetch(`https://servertikiti-production.up.railway.app/organiser/${user.id}/upcoming`);
      setUpcoming(await upcomingRes.json());

      const analyticsRes = await fetch(`https://servertikiti-production.up.railway.app/organiser/${user.id}/analytics`);
      setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error('Error loading tabs', err);
    }
  };

  fetchAllTabs();
}, []);

useEffect(() => {
  const fetchDashboard = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return router.push('/login');

    try {
      const res = await fetch('https://servertikiti-production.up.railway.app/auth/session', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { user } = await res.json();

      if (!user || user.role !== 'organizer') {
        router.push('/login');
        return;
      }

      const dashboardRes = await fetch(`https://servertikiti-production.up.railway.app/organizers/${user.id}/dashboard`);
      const dashboardData = await dashboardRes.json();
      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard', err);
    }
  };

  fetchDashboard();
}, [router]);

  if (!data) return <div className="p-6 text-gray-600">Loading...</div>;

  const { organizer, total_revenue, total_attendees, average_rating } = data;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Welcome back, {organizer.name}
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
        <div className="bg-white shadow-sm sm:shadow-md rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-amber-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">Total Revenue</h2>
          <p className="text-xl sm:text-2xl font-bold text-amber-600">KSh {total_revenue.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-sm sm:shadow-md rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-amber-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">Total Attendees</h2>
          <p className="text-xl sm:text-2xl font-bold text-amber-600">{total_attendees}</p>
        </div>
        <div className="bg-white shadow-sm sm:shadow-md rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-amber-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">Average Rating</h2>
          <p className="text-xl sm:text-2xl font-bold text-amber-600">{average_rating}/5</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
        <button className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col items-center shadow-sm sm:shadow-md">
          <CalendarPlus className="mb-1 sm:mb-2 w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base font-semibold">Create New Event</span>
          <span className="text-xs sm:text-sm">Start planning your own event</span>
        </button>
        <button className="bg-white text-amber-600 border border-amber-600 hover:bg-yellow-50 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col items-center shadow-sm sm:shadow-md">
          <BarChart3 className="mb-1 sm:mb-2 w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base font-semibold">View Analytics</span>
          <span className="text-xs sm:text-sm">Track your event performance</span>
        </button>
        <button className="bg-white text-amber-600 border border-amber-600 hover:bg-yellow-50 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col items-center shadow-sm sm:shadow-md">
          <UserCog className="mb-1 sm:mb-2 w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base font-semibold">Manage Profile</span>
          <span className="text-xs sm:text-sm">Update your details</span>
        </button>
      </div>

      {/* Tabs Section */}
      <div className="mt-6 sm:mt-8">
        {/* Tabs Navigation */}
        <div className="flex border rounded-md overflow-hidden mb-4 sm:mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium ${
                activeTab === tab
                  ? 'bg-white text-amber-600 border-b-2 border-amber-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* My Events Tab */}
        {activeTab === 'My Events' && (
          <div className="space-y-3 sm:space-y-4">
            {events.length === 0 ? (
              <p className="text-gray-500">No events created yet.</p>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center bg-white p-3 sm:p-4 rounded-md border shadow-xs sm:shadow-sm"
                >
                  <img
                    src={ev.image || '/placeholder.jpg'}
                    alt={ev.title}
                    className="w-full sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-md"
                  />
                  <div className="flex-1 w-full">
                    <p className="text-base sm:text-lg font-semibold text-gray-800">{ev.title}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      {new Date(ev.start_datetime).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" /> {ev.attendees} attendees
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" /> KSh {ev.revenue?.toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" /> {ev.rating}/5
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ev.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {ev.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/organizer/events/${ev.id}`)}
                    className="text-amber-600 hover:text-amber-800 self-end sm:self-auto mt-2 sm:mt-0"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Upcoming Tab */}
        {activeTab === 'Upcoming' && (
          <div className="space-y-3 sm:space-y-4">
            {upcoming.length === 0 ? (
              <p className="text-gray-500">No upcoming events.</p>
            ) : (
              upcoming.map((ev) => (
                <div
                  key={ev.id}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center bg-white p-3 sm:p-4 rounded-md border shadow-xs sm:shadow-sm"
                >
                  <img
                    src={ev.image || '/placeholder.jpg'}
                    alt={ev.title}
                    className="w-full sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-md"
                  />
                  <div className="flex-1 w-full">
                    <p className="text-base sm:text-lg font-semibold text-gray-800">{ev.title}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      {new Date(ev.start_datetime).toLocaleString()}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" /> {ev.attendees} expected
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" /> KSh {ev.revenue?.toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" /> {ev.rating}/5
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ev.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {ev.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/organizer/events/${ev.id}`)}
                    className="text-amber-600 hover:text-amber-800 self-end sm:self-auto mt-2 sm:mt-0"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'Analytics' && analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white shadow-xs sm:shadow-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border text-center">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Events</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{analytics.total_events}</p>
            </div>
            <div className="bg-white shadow-xs sm:shadow-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border text-center">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Avg. Attendees/Event</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{analytics.avg_attendees}</p>
            </div>
            <div className="bg-white shadow-xs sm:shadow-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border text-center">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Avg. Rating</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{analytics.avg_rating}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}