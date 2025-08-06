'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TicketView from '../../components/TicketView'; // Adjust path if needed

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('https://servertikiti-production.up.railway.app//auth/session', { withCredentials: true });
        if (res.data) setUser(res.data);
      } catch (err) {
        console.error('Error fetching user', err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await axios.get('https://servertikiti-production.up.railway.app//profile/tickets', { withCredentials: true });
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post('https://servertikiti-production.up.railway.app//auth/logout', {}, { withCredentials: true });
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const openTicketView = (event, order, ticket) => {
    setSelectedEvent(event);
    setSelectedOrder(order);
    setSelectedTicket(ticket);
  };

  const closeTicketView = () => {
    setSelectedTicket(null);
    setSelectedEvent(null);
    setSelectedOrder(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 sm:p-8">

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-amber-100 p-3 sm:p-4 rounded-full">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{user.username}</h2>
              <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-auto sm:items-end">
            {user.role === 'user' && (
              <button
                onClick={async () => {
                  try {
                    await axios.post('https://servertikiti-production.up.railway.app//auth/switch-to-organizer', {}, { withCredentials: true });
                    router.push('/login');
                  } catch (err) {
                    console.error('Switch failed:', err);
                  }
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg text-sm"
              >
                Switch to Organizer
              </button>
            )}
            {user.role === 'organizer' && (
              <button
                onClick={() => router.push('/organizer/dashboard')}
                className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg text-sm"
              >
                View Organizer Panel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Events & Tickets */}
        <div className="mt-10">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Your Events & Tickets</h3>
          {orders.length === 0 ? (
            <div className="text-gray-500 italic text-sm sm:text-base">No events or tickets yet.</div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <h4 className="text-base sm:text-lg font-bold text-amber-700 mb-1">{order.event?.title}</h4>
                  <p className="text-gray-500 text-xs sm:text-sm mb-2">
                    Order #{order.id} • {new Date(order.order_date).toLocaleDateString()} • Total: KES {order.total_amount.toLocaleString()}
                  </p>
                  <ul className="ml-4 list-disc text-sm text-gray-700 space-y-2">
                    {order.tickets.map(ticket => (
                      <li key={ticket.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <span>{ticket.attendee_name} ({ticket.ticket_type}) — KES {ticket.price}</span>
                        <button
                          onClick={() => openTicketView(order.event, order, ticket)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-md transition-colors duration-200 text-sm"
                        >
                          <svg 
                            className="w-4 h-4" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="font-medium">View Ticket</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket View Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 backdrop-blur bg-black/60 flex items-center justify-center px-4">
          <div className="relative max-w-4xl w-full">
            <TicketView
              event={selectedEvent}
              order={selectedOrder}
              ticketData={{
                ...selectedTicket,
                serial: selectedTicket.unique_code
              }}
              onClose={closeTicketView}
            />
            <button
              onClick={closeTicketView}
              className="absolute top-4 right-6 text-white text-3xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
