'use client';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SponsorModal({ open, onClose, onSuccess, editing }: {
  open: boolean, onClose: () => void, onSuccess: () => void, editing?: any
}) {
  const [form, setForm] = useState({
    name: '',
    logo: '',
    website: '',
    contact_email: '',
    sponsorship_level: ''
  });

  useEffect(() => {
    setForm(editing ? {
      name: editing.name || '',
      logo: editing.logo || '',
      website: editing.website || '',
      contact_email: editing.contact_email || '',
      sponsorship_level: editing.sponsorship_level || ''
    } : {
      name: '',
      logo: '',
      website: '',
      contact_email: '',
      sponsorship_level: ''
    });
  }, [editing]);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `https://servertikiti-production.up.railway.app/sponsors/${editing.id}` : 'https://servertikiti-production.up.railway.app/sponsors';
      const method = editing ? axios.patch : axios.post;
      await method(url, form);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving sponsor:', error);
      alert('Error saving sponsor. Please try again.');
    }
  };

  if (!open) return null;

  return (
   <div className="fixed inset-0 flex items-center backdrop-blur justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {editing ? 'Edit Sponsor' : 'Add Sponsor'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={submit} className="p-6 space-y-4 text-gray-500">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handle}
              placeholder="Company name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              name="logo"
              value={form.logo}
              onChange={handle}
              placeholder="https://example.com/logo.png"
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              name="website"
              value={form.website}
              onChange={handle}
              placeholder="https://company.com"
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              name="contact_email"
              value={form.contact_email}
              onChange={handle}
              placeholder="contact@company.com"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sponsorship Level</label>
            <input
              name="sponsorship_level"
              value={form.sponsorship_level}
              onChange={handle}
              placeholder="Gold, Silver, Bronze, etc."
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
              {editing ? 'Update Sponsor' : 'Create Sponsor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}