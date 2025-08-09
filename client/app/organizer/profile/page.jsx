'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, Edit, ArrowLeft, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function OrganizerProfilePage() {
  const [organizer, setOrganizer] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch organizer data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      console.log('Fetching organizer profile with token:', token);
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        setIsLoading(true);
        
        // Get user session first
        const sessionRes = await axios.get(
          'https://servertikiti-production.up.railway.app/auth/session',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const session = sessionRes.data?.user;
        console.log('Session data:', session);
        if (!session) {
          throw new Error('Invalid session');
        }

        setUserSession(session);
        console.log('User session:', session);
        // Verify organizer role
        if (session.role !== 'organizer') {
          console.log('Only organizers can access this page');
          router.push('/profile');
          return;
        }

        // Fetch organizer profile
        const profileRes = await axios.get(
          `https://servertikiti-production.up.railway.app/organizers/user/${session.id}/profile`,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        console.log('Organizer profile data:', profileRes.data);
        setOrganizer(profileRes.data);
        setFormData(profileRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
        
        if (err.response?.status === 401) {
          toast.error('Session expired, please login again');
          localStorage.removeItem('authToken');
          router.push('/login');
        } else if (err.response?.status === 403) {
          toast.error('You are not authorized to view this page');
          router.push('/profile');
        } else if (err.response?.status === 404) {
          // Initialize empty form if no profile exists
          setOrganizer({
            name: '',
            phone: '',
            logo: '',
            website: '',
            description: '',
            speciality: '',
            contact_email: userSession?.email || ''
          });
          setFormData({
            name: '',
            phone: '',
            logo: '',
            website: '',
            description: '',
            speciality: '',
            contact_email: userSession?.email || ''
          });
          setEditMode(true); // Automatically open edit mode for new organizers
        } else {
          toast.error(err.response?.data?.error || 'Failed to load organizer profile');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Organization name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }
    
    // Contact email validation
    if (formData.contact_email && !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email';
    }
    
    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Website validation
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL (include http:// or https://)';
    }
    
    // Logo validation
    if (formData.logo && !/^https?:\/\/.+/.test(formData.logo)) {
      newErrors.logo = 'Please enter a valid URL (include http:// or https://)';
    }
    
    // Speciality validation
    if (formData.speciality && formData.speciality.length > 100) {
      newErrors.speciality = 'Speciality cannot exceed 100 characters';
    }
    
    // Description validation
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await axios.patch(
        'https://servertikiti-production.up.railway.app/organizer/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setOrganizer(response.data.organizer || response.data);
      setEditMode(false);
      toast.success(response.data.message || 'Profile updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      
      if (err.response?.data?.details) {
        // Handle backend validation errors
        setErrors(err.response.data.details);
        toast.error('Please fix the validation errors');
      } else {
        toast.error(err.response?.data?.error || 'Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (isLoading && !organizer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // If no organizer profile exists but we have session (new organizer)
  if (userSession?.role === 'organizer' && !organizer?.id && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Your Organizer Profile</h1>
          {renderEditForm()}
        </div>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Organizer Profile Not Found</h2>
          <p className="text-gray-600 mb-4">
            {userSession?.role === 'organizer' 
              ? "We couldn't load your organizer profile." 
              : "You need to be an organizer to access this page."}
          </p>
          <button
            onClick={() => router.push(userSession?.role === 'organizer' ? '/organizer/dashboard' : '/profile')}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Go to {userSession?.role === 'organizer' ? 'Dashboard' : 'Profile'}
          </button>
        </div>
      </div>
    );
  }

  function renderEditForm() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { field: 'name', label: 'Organization Name', required: true, type: 'text' },
            { field: 'phone', label: 'Phone', required: true, type: 'tel' },
            { field: 'contact_email', label: 'Contact Email', required: false, type: 'email' },
            { field: 'website', label: 'Website', required: false, type: 'url' },
            { field: 'logo', label: 'Logo URL', required: false, type: 'url' },
            { field: 'speciality', label: 'Speciality', required: false, type: 'text' },
          ].map(({ field, label, required, type }) => (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                name={field}
                type={type}
                value={formData[field] || ''}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${errors[field] ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
                required={required}
              />
              {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>}
            </div>
          ))}
          
          <div className="col-span-full space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-4 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500`}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {formData.description?.length || 0}/2000 characters
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => editMode ? setEditMode(false) : router.back()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  function renderProfileView() {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {organizer.logo ? (
            <img 
              src={organizer.logo} 
              alt={organizer.name}
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
          ) : (
            <div className="w-24 h-24 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-600">
                {organizer.name?.charAt(0) || 'O'}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{organizer.name}</h2>
            {organizer.speciality && (
              <p className="text-gray-600 text-base mt-1">{organizer.speciality}</p>
            )}
            {organizer.description && (
              <p className="text-gray-500 text-sm mt-2 whitespace-pre-line">{organizer.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <a href={`mailto:${organizer.contact_email || userSession?.email}`} className="text-base text-gray-800 hover:text-amber-600 hover:underline">
                  {organizer.contact_email || userSession?.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <a href={`tel:${organizer.phone}`} className="text-base text-gray-800 hover:text-amber-600 hover:underline">
                  {organizer.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {organizer.website && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Website</h3>
                  <a
                    href={organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-gray-800 hover:text-amber-600 hover:underline"
                  >
                    {organizer.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Edit className="w-5 h-5" />
            Edit Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b border-amber-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="p-2 rounded-full hover:bg-amber-200 text-amber-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              {editMode ? 'Edit Profile' : 'Organizer Profile'}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-50 border border-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {editMode ? renderEditForm() : renderProfileView()}
        </div>
      </div>
    </div>
  );
}