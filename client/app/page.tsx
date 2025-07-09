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
import { useRouter } from 'next/navigation';


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
  const router = useRouter();
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
    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-amber-100 flex flex-col h-full"
  >
    {/* Organizer Image */}
    <div className="relative h-40 w-full">
      <img
        src={organizer.image || '/placeholder.jpg'}
        alt={organizer.name}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Organizer Details */}
    <div className="p-4 flex flex-col flex-grow items-center text-center">
      {/* Organizer Name */}
      <h3 className="font-bold text-lg text-gray-900 mb-1">{organizer.name}</h3>

      {/* Event Time (first event) */}
      {organizer.events && organizer.events.length > 0 && (
        <>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {new Date(organizer.events[0].start_datetime).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </span>
          </div>

          {/* Events + Rating Row */}
          <div className="flex justify-between w-full text-sm text-gray-800 mb-4 px-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span>{organizer.event_count} events</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{organizer.rating?.toFixed(1) || '4.8'}</span>
            </div>
          </div>
        </>
      )}

      {/* View Profile Button */}
      <button
        onClick={() => router.push(`/organizers/${organizer.id}`)}
        className="mt-auto w-full max-w-xs btn btn-outline text-amber-600 border-amber-600 hover:bg-amber-50 hover:border-amber-700 focus:border-amber-700 py-2 rounded-lg font-medium flex items-center justify-center"
      >
        <span>View Profile</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
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