"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LazyRow from "../../components/Lazyrow";

export default function OrganizerDetailsPage({ params }) {
  const [organizer, setOrganizer] = useState(null);
  const [organizers, setOrganizers] = useState([]); // Added organizers state
  const [filtered, setFiltered] = useState([]); // Added filtered state
  const [searchTerm, setSearchTerm] = useState(""); // Added searchTerm state
  const [statusFilter, setStatusFilter] = useState("all"); // Added statusFilter state
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [sponsorsLoading, setSponsorsLoading] = useState(false);
  const [eventsPage, setEventsPage] = useState(1);
  const [sponsorsPage, setSponsorsPage] = useState(1);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const [hasMoreSponsors, setHasMoreSponsors] = useState(true);
  const router = useRouter();
  const organizerId = params.id;

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        const token = localStorage.getItem('managementToken');
        if (!token) {
          router.push('/management/login');
          return;
        }

        const res = await fetch(`https://servertikiti-production.up.railway.app/management/organizers/${organizerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('managementToken');
          }
          router.push('/management/login');
          return;
        }

        const data = await res.json();
        setOrganizer(data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('managementToken');
        router.push('/management/login');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizer();
  }, [organizerId, router]);

  const fetchOrganizerEvents = async (page = 1) => {
    setEventsLoading(true);
    try {
      const token = localStorage.getItem('managementToken');
      if (!token) {
        router.push('/management/login');
        return;
      }

      const res = await fetch(
        `https://servertikiti-production.up.railway.app/management/organizers/${organizerId}/events?page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.ok) {
        const data = await res.json();
        setEvents(prev => (page === 1 ? data.events : [...prev, ...data.events]));
        setHasMoreEvents(data.current_page < data.pages);
        setEventsPage(data.current_page);
      } else if (res.status === 401) {
        localStorage.removeItem('managementToken');
        router.push('/management/login');
      }
    } catch (err) {
      console.error("Error fetching organizer events:", err);
      localStorage.removeItem('managementToken');
      router.push('/management/login');
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchOrganizerSponsors = async (page = 1) => {
    setSponsorsLoading(true);
    try {
      const token = localStorage.getItem('managementToken');
      if (!token) {
        router.push('/management/login');
        return;
      }

      const res = await fetch(
        `https://servertikiti-production.up.railway.app/management/organizers/${organizerId}/sponsors?page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.ok) {
        const data = await res.json();
        setSponsors(prev => (page === 1 ? data.sponsors : [...prev, ...data.sponsors]));
        setHasMoreSponsors(data.current_page < data.pages);
        setSponsorsPage(data.current_page);
      } else if (res.status === 401) {
        localStorage.removeItem('managementToken');
        router.push('/management/login');
      }
    } catch (err) {
      console.error("Error fetching organizer sponsors:", err);
      localStorage.removeItem('managementToken');
      router.push('/management/login');
    } finally {
      setSponsorsLoading(false);
    }
  };

  useEffect(() => {
    if (organizer) {
      fetchOrganizerEvents();
      fetchOrganizerSponsors();
    }
  }, [organizer]);

  const loadMoreEvents = () => {
    fetchOrganizerEvents(eventsPage + 1);
  };

  const loadMoreSponsors = () => {
    fetchOrganizerSponsors(sponsorsPage + 1);
  };

  if (loading) return <div className="text-center py-20">Loading organizer details...</div>;
  if (!organizer) return <div className="text-center py-20">Organizer not found</div>;


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Organizer Profile Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            {organizer.logo ? (
              <img
                src={organizer.logo}
                alt={organizer.name}
                className="w-32 h-32 object-contain rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-teal-800">{organizer.name}</h1>
              {organizer.speciality && (
                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                  {organizer.speciality}
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{organizer.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${organizer.contact_email || organizer.email}`}
                      className="text-teal-600 hover:underline"
                    >
                      {organizer.contact_email || organizer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href={`tel:${organizer.phone}`}
                      className="text-teal-600 hover:underline"
                    >
                      {organizer.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {organizer.website && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <svg
                        className="w-5 h-5 text-teal-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a
                        href={organizer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:underline"
                      >
                        {organizer.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-teal-600">
                      {new Date(organizer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-800">Events Organized</h2>
          <div className="text-sm bg-teal-800 px-3 py-1 rounded-full">
            <span className="font-medium ">{organizer.events_count}</span> total events
          </div>
        </div>

        <LazyRow
  items={events}
  loading={eventsLoading}
  hasMore={hasMoreEvents}
  onLoadMore={loadMoreEvents}
  renderItem={(event) => (
    <div 
      key={event.id} 
      className="flex-shrink-0 w-72 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
    >
      {event.image && (
        <div className="h-40 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{event.title}</h3>
          <span
            className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
              event.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : event.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {event.status}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="line-clamp-1">
            {new Date(event.start_datetime).toLocaleDateString()} -{' '}
            {new Date(event.end_datetime).toLocaleDateString()}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{event.description}</p>
        
        {event.venue && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">
              {event.venue.name}, {event.venue.city}
            </span>
          </div>
        )}
      </div>
    </div>
  )}
  emptyMessage="This organizer hasn't created any events yet."
/>
      </div>

      {/* Sponsors Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-teal-800 mb-6">Sponsors</h2>

        <LazyRow
          items={sponsors}
          loading={sponsorsLoading}
          hasMore={hasMoreSponsors}
          onLoadMore={loadMoreSponsors}
          renderItem={(sponsor) => (
            <div key={sponsor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-center">
                {sponsor.logo ? (
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-teal-800 mb-1">{sponsor.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {sponsor.sponsorship_level}
                  </p>
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-600 hover:underline"
                    >
                      {sponsor.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          emptyMessage="No sponsors associated with this organizer."
        />
      </div>
    </div>
  );
}