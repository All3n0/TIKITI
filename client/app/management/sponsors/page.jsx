'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Building2, ArrowRight, Globe, BadgeDollarSign } from 'lucide-react';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchSponsors = async () => {
    try {
      const token = localStorage.getItem('managementToken');
      if (!token) {
        router.push('/management/login');
        return;
      }

      const res = await fetch('https://servertikiti-production.up.railway.app/sponsors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('managementToken');
          router.push('/management/login');
        }
        throw new Error('Failed to fetch sponsors');
      }

      const data = await res.json();
      setSponsors(data);
    } catch (err) {
      console.error('Failed to fetch sponsors:', err);
      if (err.message !== 'Failed to fetch sponsors') {
        toast.error('Failed to load sponsors');
      }
    } finally {
      setLoading(false);
    }
  };
  
  fetchSponsors();
}, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-teal-600" />
          Our Sponsors
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map(sponsor => (
          <div key={sponsor.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="p-5">
              <div className="flex items-start gap-4">
                {sponsor.logo ? (
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name} 
                    className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-teal-100 flex items-center justify-center">
                    <BadgeDollarSign className="w-6 h-6 text-teal-600" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-800 truncate">{sponsor.name}</h2>
                  
                  {sponsor.website && (
                    <a 
                      href={sponsor.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-teal-600 hover:text-teal-800 mt-1"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      <span className="truncate">{sponsor.website.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link 
                  href={`/management/sponsors/${sponsor.id}`}
                  className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-800"
                >
                  View sponsor details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sponsors.length === 0 && !loading && (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BadgeDollarSign className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No sponsors found</h3>
          <p className="mt-1 text-gray-500">There are currently no sponsors to display</p>
        </div>
      )}
    </div>
  );
}