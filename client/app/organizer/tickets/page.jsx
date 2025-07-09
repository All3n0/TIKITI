'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Tag, Clock, Hash } from 'lucide-react';
import axios from 'axios';
import TicketTypeModal from '../components/TicketTypeModal';
import { useRouter } from 'next/navigation';

export default function TicketTypesPage() {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState(null);
  const [organiserId, setOrganiserId] = useState(null);
  const [openEventId, setOpenEventId] = useState(null);
  const router = useRouter();

  const fetchTicketTypes = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5557/organiser/${id}/ticket-types`);
      setTicketTypes(res.data);
    } catch (err) {
      console.error('Error fetching ticket types:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('http://localhost:5557/auth/session', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch session');
        const sessionData = await res.json();
        const user = sessionData.user || sessionData;

        if (!user || !user.id || user.role !== 'organizer') {
          router.push('/login');
          return;
        }

        setOrganiserId(user.id);
        await fetchTicketTypes(user.id);
      } catch (err) {
        console.error('Session check failed:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const openModal = () => {
    setEditingTicketType(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openEditModal = (ticketType) => {
    setEditingTicketType(ticketType);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this ticket type?')) return;
    try {
      await axios.delete(`http://localhost:5557/ticket-types/${id}`);
      await fetchTicketTypes(organiserId);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Group ticket types by event
  const ticketTypesByEvent = ticketTypes.reduce((acc, type) => {
    if (!acc[type.event_id]) acc[type.event_id] = { title: type.event_title, types: [] };
    acc[type.event_id].types.push(type);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <section className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-amber-700">My Ticket Types</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Create Ticket Type</span>
        </button>
      </div>

      {Object.keys(ticketTypesByEvent).length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-base sm:text-lg">No ticket types yet.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {Object.entries(ticketTypesByEvent).map(([eventId, eventData]) => (
            <div key={eventId} className="border rounded-lg sm:rounded-xl shadow-sm bg-white overflow-hidden">
              <button
                onClick={() => setOpenEventId(openEventId === eventId ? null : eventId)}
                className="w-full flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 text-left bg-amber-50 hover:bg-amber-100 transition-all"
              >
                <span className="text-base sm:text-lg font-semibold text-gray-800">{eventData.title}</span>
                {openEventId === eventId ? (
                  <ChevronUp className="text-amber-600 w-5 h-5" />
                ) : (
                  <ChevronDown className="text-amber-600 w-5 h-5" />
                )}
              </button>

              {openEventId === eventId && (
                <div className="divide-y">
                  {eventData.types.map((type) => (
                    <div key={type.id} className="bg-gray-50 p-4 sm:p-5 rounded-lg shadow-sm my-3 sm:my-4 mx-3 sm:mx-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">{type.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(type)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit"
                          >
                            <Edit className="w-4 sm:w-5 h-4 sm:h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(type.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700">
                        <div className="flex items-start gap-2">
                          <Tag className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Price</p>
                            <p className="text-gray-600">KSh {type.price.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Hash className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Availability</p>
                            <p className="text-gray-600">{type.sold || 0} sold of {type.quantity_available}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Sales Period</p>
                            <p className="text-gray-600">
                              {new Date(type.sales_start).toLocaleDateString()} -{' '}
                              {new Date(type.sales_end).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {type.description && (
                        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
                          <p className="font-medium text-gray-700 mb-1">Description</p>
                          <p>{type.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <TicketTypeModal
        open={showModal}
        onClose={closeModal}
        editingTicketType={editingTicketType}
        onSuccess={() => fetchTicketTypes(organiserId)}
        organiserId={organiserId}
      />
    </section>
  );
}