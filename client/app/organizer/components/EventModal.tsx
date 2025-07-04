// components/EventModal.jsx
'use client';
import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

export default function EventModal({ open, onClose, editingEvent, onSuccess, organiserId }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue_id: '',
    start_datetime: '',
    end_datetime: '',
    image: '',
    category: '',
    capacity: 100
  });
  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description,
        venue_id: editingEvent.venue_id,
        start_datetime: editingEvent.start_datetime,
        end_datetime: editingEvent.end_datetime,
        image: editingEvent.image || '',
        category: editingEvent.category || '',
        capacity: editingEvent.capacity || 100
      });
    } else {
      setFormData({
        title: '',
        description: '',
        venue_id: '',
        start_datetime: '',
        end_datetime: '',
        image: '',
        category: '',
        capacity: 100
      });
    }
  }, [editingEvent]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get('http://localhost:5557/venues');
        setVenues(res.data);
      } catch (err) {
        console.error('Error fetching venues:', err);
      } finally {
        setLoadingVenues(false);
      }
    };
    fetchVenues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await axios.patch(`http://localhost:5557/events/${editingEvent.id}`, formData);
      } else {
        await axios.post(`http://localhost:5557/organiser/${organiserId}/events`, formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Failed to save event. Please try again.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold text-gray-800">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
       
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-gray-500">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Calendar className="mr-2 w-4 h-4" /> Start Date
              </label>
              <input
                type="datetime-local"
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.start_datetime}
                onChange={(e) => setFormData({...formData, start_datetime: e.target.value})}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Clock className="mr-2 w-4 h-4" /> End Date
              </label>
              <input
                type="datetime-local"
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.end_datetime}
                onChange={(e) => setFormData({...formData, end_datetime: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <MapPin className="mr-2 w-4 h-4" /> Venue
              </label>
              <select
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.venue_id}
                onChange={(e) => setFormData({...formData, venue_id: e.target.value})}
                disabled={loadingVenues}
              >
                <option value="">Select Venue</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Users className="mr-2 w-4 h-4" /> Capacity
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <ImageIcon className="mr-2 w-4 h-4" /> Image URL
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="e.g., Music, Sports, Conference"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}