'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, X } from 'lucide-react';

export default function TicketTypeModal({
  open,
  onClose,
  editingTicketType,
  onSuccess,
  organiserId,
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [description, setDescription] = useState('');
  const [eventId, setEventId] = useState('');
  const [salesStart, setSalesStart] = useState('');
  const [salesEnd, setSalesEnd] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTicketType) {
      setName(editingTicketType.name);
      setPrice(editingTicketType.price);
      setQuantityAvailable(editingTicketType.quantity_available);
      setDescription(editingTicketType.description || '');
      setEventId(editingTicketType.event_id);
      setSalesStart(formatDateForInput(editingTicketType.sales_start));
      setSalesEnd(formatDateForInput(editingTicketType.sales_end));
      setIsActive(editingTicketType.is_active);
    } else {
      resetForm();
    }
  }, [editingTicketType]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`http://localhost:5557/organiser/${organiserId}/events`);
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    if (organiserId) {
      fetchEvents();
    }
  }, [organiserId]);

 const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Convert to local datetime string in format YYYY-MM-DDTHH:MM
    const pad = (num) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setQuantityAvailable('');
    setDescription('');
    setEventId('');
    setSalesStart('');
    setSalesEnd('');
    setIsActive(true);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Helper function to format date for backend
  const formatDateForBackend = (dateString) => {
    if (!dateString) return null;
    try {
      // Create date object and format as YYYY-MM-DDTHH:MM:SS
      const date = new Date(dateString);
      const pad = (num) => num.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    } catch (err) {
      console.error('Error formatting date:', err);
      return null;
    }
  };

  const ticketTypeData = {
    name,
    price: parseFloat(price),
    quantity_available: parseInt(quantityAvailable),
    description,
    event_id: parseInt(eventId),
    sales_start: formatDateForBackend(salesStart),
    sales_end: formatDateForBackend(salesEnd),
    is_active: isActive,
  };

  console.log('Submitting:', ticketTypeData); // For debugging

  try {
    if (editingTicketType) {
      await axios.patch(
        `http://localhost:5557/ticket-types/${editingTicketType.id}`,
        ticketTypeData
      );
    } else {
      await axios.post('http://localhost:5557/ticket-types', ticketTypeData);
    }
    onSuccess();
    onClose();
  } catch (err) {
    console.error('Error saving ticket type:', err);
    alert(`Error saving ticket type: ${err.response?.data?.error || err.message}`);
  } finally {
    setLoading(false);
  }
};
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-4">
          {editingTicketType ? 'Edit Ticket Type' : 'Create New Ticket Type'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">KSh</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 pl-12 border rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={quantityAvailable}
                onChange={(e) => setQuantityAvailable(e.target.value)}
                className="w-full p-2 border rounded-md"
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sales Start</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={salesStart}
                  onChange={(e) => setSalesStart(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sales End</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={salesEnd}
                  onChange={(e) => setSalesEnd(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}