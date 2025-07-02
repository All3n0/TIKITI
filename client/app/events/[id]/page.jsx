'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CalendarDays, MapPin, Star, Users } from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (!id) {
      console.warn('Event ID is undefined');
      return;
    }

    fetch(`http://localhost:5557/events/${id}/details`)
      .then(res => res.json())
      .then(data => {
        setEvent(data);
        const initialQty = {};
        data.ticket_types.forEach(ticket => {
          initialQty[ticket.id] = 0;
        });
        setQuantities(initialQty);
      });
  }, [id]);

  const updateQuantity = (ticketId, change) => {
    setQuantities(prev => ({
      ...prev,
      [ticketId]: Math.max(0, prev[ticketId] + change),
    }));
  };

  if (!event) return <div className="text-center py-20 text-gray-800">Loading...</div>;

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-2">
          <img
            src={event.image || '/placeholder.jpg'}
            alt={event.title}
            className="w-full h-[350px] object-cover rounded-xl"
          />

          <h1 className="text-3xl font-bold mt-6">{event.title}</h1>

          {/* Rating & Capacity */}
          <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{event.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{event.capacity.toLocaleString()} attending</span>
            </div>
          </div>

          {/* Date & Location */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex items-center gap-3 bg-amber-50 rounded-lg px-4 py-4 w-full sm:w-1/2">
              <CalendarDays className="text-amber-600 w-5 h-5" />
              <div>
                <div className="font-semibold text-sm text-amber-700">
                  {formatDate(event.start_datetime)} - {formatDate(event.end_datetime)}
                </div>
                <div className="text-xs text-gray-600">
                  {formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-amber-50 rounded-lg px-4 py-3 w-full sm:w-1/2">
              <MapPin className="text-amber-600 w-5 h-5" />
              <div>
                <div className="font-semibold text-sm text-amber-700">
                  {event.venue?.name}
                </div>
                <div className="text-xs text-gray-600">{event.venue?.address}</div>
              </div>
            </div>
          </div>

          <hr className="my-8 border-amber-100" />

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">About This Event</h2>
            <p className="leading-relaxed text-gray-700">{event.description}</p>
          </div>
        </div>

        {/* Right Column: Ticket Selector */}
        <div>
          <h2 className="font-semibold text-xl mb-6">Select Tickets</h2>
          {event.ticket_types.map(ticket => (
            <div
              key={ticket.id}
              className="border border-gray-200 rounded-xl p-4 mb-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{ticket.name}</h3>
                  <p className="text-sm text-gray-500">{ticket.description}</p>
                </div>
                <span className="text-amber-600 font-bold text-lg">${ticket.price}</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => updateQuantity(ticket.id, -1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  –
                </button>
                <span className="text-md font-semibold">{quantities[ticket.id]}</span>
                <button
                  onClick={() => updateQuantity(ticket.id, 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="mt-6 border-t pt-4 font-semibold">
            Total: $
            {Object.entries(quantities).reduce(
              (sum, [id, qty]) =>
                sum +
                qty *
                  event.ticket_types.find(ticket => ticket.id === parseInt(id)).price,
              0
            ).toFixed(2)}
          </div>

          {/* Checkout */}
          <button className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
