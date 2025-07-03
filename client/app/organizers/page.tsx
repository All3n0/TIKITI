'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState([]);
  const [search, setSearch] = useState('');
  const [minEvents, setMinEvents] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchOrganizers();
  }, [search, minEvents]);

  const fetchOrganizers = async () => {
    try {
      const res = await fetch(`http://localhost:5557/organizers?search=${search}&min_events=${minEvents}`);
      const data = await res.json();
      setOrganizers(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="min-h-screen pb-12 bg-white">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-amber-600 to-amber-400 text-white pt-20 pb-20 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Organizers</h1>
        <p className="text-amber-100 max-w-xl mx-auto mb-10">
          Discover event organizers and learn more about their hosted experiences.
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 max-w-4xl mx-auto mt-8 px-4">
          <input
            type="text"
            placeholder="Search organizers..."
            className="w-full sm:flex-grow border border-amber-300 rounded-xl px-4 py-3 shadow-md focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-800 placeholder:text-white-400 transition duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min events"
            className="w-full sm:w-40 border border-amber-300 rounded-xl px-4 py-3 shadow-md focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-800"
            value={minEvents}
            onChange={(e) => setMinEvents(Number(e.target.value))}
          />
        </div>

        {/* Inverted Wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0] rotate-180">
          <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-24">
            <path d="M0,0 C150,100 350,-50 500,50 L500,0 L0,0 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* Organizer Cards */}
      <div className="max-w-6xl mx-auto mt-12 px-4">
        {organizers.length === 0 ? (
          <div className="text-center text-gray-600">
            <h2 className="text-xl font-semibold text-amber-700 mb-2">No organizers found</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizers.map((org) => (
              <div
                key={org.id}
                className="bg-white rounded-xl overflow-hidden border border-amber-100 shadow hover:shadow-md transition flex flex-col items-center text-center p-6"
              >
                <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  {org.avatar ? (
                    <img src={org.avatar} alt={org.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User className="w-10 h-10 text-amber-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-amber-700">{org.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{org.specialty}</p>
                <p className="text-gray-500 text-sm">Events: {org.eventsCount}</p>
                <div className="pt-4">
                  <button
                    onClick={() => router.push(`/organizers/${org.id}`)}
                    className="text-amber-600 border-2 border-amber-600 hover:bg-amber-100 font-semibold px-6 py-2 rounded-md transition"
                  >
                    View Organizer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
