'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User, Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrganizerProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        const res = await fetch(`http://localhost:5557/organizers/${id}`);
        const data = await res.json();
        // Flatten the response structure
        const flattenedOrganizer = {
          ...data.organizer,
          ...data.contact,
          stats: data.stats,
          upcoming_events: data.upcoming_events
        };
        setOrganizer(flattenedOrganizer);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizer();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-amber-600">Loading...</div>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-700 mb-4">Organizer not found</h2>
          <button 
            onClick={() => router.back()}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Orange Area */}
      <section className="relative bg-gradient-to-b from-amber-600 to-amber-400 text-white pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-amber-100 hover:text-white mr-4"
            >
              <ArrowLeft className="mr-1" size={20} />
              Back
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center shadow-lg">
              {organizer.logo ? (
                <img 
                  src={organizer.logo} 
                  alt={organizer.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-16 h-16 text-amber-600" />
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2 underline">{organizer.name}</h1>
              <p className="text-amber-100 px-2 border-2 bg-yellow-200 w-fit text-amber-600 rounded-md">
                {organizer.speciality || organizer.specialty || 'Event Organizer'}
              </p>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0] rotate-180">
          <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-24">
            <path d="M0,0 C150,100 350,-50 500,50 L500,0 L0,0 Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* Description Section */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-amber-700 mb-6">About Us</h2>
          <div className="prose max-w-none">
            {organizer.description ? (
              <p className="whitespace-pre-line text-gray-600">{organizer.description}</p>
            ) : (
              <p className="text-gray-600">No description available for this organizer.</p>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 bg-amber-50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-amber-700">{organizer.stats?.total_events || 0}</h3>
            <p className="text-gray-600">Total Events</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-amber-700">{(organizer.stats?.total_capacity || 0).toLocaleString()}</h3>
            <p className="text-gray-600">Total Attendees</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-amber-700">{organizer.stats?.rating || 4.5}</h3>
            <p className="text-gray-600">Avg. Rating</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold text-amber-700">{organizer.founded || 2014}</h3>
            <p className="text-gray-600">Founded</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-amber-100">
            <h2 className="text-xl font-bold text-amber-700 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Email</p>
                <a href={`mailto:${organizer.contact_email || organizer.email}`} className="text-amber-600 hover:underline">
                  {organizer.contact_email || organizer.email}
                </a>
              </div>
              <div>
                <p className="text-gray-500">Website</p>
                <a 
                  href={organizer.website?.startsWith('http') ? organizer.website : `https://${organizer.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline"
                >
                  {organizer.website}
                </a>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <a href={`tel:${organizer.phone}`} className="text-amber-600 hover:underline">
                  {organizer.phone}
                </a>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-amber-700 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition">
                  Contact Organizer
                </button>
                <button className="w-full border-2 border-amber-600 text-amber-600 py-2 rounded-lg hover:bg-amber-50 transition">
                  Share Profile
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming Events */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-amber-700 mb-6">Upcoming Events</h2>
            
            {organizer.upcoming_events?.length > 0 ? (
              <div className="space-y-6">
                {organizer.upcoming_events.map(event => (
                  <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition">
                    <h3 className="text-lg font-bold text-amber-700 mb-2">{event.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="mr-2 text-amber-600" size={18} />
                        <span>{new Date(event.start_datetime).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="mr-2 text-amber-600" size={18} />
                        <span>{event.venue?.city}, {event.venue?.state}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="mr-2 text-amber-600" size={18} />
                        <span>{new Date(event.start_datetime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(event.end_datetime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-amber-100">
                      <span className="text-gray-500">Capacity: </span>
                      <span className="text-amber-600 font-medium">{event.capacity?.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => router.push(`/events/${event.id}`)}
                      className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      View Event Details →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-amber-100 text-center">
                <p className="text-gray-600">No upcoming events scheduled</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}