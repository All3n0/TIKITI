'use client';
import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Plus, 
  MapPin, 
  Users, 
  Image as ImageIcon, 
  Handshake,
  Ticket,
  DollarSign,
  Tag,
  Mic,
  Gamepad,
  Film,
  BookOpen,
  Utensils
} from 'lucide-react';
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
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsors, setSelectedSponsors] = useState([]);
  const [selectedSponsorIds, setSelectedSponsorIds] = useState([]);
  const [newSponsorInput, setNewSponsorInput] = useState('');
  const [loadingVenues, setLoadingVenues] = useState(true);

  // Update your useEffect that handles editingEvent
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

      const sponsorObjs = editingEvent.sponsors || [];
      setSelectedSponsorIds(sponsorObjs.map(s => s.id));
      setSelectedSponsors(sponsorObjs);
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
      setSelectedSponsorIds([]);
      setSelectedSponsors([]);
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
    
    const fetchSponsors = async () => {
      try {
        const res = await axios.get('http://localhost:5557/sponsors');
        setSponsors(res.data);
      } catch (err) {
        console.error('Error fetching sponsors:', err);
      }
    };

    fetchVenues();
    fetchSponsors();
  }, []);

  const handleAddSponsor = (sponsor) => {
    setSelectedSponsors(prev => [...prev, sponsor]);
    setSelectedSponsorIds(prev => [...prev, sponsor.id]);
    setNewSponsorInput('');
  };

  const handleRemoveSponsor = (id) => {
    setSelectedSponsors(prev => prev.filter(s => s.id !== id));
    setSelectedSponsorIds(prev => prev.filter(sid => sid !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      sponsor_ids: selectedSponsorIds
    };

    try {
      if (editingEvent) {
        await axios.patch(`http://localhost:5557/events/${editingEvent.id}`, payload);
      } else {
        await axios.post(`http://localhost:5557/organiser/${organiserId}/events`, payload);
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
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            {editingEvent ? (
              <>
                <Mic className="mr-2 w-5 h-5 text-amber-600" />
                Edit Event
              </>
            ) : (
              <>
                <Plus className="mr-2 w-5 h-5 text-amber-600" />
                Create New Event
              </>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-gray-500">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-amber-600 font-semibold mb-1 flex items-center">
              <Ticket className="mr-2 w-4 h-4 text-amber-600" />
              Event Title
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-amber-600 font-semibold mb-1 flex items-center">
              <BookOpen className="mr-2 w-4 h-4 text-amber-600" />
              Description
            </label>
            <textarea
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
  <div className="flex flex-col w-full min-w-0">
    <label className="flex items-center text-sm font-medium text-amber-600 font-semibold mb-1">
      <Calendar className="mr-2 w-4 h-4 text-amber-600" />
      Start Date
    </label>
    <input
      type="datetime-local"
      required
      className="w-full min-w-0 p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
      value={formData.start_datetime}
      onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })}
    />
  </div>

  <div className="flex flex-col w-full min-w-0">
    <label className="flex items-center text-sm font-medium text-amber-600 font-semibold mb-1">
      <Clock className="mr-2 w-4 h-4 text-amber-600" />
      End Date
    </label>
    <input
      type="datetime-local"
      required
      className="w-full min-w-0 p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
      value={formData.end_datetime}
      onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
    />
  </div>
</div>



          {/* Venue & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-amber-600 font-semibold mb-1">
                <MapPin className="mr-2 w-4 h-4 text-amber-600" /> 
                Venue
              </label>
              <select
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                value={formData.venue_id}
                onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
                disabled={loadingVenues}
              >
                <option value="">Select Venue</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-amber-600 font-semibold mb-1">
                <Users className="mr-2 w-4 h-4 text-amber-600" /> 
                Capacity
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="flex items-center text-sm font-medium text-amber-600 font-semibold mb-1">
              <ImageIcon className="mr-2 w-4 h-4 text-amber-600" /> 
              Image URL
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-amber-600 font-semibold mb-1 flex items-center">
              <Tag className="mr-2 w-4 h-4 text-amber-600" />
              Category
            </label>
            <div className="relative">
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select a category</option>
                <option value="Conference">
                  <Mic className="mr-2 w-4 h-4 inline" /> Conference
                </option>
                <option value="Workshop">Workshop</option>
                <option value="Concert">
                  <Mic className="mr-2 w-4 h-4 inline" /> Concert
                </option>
                <option value="Exhibition">Exhibition</option>
                <option value="Sports">
                  <Gamepad className="mr-2 w-4 h-4 inline" /> Sports
                </option>
                <option value="Film">
                  <Film className="mr-2 w-4 h-4 inline" /> Film
                </option>
                <option value="Food">
                  <Utensils className="mr-2 w-4 h-4 inline" /> Food Festival
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-600 font-semibold">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sponsors */}
          <div>
            <label className="flex items-center text-sm font-medium text-amber-600 font-semibold mb-1">
              <Handshake className="mr-2 w-4 h-4 text-amber-600" /> 
              Sponsors
            </label>

            {/* Selected sponsor badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSponsors.map(sponsor => {
                const fullSponsor = sponsors.find(s => s.id === sponsor.id) || sponsor;
                return (
                  <span
                    key={fullSponsor.id}
                    className="inline-flex items-center bg-amber-100/70 text-amber-800 text-sm px-3 py-1 rounded-full border border-amber-200"
                  >
                    {fullSponsor.name}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveSponsor(fullSponsor.id);
                      }}
                      className="ml-2 text-amber-600 hover:text-amber-800 focus:outline-none"
                      aria-label={`Remove ${fullSponsor.name}`}
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Sponsor search & select */}
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  value={newSponsorInput}
                  onChange={(e) => setNewSponsorInput(e.target.value)}
                  placeholder="Search sponsors..."
                  className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-amber-500 focus:border-amber-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                />
                <button
                  type="button"
                  className="px-3 bg-amber-600 text-white rounded-r-md hover:bg-amber-700 flex items-center"
                  onClick={() => {
                    if (newSponsorInput.trim()) {
                      const newSponsor = {
                        id: `temp-${Date.now()}`,
                        name: newSponsorInput,
                        sponsorship_level: 'Custom'
                      };
                      handleAddSponsor(newSponsor);
                    }
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>
              
              {newSponsorInput && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {sponsors
                    .filter(sponsor =>
                      !selectedSponsors.some(s => s.id === sponsor.id) &&
                      sponsor.name.toLowerCase().includes(newSponsorInput.toLowerCase())
                    )
                    .map(sponsor => (
                      <div
                        key={sponsor.id}
                        className="p-2 hover:bg-amber-50 cursor-pointer flex items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddSponsor(sponsor);
                        }}
                      >
                        <span className="mr-2 text-amber-600">
                          <Plus size={16} />
                        </span>
                        {sponsor.name} ({sponsor.sponsorship_level})
                      </div>
                    ))}
                  {sponsors.filter(s =>
                    !selectedSponsors.some(sel => sel.id === s.id) &&
                    s.name.toLowerCase().includes(newSponsorInput.toLowerCase())
                  ).length === 0 && (
                    <div className="p-2 text-sm text-gray-500">No matching sponsors found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <X className="mr-2 w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 flex items-center"
            >
              {editingEvent ? (
                <>
                  <Mic className="mr-2 w-4 h-4" />
                  Update Event
                </>
              ) : (
                <>
                  <Plus className="mr-2 w-4 h-4" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}