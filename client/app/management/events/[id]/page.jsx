'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EventDetailsPage({ params }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [organizerDetails, setOrganizerDetails] = useState(null);
  const router = useRouter();
  const eventId = params.id;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5557/management/events/${eventId}`, {
          credentials: 'include'
        });
        
        if (!res.ok) {
          router.push('/management/login');
          return;
        }
        
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        router.push('/management/login');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, router]);

  const handleApprove = async () => {
    try {
      const res = await fetch(`http://localhost:5557/management/events/${eventId}/approve`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.ok) {
        router.refresh(); // Refresh the page to show updated status
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`http://localhost:5557/management/events/${eventId}/reject`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.ok) {
        router.refresh(); // Refresh the page to show updated status
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrganizerDetails = async (organizerId) => {
    try {
      const res = await fetch(`http://localhost:5557/management/organizers/${organizerId}`, {
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        
        setOrganizerDetails(data);
        setShowOrganizerModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading event details...</div>;
  if (!event) return <div className="text-center py-20">Event not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-teal-800 underline underline-offset">{event.title}</h1>
          <p className="text-gray-600">Created: {new Date(event.created_at).toLocaleString()}</p>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          event.status === 'approved' ? 'bg-green-100 text-green-800' :
          event.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {event.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {event.image && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-teal-800">Event Details</h2>
            <p className="text-gray-700 mb-4">{event.description}</p>
            
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  {/* Date & Time Section */}
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <div>
      <h3 className="font-semibold text-gray-600 mb-1">Date & Time</h3>
      <div className="flex items-center gap-2 text-gray-700">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          {new Date(event.start_datetime).toLocaleString()} -<br />
          {new Date(event.end_datetime).toLocaleString()}
        </span>
      </div>
    </div>
  </div>

  {/* Location Section */}
  {event.venue && (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="p-2 bg-green-100 rounded-full text-green-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold text-gray-600 mb-1">Location</h3>
        <div className="space-y-1 text-gray-700">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{event.venue.name}</span>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>{event.venue.address}, {event.venue.city}, {event.venue.state}</span>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
          </div>
          
          {event.ticket_types && event.ticket_types.length > 0 && (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-teal-800">Ticket Types</h2>
      <div className="text-sm text-gray-500">
        <span className="inline-flex items-center gap-1 mr-3">
          <span className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></span>
          Available
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></span>
          Sold
        </span>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Period</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {event.ticket_types.map(ticket => {
            const ticketsSold = ticket.quantity_available - ticket.remaining_quantity || 0; // Assuming you have remaining_quantity
            const soldPercentage = (ticketsSold / ticket.quantity_available) * 100;
            
            return (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{ticket.name}</div>
                      <div className="text-sm text-gray-500">{ticket.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${ticket.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 mb-1">
                    {ticketsSold} sold • {ticket.remaining_quantity || ticket.quantity_available} available
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${soldPercentage}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(ticket.sales_start).toLocaleDateString()} - {new Date(ticket.sales_end).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    
    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
      <div>
        <span className="font-medium">Total Tickets:</span> {event.ticket_types.reduce((sum, ticket) => sum + ticket.quantity_available, 0)}
      </div>
      <div>
        <span className="font-medium">Total Sold:</span> {event.ticket_types.reduce((sum, ticket) => sum + (ticket.quantity_available - (ticket.remaining_quantity || ticket.quantity_available)), 0)}
      </div>
    </div>
  </div>
)}
        </div>
        
        <div className="space-y-6">
         <div className="bg-white rounded-lg shadow-sm p-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold flex items-center gap-2 text-teal-800">
      <svg className="w-5 h-5 text-teal-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Organizer
    </h2>
    {event.organizer?.logo && (
      <img 
        src={event.organizer.logo} 
        alt={`${event.organizer.name} logo`}
        className="w-10 h-10 object-contain rounded-full border border-gray-200"
      />
    )}
  </div>

  {event.organizer && (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-full">
          <svg className="w-4 h-4 text-teal-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <p className="font-medium text-gray-900">{event.organizer.name}</p>
          {event.organizer.speciality && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {event.organizer.speciality}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-full">
          <svg className="w-4 h-4 text-teal-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <a 
          href={`mailto:${event.organizer.email}`} 
          className="text-gray-600 hover:text-blue-600 hover:underline"
        >
          {event.organizer.email}
        </a>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-full">
          <svg className="w-4 h-4 text-teal-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <a 
          href={`tel:${event.organizer.phone}`} 
          className="text-gray-600 hover:text-blue-600 hover:underline"
        >
          {event.organizer.phone}
        </a>
      </div>

      {event.organizer.website && (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-full">
            <svg className="w-4 h-4 text-teal-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <a 
            href={event.organizer.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 hover:underline"
          >
            {event.organizer.website.replace(/^https?:\/\//, '')}
          </a>
        </div>
      )}

      <button
        onClick={() => fetchOrganizerDetails(event.organizer.id)}
        className="mt-4 flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        View Full Organizer Details
      </button>
    </div>
  )}
</div>
          
{event.status === 'pending' && (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800">Pending Approval</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <button
        onClick={handleApprove}
        className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Approve Event
      </button>
      
      <button
        onClick={handleReject}
        className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Reject Event
      </button>
    </div>
    
    <p className="mt-3 text-sm text-gray-500 text-center">
      Review all event details before making a decision
    </p>
  </div>
)}
          
          {event.sponsors && event.sponsors.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Sponsors</h2>
              <div className="space-y-4">
                {event.sponsors.map(sponsor => (
                  <div key={sponsor.id} className="flex items-center gap-3">
                    {sponsor.logo && (
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div>
                      <p className="font-medium">{sponsor.name}</p>
                      <p className="text-sm text-gray-600">{sponsor.sponsorship_level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Organizer Modal */}
      {showOrganizerModal && organizerDetails && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-gray-100 animate-slideUp">
      {/* Modal Header */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-6 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Organizer Profile</h2>
          </div>
          <button 
            onClick={() => setShowOrganizerModal(false)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-6 pt-4 overflow-y-auto">
        {/* Organizer Profile */}
        <div className="flex flex-col items-center text-center mb-6">
          {organizerDetails.logo ? (
            <img 
              src={organizerDetails.logo} 
              alt={organizerDetails.name}
              className="w-24 h-24 object-contain rounded-full border-4 border-teal-50 mb-4"
            />
          ) : (
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          
          <h3 className="text-xl font-bold text-gray-800">{organizerDetails.name}</h3>
          {organizerDetails.speciality && (
            <span className="inline-block mt-1 px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full">
              {organizerDetails.speciality}
            </span>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a 
                    href={`mailto:${organizerDetails.contact_email || organizerDetails.email}`} 
                    className="text-teal-600 hover:underline font-medium"
                  >
                    {organizerDetails.contact_email || organizerDetails.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a 
                    href={`tel:${organizerDetails.phone}`} 
                    className="text-teal-600 hover:underline font-medium"
                  >
                    {organizerDetails.phone}
                  </a>
                </div>
              </div>

              {organizerDetails.website && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={organizerDetails.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline font-medium"
                    >
                      {organizerDetails.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          {organizerDetails.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">About</h4>
              <p className="text-gray-700">{organizerDetails.description}</p>
            </div>
          )}

          {/* Stats (if available) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-100 rounded-lg p-3 text-center">
    <p className="text-sm text-gray-500">Events Created</p>
    <p className="text-xl font-bold text-teal-600">
      {organizerDetails.events_count || 0}
    </p>
  </div>
            <div className="bg-white border border-gray-100 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-xl font-bold text-teal-600">
                {new Date(organizerDetails.created_at).getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex justify-end">
        <button
          onClick={() => setShowOrganizerModal(false)}
          className="px-4 py-2 btn btn-outline border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-medium rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}