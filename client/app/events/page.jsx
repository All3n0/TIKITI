'use client';
import { useEffect, useState } from 'react';
import { MapPin, CalendarDays, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, [search, category]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://localhost:5557/events?search=${search}&category=${category}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="min-h-screen pb-12 px-6 bg-white">
<section className="relative bg-gradient-to-b from-amber-600 to-amber-400 text-white pt-20 pb-20 px-6 text-center">
  {/* Header */}
  <h1 className="text-3xl font-bold mb-4">All Events</h1>
  <p className="text-amber-100 max-w-xl mx-auto mb-10">
    Browse all exciting events and discover something new every day!
  </p>

  {/* Filters */}
  <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
    <input
      type="text"
      placeholder="Search by title..."
      className="flex-grow border border-amber-300 rounded-lg px-4 py-2 focus:ring-amber-600 focus:outline-none text-gray-800"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <select
      className="border border-amber-300 rounded-lg px-4 py-2 text-gray-800"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      <option value="">All Categories</option>
      <option value="music">Music</option>
      <option value="education">Education</option>
      <option value="film">Film</option>
      <option value="charity">Charity</option>
      <option value="conference">Conference</option>
    </select>
  </div>

  {/* Inverted Curve at Bottom */}
  <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0] rotate-180">
    <svg
      viewBox="0 0 500 50"
      preserveAspectRatio="none"
      className="w-full h-24"
    >
      <path
        d="M0,0 C150,100 350,-50 500,50 L500,0 L0,0 Z"
        className="fill-white"
      />
    </svg>
  </div>
</section>

      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl overflow-hidden border border-amber-100 shadow hover:shadow-md transition">
            <img
              src={event.image || '/placeholder.jpg'}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-amber-700 text-lg">{event.title}</h3>
              <p className="text-sm flex items-center text-gray-600">
                <CalendarDays className="h-4 w-4 mr-2" />
                {event.date} at {event.time}
              </p>
              <p className="text-sm flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </p>
              <p className="text-sm flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                Capacity: {event.capacity}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => router.push(`/events/${event.id}`)}
                  className="w-full btn btn-outline text-amber-600 border-amber-600 hover:bg-amber-50"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
