'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Calendar, MapPin,Handshake, Users, Edit, Trash2, Ticket, DollarSign, Clock, Info } from 'lucide-react';
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
      try {
        const res = await axios.get(`http://localhost:5557/events/${id}`);
        setEvent(res.data);

        const statsRes = await axios.get(`http://localhost:5557/events/${id}/stats`);
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
    try {
      await axios.delete(`http://localhost:5557/events/${id}`);
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
    <section className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-amber-700 mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-6 flex items-start">
                <Info className="text-amber-600 mr-2 mt-1 flex-shrink-0" size={18} />
                {event.description}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex gap-3 items-start">
                <Calendar className="text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Date & Time</p>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Clock className="inline-block mr-1" size={16} />
                    {new Date(event.start_datetime).toLocaleString()} –{' '}
                    {new Date(event.end_datetime).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {event.venue && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex gap-3 items-start">
                  <MapPin className="text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Venue</p>
                    <p className="text-gray-600">
                      {event.venue.name}, {event.venue.city}, {event.venue.state}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex gap-3 items-start">
                <Users className="text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Capacity</p>
                  <p className="text-gray-600">
                    {event.capacity || 'Unlimited'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex gap-3 items-start">
                <DollarSign className="text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Total Revenue</p>
                  <p className="text-gray-600">
                    KSh {stats.total_revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Ticket className="text-amber-600 mr-2" size={18} />
              Tickets Sold by Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.tickets_by_type.map((t) => (
                <div key={t.ticket_type_id} className="bg-white p-3 rounded-md shadow-sm border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t.name}</span>
                    <span className="bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {t.count} sold
                    </span>
                  </div>
                  {t.price && (
                    <p className="text-gray-600 mt-1">KSh {t.price.toFixed(2)} each</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {event.sponsors && event.sponsors.length > 0 && (
  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-6">
    <h2 className="font-semibold text-gray-800 mb-3 flex items-center">
      <Handshake className="text-amber-600 mr-2" size={18} />
      Sponsors
    </h2>
    <div className="flex flex-wrap gap-3">
      {event.sponsors.map(s => (
        <div key={s.id} className="bg-white p-3 rounded-lg shadow-sm border text-sm text-gray-700">
          <p className="font-semibold text-amber-700">{s.name}</p>
          {s.sponsorship_level && <p>Level: {s.sponsorship_level}</p>}
          {s.website && <p className="text-blue-600"><a href={s.website} target="_blank">Website</a></p>}
        </div>
      ))}
    </div>
  </div>
)}

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Edit className="w-5 h-5" />
              Edit Event
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Trash2 className="w-5 h-5" />
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
          axios.get(`http://localhost:5557/events/${id}`).then(res => setEvent(res.data));
        }}
        organiserId={event.organizer_id}
      />
    </section>
  );
}