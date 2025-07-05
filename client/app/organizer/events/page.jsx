'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Ticket } from 'lucide-react';
import axios from 'axios';
import EventModal from '../components/EventModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [organiserId, setOrganiserId] = useState(null);
  const router = useRouter();

  const fetchEvents = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5557/organiser/${id}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('http://localhost:5557/auth/session', {
          credentials: 'include',
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch session');
        }
        
        const sessionData = await res.json();
        
        // Check the actual response structure
        console.log('Session data:', sessionData);
        
        // Handle both possible response structures
        const user = sessionData.user || sessionData;
        
        if (!user || !user.id || user.role !== 'organizer') {
          router.push('/login');
          return;
        }

        setOrganiserId(user.id);
        await fetchEvents(user.id);
      } catch (err) {
        console.error('Session check failed:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  // ... rest of your component code remains the same ...

  const openModal = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`http://localhost:5557/events/${id}`);
      await fetchEvents(organiserId);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-700">My Events</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
        >
          <Plus className="w-5 h-5" />
          <span>Create Event</span>
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events yet.</p>
          <button
            onClick={openModal}
            className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-all flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image || '/placeholder-event.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {event.category || 'Event'}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h2 className="font-bold text-lg text-gray-800 mb-2">{event.title}</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Date & Time</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.start_datetime).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                        <br />
                        {new Date(event.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        -{' '}
                        {new Date(event.end_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {event.venue && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-sm text-gray-600">
                          {event.venue.name}
                          <br />
                          {event.venue.city}, {event.venue.state}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Capacity</p>
                      <p className="text-sm text-gray-600">{event.capacity?.toLocaleString() || 'Unlimited'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t flex justify-between">
                  <Link
                    href={`/organizer/events/${event.id}`}
                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                  >
                    <Ticket className="w-4 h-4" />
                    View Event
                  </Link>

                  {/* <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(event)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EventModal
        open={showModal}
        onClose={closeModal}
        editingEvent={editingEvent}
        onSuccess={() => fetchEvents(organiserId)}
        organiserId={organiserId}
      />
    </section>
  );
}