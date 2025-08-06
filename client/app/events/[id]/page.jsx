'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CalendarDays, MapPin, Star, Users } from 'lucide-react';
import TicketView from '../../../components/TicketView';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [sessionUser, setSessionUser] = useState(null); // ✅ Now holds full user object
const [ticketsData, setTicketsData] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);

  // ✅ Fetch event details
  useEffect(() => {
    if (!id) return;
    fetch(`https://servertikiti-production.up.railway.app/events/${id}/details`)
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

  // ✅ Fetch session on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('https://servertikiti-production.up.railway.app/auth/session', {
          credentials: 'include',
        });
        const data = await res.json();
        if (data?.id) {
          setSessionUser(data);
        }
      } catch (err) {
        console.error('Failed to fetch session:', err);
      }
    };

    fetchSession();
  }, []);

  const updateQuantity = (ticketId, change) => {
    setQuantities(prev => ({
      ...prev,
      [ticketId]: Math.max(0, prev[ticketId] + change),
    }));
  };

  const handlePayment = async () => {
    if (!sessionUser) {window.location.href = '/login'; return;}

    try {
      const response = await fetch('/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: sessionUser.id,
          quantities,
          attendee_name: sessionUser.username,
          attendee_email: sessionUser.email,
          billing_address: 'Nairobi, KE',
          payment_method: 'manual',
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const tickets = data.tickets.map(t => ({
  attendee_name: t.attendee_name,
  attendee_email: t.attendee_email,
  ticket_type: t.ticket_type,
  price: t.price,
  serial: t.unique_code,
  qr_code_path: t.qr_code_path,
}));
setTicketsData(tickets);

        setOrderInfo({ order_id: data.order_id, total: data.total,transaction_reference: data.transaction_reference });

        setQuantities(prev => {
          const reset = { ...prev };
          Object.keys(reset).forEach(k => (reset[k] = 0));
          return reset;
        });
        setShowModal(false);
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed.');
    }
  };

  if (!event) return <div className="text-center py-20 text-gray-800">Loading...</div>;

  const formatDate = iso => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = iso => new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Event Info */}
        <div className="lg:col-span-2">
          <img src={event.image || '/placeholder.jpg'} alt={event.title} className="w-full h-[350px] object-cover rounded-xl" />
          <h1 className="text-3xl font-bold mt-6">{event.title}</h1>
          <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /><span>{event.rating}</span></div>
            <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>{event.capacity.toLocaleString()} attending</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex items-center gap-3 bg-amber-50 rounded-lg px-4 py-4 w-full sm:w-1/2">
              <CalendarDays className="text-amber-600 w-5 h-5" />
              <div>
                <div className="font-semibold text-sm text-amber-700">{formatDate(event.start_datetime)} - {formatDate(event.end_datetime)}</div>
                <div className="text-xs text-gray-600">{formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-amber-50 rounded-lg px-4 py-3 w-full sm:w-1/2">
              <MapPin className="text-amber-600 w-5 h-5" />
              <div>
                <div className="font-semibold text-sm text-amber-700">{event.venue?.name}</div>
                <div className="text-xs text-gray-600">{event.venue?.address}</div>
              </div>
            </div>
          </div>
          <hr className="my-8 border-amber-100" />
          <div>
            <h2 className="text-xl font-semibold mb-2">About This Event</h2>
            <p className="leading-relaxed text-gray-700">{event.description}</p>
          </div>
        </div>

        {/* Ticket Selection */}
        <div>
          <h2 className="font-semibold text-xl mb-6">Select Tickets</h2>
          {event.ticket_types.map(ticket => (
            <div key={ticket.id} className="border border-gray-200 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{ticket.name}</h3>
                  <p className="text-sm text-gray-500">{ticket.description}</p>
                </div>
                <span className="text-amber-600 font-bold text-lg">KSh {ticket.price}</span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <button onClick={() => updateQuantity(ticket.id, -1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">–</button>
                <span className="text-md font-semibold">{quantities[ticket.id]}</span>
                <button onClick={() => updateQuantity(ticket.id, 1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
              </div>
            </div>
          ))}
          <div className="mt-6 border-t pt-4 font-semibold">
            Total: KSh {Object.entries(quantities).reduce((sum, [id, qty]) => sum + qty * event.ticket_types.find(ticket => ticket.id === parseInt(id)).price, 0).toFixed(2)}
          </div>
<button
  onClick={() => setShowModal(true)}
  disabled={totalTickets === 0}
  className={`mt-4 w-full py-3 rounded-xl font-semibold transition ${
    totalTickets === 0
      ? 'bg-amber-200 text-gray-500 cursor-not-allowed'
      : 'bg-amber-600 hover:bg-amber-700 text-white'
  }`}
>
  Checkout
</button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur bg-black/30 flex justify-center items-center px-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-4 text-2xl text-amber-500 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-700 mb-2">{event.title}</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-semibold text-gray-700">Date:</span> {formatDate(event.start_datetime)} – {formatDate(event.end_datetime)}</p>
                <p><span className="font-semibold text-gray-700">Time:</span> {formatTime(event.start_datetime)} – {formatTime(event.end_datetime)}</p>
                <p><span className="font-semibold text-gray-700">Location:</span> {event.venue?.name}, {event.venue?.address}</p>
              </div>
            </div>
            <hr className="border-gray-200 mb-4" />
            <h3 className="text-lg font-semibold mb-3">Selected Tickets</h3>
            <div className="space-y-2">
              {Object.entries(quantities).filter(([_, qty]) => qty > 0).map(([ticketId, qty]) => {
                const ticket = event.ticket_types.find(t => t.id === parseInt(ticketId));
                return (
                  <div key={ticketId} className="flex justify-between items-center border rounded-md p-3">
                    <div>
                      <p className="font-medium">{ticket.name}</p>
                      <p className="text-xs text-gray-500">{qty} × KSh {ticket.price.toLocaleString()}</p>
                    </div>
                    <p className="font-semibold text-amber-700">KSh {(qty * ticket.price).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t font-bold text-lg text-gray-800">
              <p>Total</p>
              <p>KSh {Object.entries(quantities).reduce((sum, [id, qty]) => sum + qty * event.ticket_types.find(ticket => ticket.id === parseInt(id)).price, 0).toLocaleString()}</p>
            </div>
            <button onClick={handlePayment} className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition">Make Payment</button>
          </div>
        </div>
      )}

      {/* Ticket View */}
      {ticketsData.length > 0 && (
  <div className="fixed inset-0 z-50 backdrop-blur bg-black/60 flex justify-center items-center px-4">
    <div className="bg-transparent rounded-xl w-full max-w-5xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
      <button
        className="absolute top-3 right-4 text-2xl text-amber-500 hover:text-amber-700"
        onClick={() => setTicketsData([])}
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold text-center text-amber-700 mb-6">{event.title} - Tickets</h2>
     <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
  {ticketsData.map((ticket, index) => (
    <TicketView
      key={index}
      event={event}
      ticketData={ticket}
      onClose={() => setTicketsData([])}
      order={orderInfo}
    />
  ))}
</div>

    </div>
  </div>
)}

    </div>
  );
}
