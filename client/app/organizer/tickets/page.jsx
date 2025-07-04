'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import TicketTypeModal from '../components/TicketTypeModal';

export default function TicketTypesPage() {
  const [types, setTypes] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [organiserId, setOrganiserId] = useState(null);

  async function getSession() {
    try {
      const res = await fetch('http://localhost:5557/auth/session', { credentials: 'include' });
      return await res.json();
    } catch (err) {
      setError('Failed to fetch session');
      return {};
    }
  }

  useEffect(() => {
    getSession().then(({ user }) => {
      if (user?.id) {
        setOrganiserId(user.id);
        // Fetch events for this organiser
        axios.get(`http://localhost:5557/organiser/${user.id}/events`)
          .then(res => setEvents(res.data))
          .catch(err => setError('Failed to fetch events'));
      }
    });
  }, []);

  useEffect(() => {
    if (!organiserId) return;
    
    setLoading(true);
    axios.get(`http://localhost:5557/organiser/${organiserId}/ticket-types`)
      .then(res => {
        setTypes(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch ticket types');
        setLoading(false);
      });
  }, [organiserId]);

  const confirmDelete = async (id) => {
    if (!confirm('Delete this ticket type?')) return;
    try {
      await axios.delete(`http://localhost:5557/ticket-types/${id}`);
      setTypes(types.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete ticket type');
    }
  };

  if (error) {
    return (
      <section className="p-6">
        <div className="text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-amber-700">Ticket Types</h1>
        <button 
          onClick={() => { setEditing(null); setModalOpen(true); }} 
          className="bg-amber-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus /> Add Type
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : types.length === 0 ? (
        <p>No ticket types found. Create your first ticket type.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Event</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Available</th>
                <th className="p-2 text-left">Sold</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map(t => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{t.event_title}</td>
                  <td className="p-2">{t.name}</td>
                  <td className="p-2">${t.price.toFixed(2)}</td>
                  <td className="p-2">{t.quantity_available}</td>
                  <td className="p-2">{t.sold}</td>
                  <td className="p-2 flex gap-2">
                    <button 
                      onClick={() => { setEditing(t); setModalOpen(true); }} 
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => confirmDelete(t.id)} 
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TicketTypeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        events={events}
        editing={editing}
        onSuccess={() => {
          setModalOpen(false);
          if (organiserId) {
            axios.get(`http://localhost:5557/organiser/${organiserId}/ticket-types`)
              .then(res => setTypes(res.data))
              .catch(err => setError('Failed to refresh ticket types'));
          }
        }}
      />
    </section>
  );
}