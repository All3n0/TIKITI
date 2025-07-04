'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

export default function TicketTypeModal({ open, onClose, onSuccess, editing, events }:
  { open:boolean, onClose:()=>void, onSuccess:()=>void, editing?:any, events:any[] }) {

  const [form, setForm] = useState({ event_id:'', name:'', price:'', quantity_available:'', sales_start:'', sales_end:'', description:'', is_active:true });

  useEffect(() => {
    if (editing) {
      setForm({
        event_id: editing.event_id.toString(),
        name: editing.name,
        price: editing.price.toString(),
        quantity_available: editing.quantity_available.toString(),
        sales_start: editing.sales_start.slice(0,16),
        sales_end: editing.sales_end.slice(0,16),
        description: editing.description||'',
        is_active: editing.is_active
      });
    } else setForm({ event_id:'', name:'', price:'', quantity_available:'', sales_start:'', sales_end:'', description:'', is_active:true });
  }, [editing]);

  const handle = (e:any) => {
    const {name, value, type, checked} = e.target;
    setForm({...form, [name]: type==='checkbox' ? checked : value});
  };

  const submit = async (e:any) => {
    e.preventDefault();
    const payload = {
      ...form,
      event_id: Number(form.event_id),
      price: Number(form.price),
      quantity_available: Number(form.quantity_available)
    };

    const url = editing ?
      `http://localhost:5557/ticket-types/${editing.id}` :
      'http://localhost:5557/ticket-types';
    const method = editing ? axios.patch : axios.post;
    await method(url, payload);
    onSuccess();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3"><X /></button>
        <h2 className="text-xl mb-4 text-amber-700">{editing ? 'Edit Ticket Type' : 'Add Ticket Type'}</h2>
        <form onSubmit={submit} className="space-y-3">
          <select name="event_id" value={form.event_id} onChange={handle} required className="w-full border p-2 rounded">
            <option value="">Select Event</option>
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
          <input name="name" value={form.name} onChange={handle} placeholder="Name" required className="w-full border p-2 rounded"/>
          <input name="price" value={form.price} onChange={handle} placeholder="Price" type="number" step="0.01" required className="w-full border p-2 rounded"/>
          <input name="quantity_available" value={form.quantity_available} onChange={handle} placeholder="Quantity Available" type="number" required className="w-full border p-2 rounded"/>
          <label>Sales Start:</label>
          <input name="sales_start" value={form.sales_start} onChange={handle} type="datetime-local" required className="w-full border p-2 rounded"/>
          <label>Sales End:</label>
          <input name="sales_end" value={form.sales_end} onChange={handle} type="datetime-local" required className="w-full border p-2 rounded"/>
          <textarea name="description" value={form.description} onChange={handle} placeholder="Description" className="w-full border p-2 rounded"/>
          <label className="inline-flex items-center gap-2">
            <input name="is_active" type="checkbox" checked={form.is_active} onChange={handle}/>
            Active
          </label>
          <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded w-full">
            {editing ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
}
