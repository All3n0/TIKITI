'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

export default function EventCreationModal({ open, onClose, onSuccess, organiserId }) {
  const [venueCapacity, setVenueCapacity] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue_id: '',
    start_datetime: '',
    end_datetime: '',
    image: '',
    category: '',
    capacity: 0
  });

  const [ticketTypes, setTicketTypes] = useState([
    { name: '', price: '', quantity: '', sales_start: '', sales_end: '', description: '' }
  ]);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get('http://localhost:5557/venues');
        setVenues(res.data);
      } catch (err) {
        console.error('Error fetching venues:', err);
      }
    };
    fetchVenues();
  }, []);

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { name: '', price: '', quantity: '', sales_start: '', sales_end: '', description: '' }
    ]);
  };

  const updateTicketType = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

  // Check ticket quantity vs capacity whenever ticketTypes or venueCapacity changes
  useEffect(() => {
    const total = ticketTypes.reduce((sum, t) => sum + Number(t.quantity || 0), 0);
    if (total > venueCapacity) {
      setError(`Total tickets (${total}) exceed venue capacity (${venueCapacity})`);
    } else {
      setError('');
    }
  }, [ticketTypes, venueCapacity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const total = ticketTypes.reduce((sum, t) => sum + Number(t.quantity || 0), 0);
    if (total > venueCapacity) {
      setError(`Total tickets (${total}) exceed venue capacity (${venueCapacity})`);
      return;
    }

    const payload = {
      ...formData,
      capacity: venueCapacity, // force backend to use venue's capacity
      ticket_types: ticketTypes
    };

    try {
      await axios.post(`http://localhost:5557/organiser/${organiserId}/events`, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Failed to save event.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold text-gray-800">Create New Event</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-gray-700">

          {/* Event Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Event Info</h3>
            <div className="space-y-4">
              <input type="text" required placeholder="Title" className="w-full p-2 border rounded"
                value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              <textarea placeholder="Description" className="w-full p-2 border rounded"
                value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <input type="datetime-local" required className="p-2 border rounded"
                  value={formData.start_datetime} onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })} />
                <input type="datetime-local" required className="p-2 border rounded"
                  value={formData.end_datetime} onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })} />
              </div>
              <input type="text" placeholder="Category" className="w-full p-2 border rounded"
                value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              <input type="text" placeholder="Image URL" className="w-full p-2 border rounded"
                value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
            </div>
          </div>

          {/* Venue & Capacity */}
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Venue & Capacity</h3>
            <div className="grid grid-cols-2 gap-4">
              <select required className="w-full p-2 border rounded"
                value={formData.venue_id}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const venue = venues.find(v => v.id.toString() === selectedId);
                  const capacity = venue?.capacity || 0;
                  setFormData({ ...formData, venue_id: selectedId, capacity });
                  setVenueCapacity(capacity);
                }}>
                <option value="">Select Venue</option>
                {venues.map(v => <option key={v.id} value={v.id}>{v.name} - {v.city}</option>)}
              </select>
              <input type="number" disabled placeholder="Capacity" className="w-full p-2 border rounded bg-gray-100"
                value={venueCapacity} />
            </div>
          </div>

          {/* Ticket Types */}
          <div>
            <h3 className="text-lg font-semibold mb-2">3. Ticket Types</h3>
            {ticketTypes.map((ticket, index) => (
              <div key={index} className="space-y-2 border p-4 rounded mb-4 bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <input type="text" placeholder="Type (e.g. VIP)" className="p-2 border rounded"
                    value={ticket.name} onChange={(e) => updateTicketType(index, 'name', e.target.value)} />
                  <input type="number" placeholder="Price" className="p-2 border rounded"
                    value={ticket.price} onChange={(e) => updateTicketType(index, 'price', e.target.value)} />
                  <input type="number" placeholder="Quantity" className="p-2 border rounded"
                    value={ticket.quantity} onChange={(e) => updateTicketType(index, 'quantity', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="datetime-local" placeholder="Sales Start" className="p-2 border rounded"
                    value={ticket.sales_start} onChange={(e) => updateTicketType(index, 'sales_start', e.target.value)} />
                  <input type="datetime-local" placeholder="Sales End" className="p-2 border rounded"
                    value={ticket.sales_end} onChange={(e) => updateTicketType(index, 'sales_end', e.target.value)} />
                </div>
                <textarea placeholder="Description (optional)" className="w-full p-2 border rounded"
                  value={ticket.description} onChange={(e) => updateTicketType(index, 'description', e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={addTicketType} className="text-sm text-amber-600 mt-1">+ Add Another Ticket Type</button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${error ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700'}`}
              disabled={!!error}
            >
              Create Event
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
