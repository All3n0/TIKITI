'use client';
import { useEffect, useState } from 'react';
import { UserCircle, BarChart3, CalendarPlus, UserCog } from 'lucide-react';

export default function OrganizerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5557/organizers/1/dashboard') // Replace with dynamic organizer ID
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6 text-gray-600">Loading...</div>;

  const { organizer, today_event, total_revenue, total_attendees, average_rating } = data;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Welcome header */}
      <div className="flex items-center gap-4 mb-8">
        <UserCircle className="w-12 h-12 text-amber-600" />
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, {organizer.name}
        </h1>
      </div>

      {/* Today’s summary cards */}
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

      {/* Actions row */}
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

      {/* Tabs (Skeleton placeholder) */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Events</h2>
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex gap-4">
            <button className="border-b-2 border-amber-600 text-amber-600 px-4 py-2 font-semibold">
              My Events
            </button>
            <button className="text-gray-500 hover:text-gray-800 px-4 py-2">
              Upcoming
            </button>
            <button className="text-gray-500 hover:text-gray-800 px-4 py-2">
              Analytics
            </button>
          </nav>
        </div>
        {/* My Events Cards will go here (next step) */}
        <div className="text-gray-500 text-sm italic">Event cards with CRUD coming next...</div>
      </div>
    </div>
  );
}
