'use client';
import { useEffect, useState } from 'react';
import { MapPin, CalendarDays, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
function CustomDropdown({ category, setCategory }) {
  const [open, setOpen] = useState(false);

  const categories = [
    { label: 'All Categories', value: '' },
    { label: 'Music', value: 'music' },
    { label: 'Education', value: 'education' },
    { label: 'Film', value: 'film' },
    { label: 'Charity', value: 'charity' },
    { label: 'Conference', value: 'conference' },
  ];

  return (
    <div className="relative w-full sm:w-60">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left border border-amber-300 rounded-xl px-4 py-3 shadow-md bg-white text-gray-800 focus:ring-2 focus:ring-amber-500 transition duration-200"
      >
        {categories.find((c) => c.value === category)?.label || 'All Categories'}
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-amber-300 rounded-b-xl shadow-lg overflow-hidden">
          {categories.map((cat, index) => (
            <div key={cat.value}>
              <div
                onClick={() => {
                  setCategory(cat.value);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-amber-100 cursor-pointer text-gray-800 transition duration-150"
              >
                {cat.label}
              </div>
              {index < categories.length - 1 && (
                <div className="mx-4 border-b border-amber-100"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
    <section className="min-h-screen pb-12  bg-white">
<section className="relative bg-gradient-to-b from-amber-600 to-amber-400 text-white pt-20 pb-20 px-6 text-center">
  {/* Header */}
  <h1 className="text-3xl font-bold mb-4">All Events</h1>
  <p className="text-amber-100 max-w-xl mx-auto mb-10">
    Browse all exciting events and discover something new every day!
  </p>

  {/* Filters */}
  <div className="flex flex-col sm:flex-row items-center gap-4 max-w-4xl mx-auto mt-8 px-4">
  <input
    type="text"
    placeholder="Search by title..."
    className="w-full sm:flex-grow border border-amber-300 rounded-xl px-4 py-3 shadow-md focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-800 placeholder:text-white-400 transition duration-200"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

<CustomDropdown category={category} setCategory={setCategory} />


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
      <div className="max-w-6xl mx-auto mt-12 px-4">
  {events.length === 0 ? (
    <div className="text-center text-gray-600">
      <h2 className="text-xl font-semibold text-amber-700 mb-2">No events found</h2>
      <p>Try adjusting your search or filter.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-xl overflow-hidden border border-amber-100 shadow hover:shadow-md transition"
        >
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
            <p className="text-sm flex items-center text-amber-600">
              <MapPin className="h-4 w-4 mr-2" />
              {event.location}
            </p>
            <p className="text-sm flex items-center text-amber-600">
              <Users className="h-4 w-4 mr-2" />
              Capacity: {event.capacity}
            </p>
            <div className="pt-2">
              <div className="pt-2 flex justify-center">
  <button
    onClick={() => router.push(`/events/${event.id}`)}
    className="btn btn-outline text-amber-600 border-amber-600 hover:text-amber-800 font-bold border-2 rounded-md px-6 py-2 transition hover:bg-yellow-100"
  >
    View Details
  </button>
</div>

            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

    </section>
  );
}
