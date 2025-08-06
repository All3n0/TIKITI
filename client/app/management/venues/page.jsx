'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddVenueModal from '../components/AddVenueModal';

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleVenueAdded = (newVenue) => {
    setVenues(prev => [...prev, newVenue]);
    setFilteredVenues(prev => [...prev, newVenue]);
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch('https://servertikiti-production.up.railway.app/management/venues', {
          credentials: 'include'
        });

        if (!res.ok) {
          router.push('/management/login');
          return;
        }

        const data = await res.json();
        setVenues(data);
        setFilteredVenues(data);
      } catch (err) {
        console.error('Error fetching venues:', err);
        router.push('/management/login');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [router]);

  useEffect(() => {
    const results = venues.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          venue.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          venue.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || venue.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredVenues(results);
  }, [searchTerm, statusFilter, venues]);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Venues Management</h1>
          </div>
          
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Venue</span>
          </button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1 min-w-[150px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700"
            />
          </div>

          <div className="relative w-full sm:w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full border border-gray-300 rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 md:mb-6 flex items-center text-sm text-gray-500">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Showing {filteredVenues.length} of {venues.length} venues
      </div>

      {/* Venues Grid */}
      {filteredVenues.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No venues found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredVenues.map(venue => (
            <div key={venue.id} className="bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{venue.name}</h2>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{venue.city}, {venue.state}</span>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    venue.status === 'approved' ? 'bg-green-100 text-green-800' :
                    venue.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {venue.status}
                  </span>
                </div>

                <div className="mt-3 sm:mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="line-clamp-2">{venue.address}</span>
                  </div>

                  {venue.capacity && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Capacity: {venue.capacity.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 sm:mt-5 flex justify-between items-center">
                  <Link
                    href={`/management/venues/${venue.id}`}
                    className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-800"
                  >
                    View details
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <div className="text-xs text-gray-400">
                    ID: {venue.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddVenueModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onVenueAdded={handleVenueAdded}
      />
    </div>
  );
}