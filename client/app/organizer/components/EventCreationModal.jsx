'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Calendar, MapPin, Ticket, DollarSign, Users, Image, Info, Handshake, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

export default function EventCreationModal({ open, onClose, onSuccess, organiserId }) {
  const [venueCapacity, setVenueCapacity] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [sponsors, setSponsors] = useState([]);
  const [filteredSponsors, setFilteredSponsors] = useState([]);
  const [selectedSponsorIds, setSelectedSponsorIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const formRef = useRef(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get('http://localhost:5557/venues');
        setVenues(res.data);
      } catch (err) {
        console.error('Error fetching venues:', err);
      }
    };

    const fetchSponsors = async () => {
      try {
        const res = await axios.get('http://localhost:5557/sponsors');
        setSponsors(res.data);
        setFilteredSponsors(res.data);
      } catch (err) {
        console.error('Error fetching sponsors:', err);
      }
    };

    fetchVenues();
    fetchSponsors();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = sponsors.filter(sponsor =>
        sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.sponsorship_level.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSponsors(filtered);
    } else {
      setFilteredSponsors(sponsors);
    }
  }, [searchQuery, sponsors]);

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { name: '', price: '', quantity: '', sales_start: '', sales_end: '', description: '' }
    ]);
  };

  const removeTicketType = (index) => {
    const updated = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(updated);
  };

  const updateTicketType = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

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
    setIsSubmitting(true);

    const total = ticketTypes.reduce((sum, t) => sum + Number(t.quantity || 0), 0);
    if (total > venueCapacity) {
      setError(`Total tickets (${total}) exceed venue capacity (${venueCapacity})`);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      capacity: venueCapacity,
      ticket_types: ticketTypes,
      sponsor_ids: selectedSponsorIds
    };

    try {
    const res = await fetch(`http://localhost:5557/organiser/${organiserId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create event');
    }

    onSuccess();
    onClose();
  } catch (err) {
    console.error('Error saving event:', err);
    alert(err.message || 'Failed to save event. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      formRef.current.scrollLeft = (currentStep) * formRef.current.offsetWidth;
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      formRef.current.scrollLeft = (currentStep - 2) * formRef.current.offsetWidth;
    }
  };

  const toggleSponsorSelection = (sponsorId) => {
    setSelectedSponsorIds(prev => 
      prev.includes(sponsorId) 
        ? prev.filter(id => id !== sponsorId) 
        : [...prev, sponsorId]
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center border-b p-4">
          <h2 className="text-2xl font-bold text-gray-800 underline underline-offset-4">Create New Event</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-amber-600 h-1 transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="flex-1 overflow-hidden"
          id='event-form'
        >
          <div 
            ref={formRef}
            className="flex h-full w-full overflow-x-hidden snap-x snap-mandatory scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Step 1: Event Info */}
            <div className="w-full flex-shrink-0 snap-start p-6 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-6 flex items-center text-amber-600">
                <Info className="text-amber-600 mr-2" size={20} />
                Event Information
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-lg text-amber-700 font-semibold mb-2">Event Title*</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Annual Tech Conference" 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-600 outline-none"
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-lg text-amber-700 font-semibold mb-2">Description</label>
                  <textarea 
                    placeholder="Describe your event..." 
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-600 outline-none"
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-lg text-amber-700 font-semibold mb-2 flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Start Date & Time*
                    </label>
                    <input 
                      type="datetime-local" 
                      required 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-600 outline-none"
                      value={formData.start_datetime} 
                      onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-lg text-amber-700 font-semibold mb-2 flex items-center ">
                      <Calendar className="mr-2 h-4 w-4" />
                      End Date & Time*
                    </label>
                    <input 
                      type="datetime-local" 
                      required 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-600 outline-none"
                      value={formData.end_datetime} 
                      onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-lg text-amber-700 font-semibold mb-2">Category</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Conference, Workshop" 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-600 outline-none"
                      value={formData.category} 
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-lg text-amber-700 font-semibold mb-2 flex items-center">
                      <Image className="mr-2 h-4 w-4" />
                      Image URL
                    </label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/image.jpg" 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-600 outline-none"
                      value={formData.image} 
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Venue & Capacity */}
            <div className="w-full flex-shrink-0 snap-start p-6 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-6 flex items-center text-amber-600">
                <MapPin className="text-amber-600 mr-2" size={20} />
                Venue & Capacity
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-lg text-amber-700 font-semibold mb-2">Select Venue*</label>
                  <select 
                    required 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-600 outline-none"
                    value={formData.venue_id}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const venue = venues.find(v => v.id.toString() === selectedId);
                      const capacity = venue?.capacity || 0;
                      setFormData({ ...formData, venue_id: selectedId, capacity });
                      setVenueCapacity(capacity);
                    }}
                  >
                    <option value="">Select a venue...</option>
                    {venues.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} - {v.city} (Capacity: {v.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-lg text-amber-700 font-semibold mb-2 flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Venue Capacity
                  </label>
                  <input 
                    type="number" 
                    disabled 
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 outline-none"
                    value={venueCapacity} 
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Sponsors */}
<div className="w-full flex-shrink-0 snap-start p-6 overflow-y-auto">
  <h3 className="text-xl font-semibold mb-6 flex items-center text-amber-600">
    <Handshake className="text-amber-600 mr-2" size={20} />
    Sponsors
  </h3>
  
  <div className="space-y-6">
    <div className="relative">
      <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search sponsors by name or level..."
        className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-600 outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    {/* Selected sponsors section - always visible if there are selections */}
    {selectedSponsorIds.length > 0 && (
      <div className="border rounded-lg divide-y">
        <div className="p-3 bg-amber-50 border-b">
          <h4 className="font-medium text-amber-800">Selected Sponsors</h4>
        </div>
        {sponsors
          .filter(sponsor => selectedSponsorIds.includes(sponsor.id))
          .map(sponsor => (
            <div 
              key={sponsor.id} 
              className="p-4 flex items-center cursor-pointer hover:bg-amber-50"
              onClick={() => toggleSponsorSelection(sponsor.id)}
            >
              <input
                type="checkbox"
                checked={true}
                onChange={() => toggleSponsorSelection(sponsor.id)}
                className="h-4 w-4 accent-amber-600 rounded border-gray-300 focus:ring-amber-500 mr-3 "
              />
              <div>
                <p className="font-medium text-gray-900">{sponsor.name}</p>
                <p className="text-sm text-gray-500">{sponsor.sponsorship_level}</p>
              </div>
            </div>
          ))
        }
      </div>
    )}

    {/* Search results section - only shown when searching */}
    {searchQuery && (
      <div className="border rounded-lg divide-y">
        <div className="p-3 bg-gray-50 border-b">
          <h4 className="font-medium text-gray-700">Search Results</h4>
        </div>
        {filteredSponsors.length > 0 ? (
          filteredSponsors
            .filter(sponsor => !selectedSponsorIds.includes(sponsor.id)) // Exclude already selected
            .map(sponsor => (
              <div 
                key={sponsor.id} 
                className="p-4 flex items-center cursor-pointer hover:bg-gray-50"
                onClick={() => toggleSponsorSelection(sponsor.id)}
              >
                <input
  type="checkbox"
  checked={selectedSponsorIds.includes(sponsor.id)}
  onChange={() => toggleSponsorSelection(sponsor.id)}
                className="h-4 w-4 accent-amber-600 rounded border-gray-300 focus:ring-amber-500 mr-3 "
/>

                <div>
                  <p className="font-medium text-gray-900">{sponsor.name}</p>
                  <p className="text-sm text-gray-500">{sponsor.sponsorship_level}</p>
                </div>
              </div>
            ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No sponsors found matching your search
          </div>
        )}
      </div>
    )}

    {/* Empty state - shown when no search and no selections */}
    {!searchQuery && selectedSponsorIds.length === 0 && (
      <div className="p-8 text-center border-2 border-dashed rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <Search className="h-8 w-8 text-gray-400 mb-2" />
          <h4 className="text-lg font-medium text-gray-700">Search for sponsors</h4>
          <p className="text-sm text-gray-500 mt-1">
            Start typing to find and select sponsors for your event
          </p>
        </div>
      </div>
    )}
  </div>
</div>
            {/* Step 4: Ticket Types */}
            <div className="w-full flex-shrink-0 snap-start p-6 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-6 flex items-center text-amber-600">
                <Ticket className="text-amber-600 mr-2" size={20} />
                Ticket Types
              </h3>
              
              <div className="space-y-6">
                {ticketTypes.map((ticket, index) => (
                  <div key={index} className="border p-5 rounded-xl bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-800">Ticket Type #{index + 1}</h4>
                      {ticketTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTicketType(index)}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-amber-600 font-semibold mb-1 ">Type Name*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. VIP, General Admission"
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700 outline-none"
                          value={ticket.name}
                          onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-amber-600 font-semibold mb-1 flex items-center">
                          <DollarSign className="mr-1 h-4 w-4" />
                          Price*
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700 outline-none"
                          value={ticket.price}
                          onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-amber-600 font-semibold mb-1">Quantity*</label>
                        <input
                          type="number"
                          required
                          placeholder="100"
                          min="1"
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700 outline-none"
                          value={ticket.quantity}
                          onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-amber-600 font-semibold mb-1">Sales Start</label>
                        <input
                          type="datetime-local"
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700 outline-none"
                          value={ticket.sales_start}
                          onChange={(e) => updateTicketType(index, 'sales_start', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-amber-600 font-semibold mb-1">Sales End</label>
                        <input
                          type="datetime-local"
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700 outline-none"
                          value={ticket.sales_end}
                          onChange={(e) => updateTicketType(index, 'sales_end', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-amber-600 font-semibold mb-1">Description</label>
                      <textarea
                        placeholder="Ticket benefits, restrictions, etc."
                        rows={2}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700 outline-none"
                        value={ticket.description}
                        onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addTicketType}
                  className="flex items-center text-amber-600 hover:text-amber-800 font-medium"
                >
                  <span className="mr-1">+</span> Add Another Ticket Type
                </button>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <X className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-lg border flex items-center ${currentStep === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 flex items-center"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          ) : (
<button
  type="submit"
  form="event-form"  // Connect to the form
  disabled={!!error || isSubmitting}
  className={`px-6 py-2 rounded-lg text-white font-medium flex items-center ${
    error || isSubmitting 
      ? 'bg-gray-400 cursor-not-allowed' 
      : 'bg-amber-600 hover:bg-amber-700'
  }`}
>
  {isSubmitting ? (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Creating...
    </>
  ) : 'Create Event'}
</button>
          )}
        </div>
      </div>
    </div>
  );
}