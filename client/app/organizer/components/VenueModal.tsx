'use client';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VenueModal({ open, onClose, onSuccess, editing }: {
  open: boolean, onClose: () => void, onSuccess: () => void, editing?: any
}) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    capacity: ''
  });

  useEffect(() => {
    setForm(editing ? {
      name: editing.name || '',
      address: editing.address || '',
      city: editing.city || '',
      state: editing.state || '',
      zip_code: editing.zip_code || '',
      capacity: editing.capacity?.toString() || ''
    } : {
      name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      capacity: ''
    });
  }, [editing]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const payload = { 
      ...form, 
      capacity: form.capacity ? Number(form.capacity) : null 
    };
    const url = editing ? `http://localhost:5557/venues/${editing.id}` : 'http://localhost:5557/venues';
    const method = editing ? axios.patch : axios.post;
    await method(url, payload);
    onSuccess();
    onClose();
  } catch (error) {
    console.error('Error saving venue:', error);
    alert('Error saving venue. Please try again.');
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {editing ? 'Edit Venue' : 'Add Venue'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={submit} className="p-6 space-y-4 text-gray-800">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handle}
              placeholder="e.g., Grand Ballroom"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handle}
              placeholder="Street address"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handle}
                placeholder="City"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                name="state"
                value={form.state}
                onChange={handle}
                placeholder="State"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input
              name="zip_code"
              value={form.zip_code}
              onChange={handle}
              placeholder="Postal code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input
              name="capacity"
              value={form.capacity}
              onChange={handle}
              placeholder="Number of people"
              type="number"
              min="1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              {editing ? 'Update Venue' : 'Create Venue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}