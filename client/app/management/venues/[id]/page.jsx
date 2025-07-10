'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, MapPin, Home, Users, Mail, Phone, Globe, Edit, X, Check, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VenueDetailsPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [venue, setVenue] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch(`http://localhost:5557/management/venues/${id}`, {
          credentials: 'include',
        });
        if (!res.ok) return router.push('/management/login');

        const data = await res.json();
        setVenue(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id, router]);

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5557/venues/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.status === 204) {
        toast.success('Venue deleted successfully');
        router.push('/management/venues');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete venue');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error occurred');
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5557/management/venues/${id}/${newStatus}`, {
        method: 'PATCH',
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        setVenue(prev => ({ ...prev, status: data.venue.status }));
        toast.success(`Venue ${newStatus}d successfully`);
      } else {
        toast.error(data.error || `Failed to ${newStatus} venue`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5557/venues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const updated = await res.json();
      if (res.ok) {
        setVenue(updated);
        setEditing(false);
        toast.success('Venue updated successfully');
      } else {
        toast.error(updated.error || 'Failed to update venue');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-teal-600 hover:text-teal-800 mb-4 md:mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Venues
      </button>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
              <Building className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {editing ? 'Edit Venue' : venue.name}
            </h1>
          </div>
          <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium ${
            venue.status === 'approved' ? 'bg-green-100 text-green-800' :
            venue.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {venue.status}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
                  <input
                    name="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-gray-500 px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    name="capacity"
                    type="number"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full text-gray-500 px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  name="address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-gray-500 px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    name="city"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-gray-500 px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    name="state"
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-gray-500 px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    name="zip_code"
                    value={formData.zip_code || ''}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    className="w-full text-gray-500 px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <button
                  onClick={() => setEditing(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Building className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Venue Name</h3>
                      <p className="text-gray-900 font-medium">{venue.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="text-gray-900">{venue.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Home className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="text-gray-900">{venue.city}, {venue.state} {venue.zip_code}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Users className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                      <p className="text-gray-900">{venue.capacity ? venue.capacity.toLocaleString() : 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <div className="w-5 h-5 flex items-center justify-center text-teal-600">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          venue.status === 'approved' ? 'bg-green-500' :
                          venue.status === 'rejected' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <p className="text-gray-900 capitalize">{venue.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center justify-center gap-2 text-teal-600 hover:text-teal-800 font-medium px-4 py-2 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Venue
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center justify-center gap-2 text-red-600 hover:text-red-800 font-medium px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Delete Venue
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {(venue.status === 'pending' || venue.status === 'rejected') && (
                      <button
                        onClick={() => handleStatusChange('approve')}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                    )}
                    {(venue.status === 'pending' || venue.status === 'approved') && (
                      <button
                        onClick={() => handleStatusChange('reject')}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Delete Venue</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete <strong>{venue.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-70"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}