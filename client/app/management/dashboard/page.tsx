'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Manage events, venues, and organizers across the platform.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Organizers" value={stats.totalOrganizers || 0} />
            <StatCard title="Active Events" value={stats.activeEvents || 0} />
            <StatCard title="Pending Events" value={stats.pendingEvents || 0} />
            <StatCard title="Pending Venues" value={stats.pendingVenues || 0} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'events' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Pending Events
              </button>
              <button
                onClick={() => setActiveTab('venues')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'venues' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Pending Venues
              </button>
              <button
                onClick={() => setActiveTab('organizers')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'organizers' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Organizers
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'events' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Events Awaiting Approval</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search events..."
                      className="border border-gray-300 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  <div className="space-y-4">
                    {pendingEvents.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{event.title}</h3>
                            <p className="text-gray-600">{event.organizer_name}</p>
                            {event.venue_name && <p className="text-gray-600">{event.venue_name}</p>}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveEvent(event.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectEvent(event.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                            >
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

            {activeTab === 'venues' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Venues Awaiting Approval</h2>
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
                            <h3 className="font-bold text-lg">{venue.name}</h3>
                            <p className="text-gray-600">{venue.address}, {venue.city}, {venue.state}</p>
                            {venue.capacity && <p className="text-gray-600">Capacity: {venue.capacity}</p>}
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
                              Approve
                            </button>
                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
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
                <h2 className="text-2xl font-bold mb-6">Organizers</h2>
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
                            <h3 className="font-bold text-lg">{organizer.name}</h3>
                            <p className="text-gray-600">{organizer.email}</p>
                            <p className="text-gray-600">{organizer.phone}</p>
                            {organizer.speciality && <p className="text-gray-600">Speciality: {organizer.speciality}</p>}
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                              View
                            </button>
                            <button className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 transition">
                              Edit
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
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}