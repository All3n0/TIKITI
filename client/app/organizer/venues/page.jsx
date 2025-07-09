'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import VenueModal from '../components/VenueModal';

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetch = async () => {
    try {
      const res = await axios.get('http://localhost:5557/venues');
      setVenues(res.data);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const confirmDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;
    try {
      await axios.delete(`http://localhost:5557/venues/${id}`);
      fetch();
    } catch (error) {
      console.error('Error deleting venue:', error);
      alert('Failed to delete venue');
    }
  };

  return (
    <section className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-700">Venues</h1>
        <button 
          onClick={() => { setEditing(null); setModalOpen(true); }} 
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> 
          <span className="whitespace-nowrap">Add Venue</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-base sm:text-lg mb-4">No venues found</p>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
          >
            Add Your First Venue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {venues.map(v => (
            <div key={v.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <h2 className="font-bold text-lg text-gray-800 mb-1">{v.name}</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-2">{v.city}, {v.state}</p>
              {v.address && <p className="text-xs sm:text-sm text-gray-500 mb-3">{v.address}</p>}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                <span className="font-medium">Capacity:</span>
                <span>{v.capacity?.toLocaleString() || 'N/A'}</span>
              </div>
              {/* <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => { setEditing(v); setModalOpen(true); }}
                  className="text-amber-600 hover:text-amber-700 flex items-center gap-1 text-xs sm:text-sm font-medium"
                >
                  <Edit size={14} sm:size={16} /> Edit
                </button>
                <button
                  onClick={() => confirmDelete(v.id)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs sm:text-sm font-medium"
                >
                  <Trash2 size={14} sm:size={16} /> Delete
                </button>
              </div> */}
            </div>
          ))}
        </div>
      )}

      <VenueModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} onSuccess={fetch} />
    </section>
  );
}