'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrganizersManagementPage() {
  const [organizers, setOrganizers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

useEffect(() => {
  const fetchOrganizers = async () => {
    try {
      const token = localStorage.getItem('managementToken');
      if (!token) {
        router.push('/management/login');
        return;
      }

      const res = await fetch('https://servertikiti-production.up.railway.app/management/organizers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('managementToken');
        }
        router.push('/management/login');
        return;
      }

      const data = await res.json();
      setOrganizers(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('managementToken');
      router.push('/management/login');
    } finally {
      setLoading(false);
    }
  };

  fetchOrganizers();
}, [router]);

useEffect(() => {
  const results = organizers.filter(org => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || org.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  setFiltered(results);
}, [searchTerm, statusFilter, organizers]);

  if (loading) return <div className="text-center py-20">Loading organizers...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold underline underline-offset-4 text-teal-800">Organizers Management</h1>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search organizers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700 w-full"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-600">
        Showing {filtered.length} of {organizers.length} organizers
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No organizers found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((org) => (
            <div key={org.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
              {/* Logo + Status badge */}
              <div className="relative h-44 bg-gray-50 flex justify-center items-center">
                <img
                  src={org.logo || '/placeholder.png'}
                  alt={org.name}
                  className="max-h-full object-contain"
                />
                {/* <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs rounded-full ${
                  org.status === 'approved'
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : org.status === 'rejected'
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                }`}>
                  {org.status || 'pending'}
                </span> */}
              </div>

              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{org.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{org.email}</p>
                {org.speciality && (
  <div className="mb-4">
    <span className="inline-block text-sm text-white bg-teal-500 px-3 py-1 rounded-full">
      {org.speciality}
    </span>
  </div>
)}


                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <Link
                    href={`/management/organizers/${org.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Organizer
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
