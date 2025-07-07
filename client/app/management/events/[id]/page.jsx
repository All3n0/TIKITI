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
          <h1 className="text-3xl font-bold">{event.title}</h1>
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
            <h2 className="text-xl font-bold mb-4">Event Details</h2>
            <p className="text-gray-700 mb-4">{event.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-600">Date & Time</h3>
                <p>
                  {new Date(event.start_datetime).toLocaleString()} -<br />
                  {new Date(event.end_datetime).toLocaleString()}
                </p>
              </div>
              
              {event.venue && (
                <div>
                  <h3 className="font-semibold text-gray-600">Location</h3>
                  <p>{event.venue.name}</p>
                  <p>{event.venue.address}, {event.venue.city}, {event.venue.state}</p>
                </div>
              )}
            </div>
          </div>
          
          {event.ticket_types && event.ticket_types.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Ticket Types</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Period</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {event.ticket_types.map(ticket => (
                      <tr key={ticket.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${ticket.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.quantity_available}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(ticket.sales_start).toLocaleDateString()} - {new Date(ticket.sales_end).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Organizer</h2>
            {event.organizer && (
              <div>
                <p className="font-medium">{event.organizer.name}</p>
                <p className="text-gray-600">{event.organizer.email}</p>
                <p className="text-gray-600">{event.organizer.phone}</p>
                
                <button
                  onClick={() => fetchOrganizerDetails(event.organizer.id)}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Organizer Details
                </button>
              </div>
            )}
          </div>
          
          {event.status === 'pending' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Event Approval</h2>
              <div className="flex gap-4">
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Approve Event
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Reject Event
                </button>
              </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">Organizer Details</h2>
                <button 
                  onClick={() => setShowOrganizerModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {organizerDetails.logo && (
                  <img 
                    src={organizerDetails.logo} 
                    alt={organizerDetails.name}
                    className="w-20 h-20 object-contain mx-auto"
                  />
                )}
                
                <div>
                  <h3 className="font-semibold text-gray-600">Name</h3>
                  <p>{organizerDetails.name}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-600">Contact Email</h3>
                  <p>{organizerDetails.contact_email}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-600">Phone</h3>
                  <p>{organizerDetails.phone}</p>
                </div>
                
                {organizerDetails.website && (
                  <div>
                    <h3 className="font-semibold text-gray-600">Website</h3>
                    <a 
                      href={organizerDetails.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {organizerDetails.website}
                    </a>
                  </div>
                )}
                
                {organizerDetails.speciality && (
                  <div>
                    <h3 className="font-semibold text-gray-600">Speciality</h3>
                    <p>{organizerDetails.speciality}</p>
                  </div>
                )}
                
                {organizerDetails.description && (
                  <div>
                    <h3 className="font-semibold text-gray-600">Description</h3>
                    <p className="text-gray-700">{organizerDetails.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}