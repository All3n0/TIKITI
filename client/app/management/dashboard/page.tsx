'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

export default function AdminDashboard() {
  const [manager, setManager] = useState(null);
  const [stats, setStats] = useState({
    totalOrganizers: 0,
    activeEvents: 0,
    pendingEvents: 0,
    pendingVenues: 0
  });
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check session
        const sessionRes = await fetch('http://localhost:5557/management/session', {
          credentials: 'include',
        });
        
        if (!sessionRes.ok) {
          router.push('/management/login');
          return;
        }
        
        const managerData = await sessionRes.json();
        setManager(managerData);

        // Fetch all dashboard data
        await fetchDashboardData();

      } catch (err) {
        console.error(err);
        router.push('/management/login');
      } finally {
        setLoading(false);
      }
    };

  const fetchDashboardData = async () => {
  try {
    const [statsRes, eventsRes, venuesRes, orgsRes] = await Promise.all([
      fetch('http://localhost:5557/management/dashboard/stats', { credentials: 'include' }),
      fetch('http://localhost:5557/management/events/pending', { credentials: 'include' }),
      fetch('http://localhost:5557/management/venues/pending', { credentials: 'include' }),
      fetch('http://localhost:5557/management/organizers', { credentials: 'include' })
    ]);

    const [statsData, eventsData, venuesData, orgsData] = await Promise.all([
      statsRes.json(),
      eventsRes.json(),
      venuesRes.json(),
      orgsRes.json()
    ]);

    // Transform backend snake_case to frontend camelCase
    const transformedStats = {
      activeEvents: statsData.active_events,
      pendingEvents: statsData.pending_events,
      totalOrganizers: statsData.total_organizers,
      pendingVenues: venuesData.length
    };

    console.log('Transformed stats:', transformedStats); // Verify this shows correct values

    setStats(transformedStats);
    setPendingEvents(eventsData);
    setPendingVenues(venuesData);
    setOrganizers(orgsData);
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('http://localhost:5557/management/logout', {
      method: 'DELETE',
      credentials: 'include',
    });
    router.push('/management/login');
  };

  const handleApproveEvent = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5557/management/events/${eventId}/approve`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (res.ok) {
        // Refresh data
        const eventsRes = await fetch('http://localhost:5557/management/events/pending', {
          credentials: 'include',
        });
        const eventsData = await eventsRes.json();
        setPendingEvents(eventsData);
        
        // Refresh stats
        const statsRes = await fetch('http://localhost:5557/management/dashboard/stats', {
          credentials: 'include',
        });
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5557/management/events/${eventId}/reject`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (res.ok) {
        // Refresh data
        const eventsRes = await fetch('http://localhost:5557/management/events/pending', {
          credentials: 'include',
        });
        const eventsData = await eventsRes.json();
        setPendingEvents(eventsData);
        
        // Refresh stats
        const statsRes = await fetch('http://localhost:5557/management/dashboard/stats', {
          credentials: 'include',
        });
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 underline underline-offset-8">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-500">Manage events, venues, and organizers across the platform.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Organizers" value={stats.totalOrganizers || 0} />
            <StatCard title="Active Events" value={stats.activeEvents || 0} />
            <StatCard title="Pending Events" value={stats.pendingEvents || 0} />
            <StatCard title="Pending Venues" value={stats.pendingVenues || 0} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}
<div className="border-b border-gray-200 w-full">
  <nav className="flex">
    <button
      onClick={() => setActiveTab('events')}
      className={`flex-1 py-4 px-2 text-center border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
    >
      <div className="flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Pending Events
      </div>
    </button>
    <button
      onClick={() => setActiveTab('venues')}
      className={`flex-1 py-4 px-2 text-center border-b-2 font-medium text-sm ${activeTab === 'venues' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
    >
      <div className="flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Pending Venues
      </div>
    </button>
    <button
      onClick={() => setActiveTab('organizers')}
      className={`flex-1 py-4 px-2 text-center border-b-2 font-medium text-sm ${activeTab === 'organizers' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
    >
      <div className="flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Organizers
      </div>
    </button>
  </nav>
</div>
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'events' && (
  <div>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-600 underline underline-offset-4">Events Awaiting Approval</h2>
      <div className="relative w-full md:w-64">
        <input
          type="text"
          placeholder="Search events..."
          className="border border-gray-400 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 w-full"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    {pendingEvents.length === 0 ? (
      <div className="text-center py-10 text-gray-500">
        No events awaiting approval
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-4">
        {pendingEvents.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Event Info with Icons */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <h3 className="font-bold text-lg text-gray-800">{event.title}</h3>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{event.organizer_name}</span>
                </div>
                
                {event.venue_name && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.venue_name}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
                <div className="flex gap-2">
                  {/* View Button */}
                  <button
                    onClick={() => router.push(`/management/events/${event.id}`)}
                    className="p-2 text-teal-600 hover:text-white bg-gray-100 hover:bg-teal-600 rounded-lg transition-colors"
                    title="View details"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {/* Approve Button */}
                  <button
                    onClick={() => handleApproveEvent(event.id)}
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-1.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 text-sm sm:text-base sm:py-2 sm:px-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="hidden sm:inline">Approve</span>
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleRejectEvent(event.id)}
                    className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-1.5 px-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 text-sm sm:text-base sm:py-2 sm:px-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="hidden sm:inline">Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
            {activeTab === 'venues' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-600 underline underline-offset-4">Venues Awaiting Approval</h2>
                {pendingVenues.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No venues awaiting approval
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingVenues.map((venue) => (
                      <div key={venue.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg mb-2 text-gray-600">{venue.name}</h3>
                            <div className="space-y-1 text-gray-600">
  <div className="flex items-center gap-2">
    <svg className="w-4 h-4 flex-shrink-0 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <span>{venue.address}, {venue.city}, {venue.state}</span>
  </div>
  
  {venue.capacity && (
    <div className="flex items-center gap-2">
      <svg className="w-4 h-4 flex-shrink-0 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span>Capacity: {venue.capacity}</span>
    </div>
  )}
</div>
                          </div>
                          <div className="flex gap-2">
  <button className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    Approve
  </button>
  
  <button className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
    Reject
  </button>
</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'organizers' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-600 underline underline-offset-4">Organizers</h2>
                {organizers.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No organizers found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {organizers.map((organizer) => (
                      <div key={organizer.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg mb-2 text-gray-600">{organizer.name}</h3>
                            <p className="text-gray-600">{organizer.email}</p>
                            <p className="text-gray-600">{organizer.phone}</p>
                            {organizer.speciality && <p className="text-gray-600">Speciality: {organizer.speciality}</p>}
                          </div>
                         <div className="flex items-center gap-2">
  {/* View Button - Eye Icon */}
  <button
    className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-all duration-200 hover:shadow-sm"
    title="View"  // Accessibility: tooltip on hover
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  </button>

  {/* Edit Button - Pencil Icon */}
  <button
    className="p-2 text-amber-500 hover:text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-full transition-all duration-200 hover:shadow-sm"
    title="Edit"  // Accessibility: tooltip on hover
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  </button>
</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  // Define icons for each card type
  const getIcon = () => {
    switch(title) {
      case 'Total Organizers':
        return (
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'Active Events':
        return (
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        );
      case 'Pending Events':
        return (
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Pending Venues':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-lg font-bold min-h-[3.5rem] leading-snug">{title}</h3>
          <p className="text-3xl font-bold mt-2 text-teal-600">{value}</p>
        </div>
        <div className="p-2 bg-teal-50 rounded-full">
          {getIcon()}
        </div>
      </div>
    </div>
  );
}