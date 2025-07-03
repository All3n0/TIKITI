'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Music,
  CalendarCheck,
  PartyPopper,
  BookOpen,
  HeartHandshake,
  Film,
  Calendar,MapPin,
  Users,
  Sparkles
} from 'lucide-react';
import router from 'next/router';

function getCategoryIcon(name: string) {
  const iconMap: Record<string, JSX.Element> = {
    music: <Music />,
    conference: <CalendarCheck />,
    festival: <PartyPopper />,
    education: <BookOpen />,
    charity: <HeartHandshake />,
    film: <Film />,
    networking: <Users />,
    art: <Sparkles />
  };
  return iconMap[name.toLowerCase()] || <Sparkles />;
[]
}
async function getFeaturedEvents() {
  const res = await fetch('http://localhost:5557/featured-events');
  if (!res.ok) {
    throw new Error('Failed to fetch featured events');
  }
  return res.json();
}

async function getFeaturedOrganizers() {
  const res = await fetch('http://localhost:5557/organizers/featured/summary');
  if (!res.ok) {
    throw new Error('Failed to fetch featured organizers');
  }
  return res.json();
}

async function getEventCounts() {
  const res = await fetch('http://localhost:5557/events/counts');
  if (!res.ok) {
    throw new Error('Failed to fetch event counts');
  }
  return res.json();
}

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [featuredOrganizers, setFeaturedOrganizers] = useState<any[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<any[]>([]);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [events, organizers, counts] = await Promise.all([
        getFeaturedEvents(),
        getFeaturedOrganizers(),
        getEventCounts()
      ]);
      setFeaturedEvents(events);
      setFeaturedOrganizers(organizers);
      setCategoryCounts(counts);
    }

    fetchData();
  }, []);

  const visibleEvents = showAllEvents ? featuredEvents : featuredEvents.slice(0, 4);
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
<section className="relative pb-32 pt-20 px-4 text-center bg-gradient-to-b from-amber-600 to-amber-400 overflow-hidden">
  {/* Content */}
  <div className="relative z-10">
    <h1 className="text-4xl font-bold mb-6 text-white">Discover and Book Amazing Events</h1>
    <p className="text-xl mb-8 max-w-2xl mx-auto text-amber-100">
      Find local events, concerts, festivals, and more. Join millions of people experiencing the best events in your city.
    </p>
    <div className="flex justify-center gap-4">
      <Link 
        href="/events" 
        className="bg-white text-amber-700 px-6 py-3 rounded-lg font-medium hover:bg-amber-50 transition shadow-lg"
      >
        Explore Events
      </Link>
      <Link 
        href="/events/create" 
        className="bg-amber-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-600 transition shadow-lg"
      >
        Create Event
      </Link>
    </div>
  </div>

  {/* Elliptical curve at the bottom */}
  <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
  <svg 
    viewBox="0 0 500 50"
    preserveAspectRatio="none"
    className="w-full h-24 rotate-180"
  >
    <path 
      d="M0,0 C150,100 350,-50 500,50 L500,0 L0,0 Z" 
      className="fill-white"
    />
  </svg>
</div>

</section>


<section className="py-12 px-4 max-w-6xl mx-auto">
  <h2 className="text-2xl font-bold mb-6 text-amber-700">Browse by Category</h2>

  <div className="flex overflow-x-auto gap-4 scrollbar-hide">
    {categoryCounts.map((category: { name: string; count: number }) => (
      <div
        key={category.name}
        className="flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 bg-amber-100 text-center p-4 rounded-xl shadow-sm"
      >
        <div className="text-amber-600 mb-2 text-3xl flex justify-center">
          {getCategoryIcon(category.name)}
        </div>
        <h3 className="font-semibold text-md capitalize text-amber-900">{category.name}</h3>
        <p className="text-sm text-amber-700">{category.count} events</p>
      </div>
    ))}
  </div>
</section>
{/* Featured Events Section */}
<section className="py-12 px-4 bg-amber-50">
  <div className="max-w-6xl mx-auto">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold text-amber-700">Featured Events</h2>
      {!showAllEvents && featuredEvents.length > 4 && (
        <button
          onClick={() => setShowAllEvents(true)}
          className="text-sm text-amber-700 font-medium hover:underline"
        >
          See more events →
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {visibleEvents.map((event: any) => (
        <div
          key={event.id}
          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-amber-100"
        >
          <img
            src={event.image || '/placeholder.jpg'}
            alt={event.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg text-amber-800 mb-1">{event.title}</h3>
            <p className="flex items-center text-gray-600 gap-1">
    <Calendar className="w-4 h-4 text-grey-700" />
    {event.date} at {event.time}
  </p>

  {/* Location */}
  <p className="flex items-center text-amber-700 gap-1">
    <MapPin className="w-4 h-4" />
    {event.location}
  </p>
            <div className="flex justify-between text-sm text-gray-700 mb-4">
              <p className="text-yellow-600">⭐ {event.rating}</p>
  <p className="flex items-center text-gray-500 gap-1">
    <Users className="w-4 h-4" />
    {event.attendees.toLocaleString()} capacity
  </p>
         </div>

            <Link
              href={`/events/${event.id}`}
              className="block text-center bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



{/* Featured Organizers */}
<section className="py-12 px-4 bg-amber-50">
  <div className="max-w-6xl mx-auto">
    {/* Header with link */}
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-bold text-amber-700">Featured Organizers</h2>
      <Link
        href="/organizers"
        className="text-sm text-amber-700 font-medium hover:underline"
      >
        See all organizers →
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {featuredOrganizers.map((organizer: any) => (
    <div
      key={organizer.id}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-amber-100 text-center"
    >
      {/* Organizer Image */}
      <img
        src={organizer.image || '/placeholder.jpg'}
        alt={organizer.name}
        className="w-full h-40 object-cover"
      />

      {/* Organizer Details */}
      <div className="p-4">
        {/* Organizer Name */}
        <h3 className="font-bold text-lg text-black mb-1">{organizer.name}</h3>

        {/* Event Time (first event) */}
        {organizer.events && organizer.events.length > 0 && (
          <>
            <p className="text-sm text-gray-700 mb-2">
              {new Date(organizer.events[0].start_datetime).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>

            {/* Events + Rating Row */}
            <div className="flex justify-between text-sm text-black font-medium mb-4 px-2">
              <span>{organizer.events.length} events</span>
              <span>⭐ {organizer.rating?.toFixed(1) || '4.8'}</span>
            </div>
          </>
        )}

        {/* View Profile Button */}
<button
  onClick={() => router.push(`/organizers/${organizer.id}`)}
  className="btn btn-outline text-amber-600 border border-amber-600 hover:border-amber-700 focus:border-amber-700 p-2 rounded-md font-bold"
>
  View Profile
</button>


      </div>
    </div>
  ))}
</div>

  </div>
</section>



{/* Newsletter Section */}
<section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-amber-700 h-80">
  <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
    <h2 className="text-2xl font-bold text-amber-700 mb-4">Stay Updated</h2>
    <p className="text-gray-700 mb-6">
      Subscribe to our newsletter and never miss the latest events and updates.
    </p>
    
    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto ">
      <input 
        type="email" 
        placeholder="Enter your email" 
        className="flex-grow px-4 py-2 border border-amber-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-700"
      />
      <button className="bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-800 transition">
        Subscribe
      </button>
    </div>
  </div>
</section>

    </main>
  );
}