'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, Edit, ArrowLeft, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function OrganizerProfilePage() {
  const [organizer, setOrganizer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        const res = await axios.get('https://servertikiti-production.up.railway.app/organizer/profile', {
          withCredentials: true,
        });
        setOrganizer(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error('Failed to fetch organizer profile', err);
        toast.error('Failed to load profile');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizer();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (formData.logo && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.logo)) {
      newErrors.logo = 'Enter a valid image URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://servertikiti-production.up.railway.app/auth/logout', {}, {
        withCredentials: true,
      });
      toast.success('Logged out successfully');
      router.push('/');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      const res = await axios.patch('https://servertikiti-production.up.railway.app/organizer/profile', formData, {
        withCredentials: true,
      });
      setOrganizer(res.data);
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Update failed', err);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = (e) => {
    if (e.target.name === 'phone' && e.target.value === organizer.phone) {
      e.target.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-amber-200 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => router.back()} 
              className="p-1 sm:p-2 rounded-full hover:bg-amber-200 text-amber-700"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {editMode ? 'Edit Profile' : 'Organizer Profile'}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-50 border border-red-100 transition-colors text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {editMode ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { field: 'name', label: 'Organization Name', required: true },
                  { field: 'email', label: 'Email', required: true },
                  { field: 'phone', label: 'Phone', required: true },
                  { field: 'website', label: 'Website' },
                  { field: 'logo', label: 'Logo URL' },
                  { field: 'speciality', label: 'Speciality' },
                  { field: 'contact_email', label: 'Contact Email' },
                ].map(({ field, label, required }) => (
                  <div key={field} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      name={field}
                      type={field === 'email' ? 'email' : 'text'}
                      defaultValue={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      onFocus={field === 'phone' ? handleInputFocus : undefined}
                      className={`w-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base border ${errors[field] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-500 focus:text-gray-800 transition-colors`}
                      required={required}
                    />
                    {errors[field] && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors[field]}</p>}
                  </div>
                ))}
                <div className="col-span-full space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    defaultValue={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className={`w-full px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-500 focus:text-gray-800 transition-colors`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                <button
                  onClick={() => setEditMode(false)}
                  disabled={isLoading}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-amber-600 text-white hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {organizer.logo ? (
                  <img 
                    src={organizer.logo} 
                    alt={organizer.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold text-amber-600">{organizer.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">{organizer.name}</h2>
                  {organizer.speciality && (
                    <p className="text-gray-600 text-sm sm:text-base mt-1">{organizer.speciality}</p>
                  )}
                  {organizer.description && (
                    <p className="text-gray-500 text-xs sm:text-sm mt-2">{organizer.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1 sm:p-2 bg-amber-100 rounded-lg text-amber-600">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Email</h3>
                      <a href={`mailto:${organizer.email}`} className="text-sm sm:text-base text-gray-800 hover:text-amber-600 hover:underline">
                        {organizer.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1 sm:p-2 bg-amber-100 rounded-lg text-amber-600">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Phone</h3>
                      <a href={`tel:${organizer.phone}`} className="text-sm sm:text-base text-gray-800 hover:text-amber-600 hover:underline">
                        {organizer.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1 sm:p-2 bg-amber-100 rounded-lg text-amber-600">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Website</h3>
                      {organizer.website ? (
                        <a 
                          href={organizer.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm sm:text-base text-gray-800 hover:text-amber-600 hover:underline"
                        >
                          {organizer.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-400">Not provided</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1 sm:p-2 bg-amber-100 rounded-lg text-amber-600">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Contact Email</h3>
                      {organizer.contact_email ? (
                        <a href={`mailto:${organizer.contact_email}`} className="text-sm sm:text-base text-gray-800 hover:text-amber-600 hover:underline">
                          {organizer.contact_email}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-400">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 sm:pt-6 border-t border-gray-100">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}