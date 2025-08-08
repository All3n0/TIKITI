'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Globe,
  Mail,
  Award,
  Image,
  X,
  Check,
  Loader2
} from 'lucide-react';

export default function SponsorDetailsPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [sponsor, setSponsor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

useEffect(() => {
  const fetchSponsor = async () => {
    try {
      const token = localStorage.getItem('managementToken');
      if (!token) {
        router.push('/management/login');
        return;
      }

      const res = await fetch(`https://servertikiti-production.up.railway.app/sponsors/${id}`, {
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
        throw new Error('Failed to fetch sponsor');
      }

      const data = await res.json();
      setSponsor(data);
      setFormData(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load sponsor details');
    }
  };
  fetchSponsor();
}, [id]);

const handleUpdate = async () => {
  setIsSubmitting(true);
  try {
    const token = localStorage.getItem('managementToken');
    if (!token) {
      router.push('/management/login');
      return;
    }

    const res = await fetch(`https://servertikiti-production.up.railway.app/sponsors/${id}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('managementToken');
        router.push('/management/login');
      }
      const errorData = await res.json();
      throw new Error(errorData.error || 'Update failed');
    }

    const updated = await res.json();
    toast.success('Sponsor updated successfully');
    setSponsor(updated);
    setEditing(false);
  } catch (err) {
    console.error(err);
    toast.error(err.message || 'Server error');
  } finally {
    setIsSubmitting(false);
  }
};

const handleDelete = async () => {
  setIsSubmitting(true);
  try {
    const token = localStorage.getItem('managementToken');
    if (!token) {
      router.push('/management/login');
      return;
    }

    const res = await fetch(`https://servertikiti-production.up.railway.app/sponsors/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      localStorage.removeItem('managementToken');
      router.push('/management/login');
      return;
    }

    if (res.status === 204) {
      toast.success('Sponsor deleted successfully');
      router.push('/management/sponsors');
    } else {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to delete');
    }
  } catch (err) {
    console.error(err);
    toast.error(err.message || 'Server error');
  } finally {
    setIsSubmitting(false);
    setShowDeleteModal(false);
  }
};

  if (!sponsor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to sponsors</span>
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Header section */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {editing ? 'Edit Sponsor' : sponsor.name}
            </h1>
            
            {!editing && (
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-teal-100 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content section */}
        <div className="p-6">
          {editing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-teal-600 font-semibold">Sponsor Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-teal-600 outline-none text-gray-600 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-teal-600 font-semibold">Sponsorship Level</label>
                  <input
                    type="text"
                    value={formData.sponsorship_level || ''}
                    onChange={(e) => setFormData({ ...formData, sponsorship_level: e.target.value })}
                    className="w-full border border-teal-600 outline-none text-gray-600 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-teal-600 font-semibold">Website</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="pl-10 w-full border border-teal-600 outline-none text-gray-600 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-teal-600 font-semibold">Contact Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </div>
                    <input
                      type="email"
                      value={formData.contact_email || ''}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      className="pl-10 w-full border border-teal-600 outline-none text-gray-600 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-medium text-teal-600 font-semibold">Logo URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Image className="h-5 w-5 text-gray-600" />
                    </div>
                    <input
                      type="text"
                      value={formData.logo || ''}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="pl-10 w-full border border-teal-600 outline-none text-gray-600 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
              
              {formData.logo && (
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-4 rounded-lg inline-block">
                    <img 
                      src={formData.logo} 
                      alt="Sponsor logo preview" 
                      className="h-20 object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Logo+Not+Found';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {sponsor.logo && (
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <img 
                      src={sponsor.logo} 
                      alt={`${sponsor.name} logo`} 
                      className="h-32 object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=Logo+Not+Found';
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Website</h3>
                      <p className="mt-1 text-gray-900">
                        {sponsor.website ? (
                          <a 
                            href={sponsor.website.startsWith('http') ? sponsor.website : `https://${sponsor.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:underline"
                          >
                            {sponsor.website}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
                      <p className="mt-1 text-gray-900">
                        {sponsor.contact_email ? (
                          <a 
                            href={`mailto:${sponsor.contact_email}`} 
                            className="text-teal-600 hover:underline"
                          >
                            {sponsor.contact_email}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Sponsorship Level</h3>
                      <p className="mt-1 text-gray-900">
                        {sponsor.sponsorship_level || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Delete Sponsor</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-medium">{sponsor.name}</span>? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Sponsor
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}