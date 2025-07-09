'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import SponsorModal from '../components/SponsorModal';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetch = async () => {
    try {
      const res = await axios.get('http://localhost:5557/sponsors');
      setSponsors(res.data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const confirmDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;
    try {
      await axios.delete(`http://localhost:5557/sponsors/${id}`);
      fetch();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      alert('Failed to delete sponsor');
    }
  };

  return (
    <section className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-700">Sponsors</h1>
        <button 
          onClick={() => { setEditing(null); setModalOpen(true); }} 
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> 
          <span className="whitespace-nowrap">Add Sponsor</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        </div>
      ) : sponsors.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-500 text-base sm:text-lg mb-4">No sponsors found</p>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
          >
            Add Your First Sponsor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sponsors.map(s => (
            <div key={s.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                {s.logo && (
                  <img 
                    src={s.logo} 
                    alt={`${s.name} logo`} 
                    className="w-16 h-16 object-contain rounded-md mx-auto sm:mx-0"
                  />
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="font-bold text-lg text-gray-800 mb-1">{s.name}</h2>
                  {s.sponsorship_level && (
                    <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded mb-2">
                      {s.sponsorship_level}
                    </span>
                  )}
                  {s.website && (
                    <a 
                      href={s.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block mb-1 truncate"
                    >
                      {s.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  {s.contact_email && (
                    <a 
                      href={`mailto:${s.contact_email}`}
                      className="text-gray-600 text-sm block truncate"
                    >
                      {s.contact_email}
                    </a>
                  )}
                </div>
              </div>
              {/* <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => { setEditing(s); setModalOpen(true); }}
                  className="text-amber-600 hover:text-amber-700 flex items-center gap-1 text-sm font-medium"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => confirmDelete(s.id)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div> */}
            </div>
          ))}
        </div>
      )}

      <SponsorModal open={modalOpen} onClose={() => setModalOpen(false)} editing={editing} onSuccess={fetch} />
    </section>
  );
}