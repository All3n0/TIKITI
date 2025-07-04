'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Tag, Clock, Hash } from 'lucide-react';
import axios from 'axios';
import TicketTypeModal from '../components/TicketTypeModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TicketTypesPage() {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState(null);
  const [organiserId, setOrganiserId] = useState(null);
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
        
        if (!res.ok) {
          throw new Error('Failed to fetch session');
        }
        
        const sessionData = await res.json();
        console.log('Session data:', sessionData);
        
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
        <h1 className="text-2xl font-bold text-amber-700">My Ticket Types</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
        >
          <Plus className="w-5 h-5" />
          <span>Create Ticket Type</span>
        </button>
      </div>

      {ticketTypes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No ticket types yet.</p>
          <button
            onClick={openModal}
            className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
          >
            Create Your First Ticket Type
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ticketTypes.map((ticketType) => (
            <div
              key={ticketType.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-all flex flex-col"
            >
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-lg text-gray-800">{ticketType.name}</h2>
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {ticketType.event_title}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Tag className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Price</p>
                      <p className="text-sm text-gray-600">
                        KSh {ticketType.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Hash className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Availability</p>
                      <p className="text-sm text-gray-600">
                        {ticketType.sold || 0} sold of {ticketType.quantity_available}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Sales Period</p>
                      <p className="text-sm text-gray-600">
                        {new Date(ticketType.sales_start).toLocaleDateString()} -{' '}
                        {new Date(ticketType.sales_end).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {ticketType.description && (
                    <div className="text-sm text-gray-600 mt-2">
                      <p className="font-medium text-gray-700">Description</p>
                      <p>{ticketType.description}</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t flex justify-end gap-3">
                  <button
                    onClick={() => openEditModal(ticketType)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ticketType.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
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