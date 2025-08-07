'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Calendar, ArrowLeft, MapPin, Handshake, Users, Edit, Trash2, Ticket, DollarSign, Clock, Info } from 'lucide-react';
import EventModal from '../../components/EventModal';

export default function OrganizerEventDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

useEffect(() => {
  const fetchDetails = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await axios.get(`https://servertikiti-production.up.railway.app/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvent(res.data);

      const statsRes = await axios.get(`https://servertikiti-production.up.railway.app/events/${id}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error loading event:', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();
}, [id, router]);

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this event?')) return;

  const token = localStorage.getItem('authToken');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    await axios.delete(`https://servertikiti-production.up.railway.app/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.push('/organizer/events');
  } catch (err) {
    console.error('Delete failed:', err);
  }
};



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!event || !stats) return (
    <div className="p-6 text-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto">
        <Info className="inline-block mr-2" size={20} />
        Event not found
      </div>
    </div>
  );

  return (
    <section className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div className="w-full">
              <button 
                onClick={() => router.push('/organizer/events')}
                className="flex items-center text-amber-600 hover:text-amber-800 mb-4 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="mr-2" size={18} />
                Back to Events
              </button>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-amber-700 mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-4 sm:mb-6 flex items-start text-sm sm:text-base">
                <Info className="text-amber-600 mr-2 mt-1 flex-shrink-0" size={16} />
                {event.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-4 sm:my-6">
            <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-100">
              <div className="flex gap-2 sm:gap-3 items-start">
                <Calendar className="text-amber-600 mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">Date & Time</p>
                  <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1">
                    <Clock className="inline-block mr-1" size={14} />
                    {new Date(event.start_datetime).toLocaleString()} –{' '}
                    {new Date(event.end_datetime).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {event.venue && (
              <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-100">
                <div className="flex gap-2 sm:gap-3 items-start">
                  <MapPin className="text-amber-600 mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-medium text-gray-700 text-sm sm:text-base">Venue</p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {event.venue.name}, {event.venue.city}, {event.venue.state}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-100">
              <div className="flex gap-2 sm:gap-3 items-start">
                <Users className="text-amber-600 mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">Capacity</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {event.capacity || 'Unlimited'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-100">
              <div className="flex gap-2 sm:gap-3 items-start">
                <DollarSign className="text-amber-600 mt-0.5 sm:mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">Total Revenue</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    KSh {stats.total_revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-100 mb-4 sm:mb-6">
            <h2 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
              <Ticket className="text-amber-600 mr-2" size={16} />
              Tickets Sold by Type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {stats.tickets_by_type.map((t) => (
                <div key={t.ticket_type_id} className="bg-white p-2 sm:p-3 rounded-md shadow-sm border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 text-xs sm:text-sm">{t.name}</span>
                    <span className="bg-amber-100 text-amber-800 text-xs sm:text-sm font-medium px-2 py-0.5 rounded">
                      {t.count} sold
                    </span>
                  </div>
                  {t.price && (
                    <p className="text-gray-600 mt-1 text-xs sm:text-sm">KSh {t.price.toFixed(2)} each</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {event.sponsors && event.sponsors.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-6 rounded-xl border border-amber-200 mb-6 sm:mb-8 shadow-sm">
              <div className="flex items-center mb-3 sm:mb-4">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Event Sponsors</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {event.sponsors.map(s => (
                  <div key={s.id} className="bg-white p-3 sm:p-4 rounded-lg border border-amber-100 hover:border-amber-300 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-start">
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-amber-700">{s.name}</h3>
                        {s.sponsorship_level && (
                          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                            <span className="font-medium">Level:</span> {s.sponsorship_level}
                          </p>
                        )}
                        {s.website && (
                          <a 
                            href={s.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-amber-600 hover:text-amber-800 text-xs sm:text-sm font-medium transition-colors"
                          >
                            <svg className="w-3 sm:w-4 h-3 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
            >
              <Edit className="w-4 sm:w-5 h-4 sm:h-5" />
              Edit Event
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
            >
              <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
              Delete Event
            </button>
          </div>
        </div>
      </div>

      <EventModal
        open={showModal}
        onClose={() => setShowModal(false)}
        editingEvent={event}
        onSuccess={() => {
          setShowModal(false);
          axios.get(`https://servertikiti-production.up.railway.app/events/${id}`).then(res => setEvent(res.data));
        }}
        organiserId={event.organizer_id}
      />
    </section>
  );
}