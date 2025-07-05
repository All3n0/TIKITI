'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, BarChart3, CalendarPlus, UserCog } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { CalendarDays, TrendingUp, FolderOpen } from 'lucide-react';
import { Users, CreditCard, Star, Eye, Image as ImageIcon } from 'lucide-react';

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
    try {
      const res = await fetch('http://localhost:5557/auth/session', { credentials: 'include' });
      const user = await res.json();
      if (!user || user.role !== 'organizer') {
        router.push('/login');
        return;
      }

      // Events
      const eventsRes = await fetch(`http://localhost:5557/organiser/${user.id}/events`);
      setEvents(await eventsRes.json());

      // Upcoming
      const upcomingRes = await fetch(`http://localhost:5557/organiser/${user.id}/upcoming`);
      setUpcoming(await upcomingRes.json());

      // Analytics
      const analyticsRes = await fetch(`http://localhost:5557/organiser/${user.id}/analytics`);
      setAnalytics(await analyticsRes.json());
    } catch (err) {
      console.error('Error loading tabs', err);
    }
  };

  fetchAllTabs();
}, []);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Get logged-in user session
        const res = await fetch('http://localhost:5557/auth/session', {
          credentials: 'include', // Important for cookies
        });
        const user = await res.json();

        if (!user || user.role !== 'organizer') {
          router.push('/login');
          return;
        }

        const dashboardRes = await fetch(`http://localhost:5557/organizers/${user.id}/dashboard`);
        const dashboardData = await dashboardRes.json();
        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard', err);
      }
    };

    fetchDashboard();
  }, [router]);

  if (!data) return <div className="p-6 text-gray-600">Loading...</div>;

  const { organizer, today_event, total_revenue, total_attendees, average_rating } = data;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <UserCircle className="w-12 h-12 text-amber-600" />
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, {organizer.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6 text-center border border-amber-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h2>
          <p className="text-2xl font-bold text-amber-600">KSh {total_revenue.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center border border-amber-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Attendees</h2>
          <p className="text-2xl font-bold text-amber-600">{total_attendees}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center border border-amber-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Average Rating</h2>
          <p className="text-2xl font-bold text-amber-600">{average_rating}/5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-6 py-4 flex flex-col items-center shadow-md">
          <CalendarPlus className="mb-2 w-6 h-6" />
          <span className="font-semibold">Create New Event</span>
          <span className="text-sm">Start planning your own event</span>
        </button>
        <button className="bg-white text-amber-600 border border-amber-600 hover:bg-yellow-50 rounded-xl px-6 py-4 flex flex-col items-center shadow-md">
          <BarChart3 className="mb-2 w-6 h-6" />
          <span className="font-semibold">View Analytics</span>
          <span className="text-sm">Track your event performance</span>
        </button>
        <button className="bg-white text-amber-600 border border-amber-600 hover:bg-yellow-50 rounded-xl px-6 py-4 flex flex-col items-center shadow-md">
          <UserCog className="mb-2 w-6 h-6" />
          <span className="font-semibold">Manage Profile</span>
          <span className="text-sm">Update your details</span>
        </button>
      </div>

<div className="mt-8">
  {/* Tabs */}
  <div className="flex border rounded-md overflow-hidden mb-6">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`w-full py-2 text-sm font-medium ${
          activeTab === tab
            ? 'bg-white text-amber-600 border-b-2 border-amber-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* My Events */}
  {activeTab === 'My Events' && (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-gray-500">No events created yet.</p>
      ) : (
        events.map((ev) => (
          <div
            key={ev.id}
            className="flex gap-4 items-center bg-white p-4 rounded-md border shadow-sm"
          >
            {/* Image */}
            <img
              src={ev.image || '/placeholder.jpg'}
              alt={ev.title}
              className="w-24 h-24 object-cover rounded-md"
            />

            {/* Details */}
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-800">{ev.title}</p>
              <p className="text-sm text-gray-500 mb-2">{new Date(ev.start_datetime).toLocaleDateString()}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {ev.attendees} attendees
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" /> KSh {ev.revenue?.toFixed(2)}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" /> {ev.rating}/5
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  ev.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {ev.status}
                </span>
              </div>
            </div>

            {/* Eye Icon Link */}
            <button
              onClick={() => router.push(`/organizer/events/${ev.id}`)}
              className="text-amber-600 hover:text-amber-800"
              title="View Details"
            >
              <Eye className="w-6 h-6" />
            </button>
          </div>
        ))
      )}
    </div>
  )}

  {/* Upcoming */}
  {activeTab === 'Upcoming' && (
    <div className="space-y-4">
      {upcoming.length === 0 ? (
        <p className="text-gray-500">No upcoming events.</p>
      ) : (
        upcoming.map((ev) => (
          <div
            key={ev.id}
            className="flex gap-4 items-center bg-white p-4 rounded-md border shadow-sm"
          >
            <img
              src={ev.image || '/placeholder.jpg'}
              alt={ev.title}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-800">{ev.title}</p>
              <p className="text-sm text-gray-500 mb-2">{new Date(ev.start_datetime).toLocaleString()}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {ev.attendees} expected
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" /> KSh {ev.revenue?.toFixed(2)}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" /> {ev.rating}/5
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
              className="text-amber-600 hover:text-amber-800"
              title="View Details"
            >
              <Eye className="w-6 h-6" />
            </button>
          </div>
        ))
      )}
    </div>
  )}

  {/* Analytics (unchanged) */}
  {activeTab === 'Analytics' && analytics && (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white shadow-sm rounded-xl p-4 border text-center">
        <p className="text-sm text-gray-500 mb-1">Total Events</p>
        <p className="text-2xl font-bold text-amber-600">{analytics.total_events}</p>
      </div>
      <div className="bg-white shadow-sm rounded-xl p-4 border text-center">
        <p className="text-sm text-gray-500 mb-1">Avg. Attendees/Event</p>
        <p className="text-2xl font-bold text-amber-600">{analytics.avg_attendees}</p>
      </div>
      <div className="bg-white shadow-sm rounded-xl p-4 border text-center">
        <p className="text-sm text-gray-500 mb-1">Avg. Rating</p>
        <p className="text-2xl font-bold text-amber-600">{analytics.avg_rating}</p>
      </div>
    </div>
  )}
</div>

    </div>
  );
}
