'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

/**
 * OrganizerProfile component
 * - Uses /auth/session (GET) to get session user (token from localStorage.authToken)
 * - Uses /organizer/details (GET) to fetch organizer data (matched by user.email)
 * - Uses /organizer/details (PUT) to update organizer data
 *
 * Notes:
 * - Backend expected to accept JSON body for PUT.
 * - For logo we accept a URL (recommended). We also allow selecting a file and convert to base64
 *   and send it as the `logo` field (backend must handle base64 if you want to support uploads).
 */

export default function OrganizerProfile() {
  const router = useRouter();

  const [hasConsent, setHasConsent] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [organizer, setOrganizer] = useState(null); // server copy
  const [form, setForm] = useState(null); // editable copy
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const logoFileRef = useRef(null);
  const [logoFile, setLogoFile] = useState(null);

  // ----------------------
  // Cookie consent + session check (your pattern)
  // ----------------------
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setHasConsent(true);
      checkSession(); // 🔐 Check session if consent already given
    } else {
      // still attempt session check — optional
      checkSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Get token from storage

      if (!token) {
        console.warn('No token found');
        setSessionChecked(true);
        router.push('/login');
        return;
      }

      const res = await fetch('https://servertikiti-production.up.railway.app/auth/session', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Invalid or expired token');
      }

      const data = await res.json();
      // console.log('Session user:', data);
      setSessionUser(data.user);

      if (data.user?.role !== 'organizer') {
        toast.error('Access denied — organizer role required');
        router.push('/');
        return;
      }

      // fetch organizer details
      await fetchOrganizerDetails(token);
    } catch (err) {
      console.warn('Session check failed', err);
      toast.error('Session invalid — please login again');
      localStorage.removeItem('authToken');
      router.push('/login');
    } finally {
      setSessionChecked(true);
    }
  };

  // ----------------------
  // Fetch organizer details
  // ----------------------
  async function fetchOrganizerDetails(token) {
    setLoading(true);
    try {
      const res = await fetch('https://servertikiti-production.up.railway.app/organizer/details', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to fetch organizer details');
      }

      const data = await res.json();
      const org = data.organizer || data; // some APIs return organizer directly
      setOrganizer(org);

      // create editable copy
      setForm({
        // ensure all fields appear; fallback to empty string if missing
        id: org.id ?? '',
        name: org.name ?? '',
        email: org.email ?? '',
        phone: org.phone ?? '',
        logo: org.logo ?? '',
        website: org.website ?? '',
        description: org.description ?? '',
        speciality: org.speciality ?? '',
        contact_email: org.contact_email ?? '',
        created_at: org.created_at ?? '',
        rating: org.rating ?? 0.0,
        // include any extra keys if present
        ...Object.keys(org).reduce((acc, k) => {
          if (!acc[k]) acc[k] = org[k];
          return acc;
        }, {}),
      });

      // logo preview
      setLogoPreview(org.logo ?? null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Could not load organizer profile');
    } finally {
      setLoading(false);
    }
  }

  // ----------------------
  // Input handlers
  // ----------------------
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // preview
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
      // store file as dataURL (base64) to send in JSON if backend supports it
      setLogoFile({ file, dataUrl: reader.result });
      setForm((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // ----------------------
  // Validation
  // ----------------------
  const isValidEmail = (v) =>
    typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isValidURL = (v) =>
    !v || // allow empty
    /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[^\s]*)?$/.test(v.trim());
  const isValidPhone = (v) =>
    typeof v === 'string' && /^[0-9+\-\s()]{6,20}$/.test(v.trim());

  function validateForm(values) {
    const e = {};
    if (!values.name || !values.name.trim()) e.name = 'Name is required';
    else if (values.name.length > 100) e.name = 'Name must be <= 100 chars';

    if (!values.phone || !values.phone.trim()) e.phone = 'Phone is required';
    else if (!isValidPhone(values.phone)) e.phone = 'Invalid phone number';

    if (!values.contact_email || !values.contact_email.trim()) {
      e.contact_email = 'Contact email is required';
    } else if (!isValidEmail(values.contact_email)) {
      e.contact_email = 'Invalid email address';
    }

    if (values.website && !isValidURL(values.website)) e.website = 'Invalid URL';
    if (values.speciality && values.speciality.length > 100)
      e.speciality = 'Speciality must be <= 100 chars';
    if (values.description && values.description.length > 2000)
      e.description = 'Description is too long (max 2000 chars)';

    return e;
  }

  // ----------------------
  // Save handler
  // ----------------------
  const handleSave = async () => {
    setErrors({});
    if (!form) return;

    const validation = validateForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      toast.error('Please fix the form errors before saving');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Missing auth token');

      // Prepare JSON payload. We do not include read-only fields like id, created_at or rating in updates
      // but include them if you want — server should ignore unknown/read-only keys.
      const payload = {
        name: form.name,
        phone: form.phone,
        contact_email: form.contact_email,
        website: form.website,
        speciality: form.speciality,
        description: form.description,
        logo: form.logo, // could be URL or dataURL (base64) if backend accepts it
        // include any other editable fields if needed
      };

      const res = await fetch('https://servertikiti-production.up.railway.app/organizer/details', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to update organizer');
      }

      const data = await res.json();
      const updated = data.organizer ?? form;

      setOrganizer(updated);
      setForm((prev) => ({ ...prev, ...updated }));
      setEditMode(false);
      setLogoFile(null);
      toast.success('Profile updated');
    } catch (err) {
      console.error('Save error', err);
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(organizer ? { ...organizer } : null);
    setEditMode(false);
    setErrors({});
    setLogoFile(null);
    setLogoPreview(organizer?.logo ?? null);
    if (logoFileRef.current) logoFileRef.current.value = '';
  };

  // ----------------------
  // Render
  // ----------------------
  if (!sessionChecked || loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-amber-700">Loading organizer profile…</div>
      </div>
    );
  }

  if (!organizer || !form) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-amber-700">Organizer profile not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-amber-50 rounded-lg shadow-md mt-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-800">Organizer profile</h1>
          <p className="text-amber-600 mt-1">
            Manage your organizer details. Fields marked <span className="font-bold">*</span> are required.
          </p>
        </div>

        <div className="space-x-2">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-md hover:bg-amber-800 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center gap-2 border border-amber-300 text-amber-800 px-4 py-2 rounded-md hover:bg-amber-100 disabled:opacity-60"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          {/* ID (read-only) */}
          <div>
            <label className="block text-sm font-medium text-amber-800">ID</label>
            <input
              type="text"
              value={form.id ?? ''}
              readOnly
              className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-amber-700 bg-amber-100"
            />
          </div>

          {/* Username / Organizer name */}
          <div>
            <label className="block text-sm font-medium text-amber-800">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={form.name ?? ''}
              onChange={handleChange('name')}
              disabled={!editMode}
              className={`mt-1 block w-full rounded-md border py-2 px-3 focus:ring-2 ${
                errors.name ? 'border-red-400 focus:ring-red-300' : 'border-amber-300 focus:ring-amber-300'
              }`}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-amber-800">Account email</label>
            <input
              type="email"
              value={form.email ?? ''}
              readOnly
              className="mt-1 block w-full rounded-md border-0 py-2 px-3 bg-amber-100 text-amber-700"
            />
            <p className="text-xs text-amber-600 mt-1">This is the account email (read-only).</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-amber-800">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              value={form.phone ?? ''}
              onChange={handleChange('phone')}
              disabled={!editMode}
              className={`mt-1 block w-full rounded-md border py-2 px-3 focus:ring-2 ${
                errors.phone ? 'border-red-400 focus:ring-red-300' : 'border-amber-300 focus:ring-amber-300'
              }`}
            />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>

          {/* Contact email */}
          <div>
            <label className="block text-sm font-medium text-amber-800">
              Contact email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              value={form.contact_email ?? ''}
              onChange={handleChange('contact_email')}
              disabled={!editMode}
              className={`mt-1 block w-full rounded-md border py-2 px-3 focus:ring-2 ${
                errors.contact_email
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-amber-300 focus:ring-amber-300'
              }`}
            />
            {errors.contact_email && <p className="text-sm text-red-600 mt-1">{errors.contact_email}</p>}
          </div>

          {/* Speciality */}
          <div>
            <label className="block text-sm font-medium text-amber-800">Speciality</label>
            <input
              type="text"
              value={form.speciality ?? ''}
              onChange={handleChange('speciality')}
              disabled={!editMode}
              className={`mt-1 block w-full rounded-md border py-2 px-3 focus:ring-2 ${
                errors.speciality ? 'border-red-400 focus:ring-red-300' : 'border-amber-300 focus:ring-amber-300'
              }`}
            />
            {errors.speciality && <p className="text-sm text-red-600 mt-1">{errors.speciality}</p>}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-amber-800">Website</label>
            <input
              type="url"
              value={form.website ?? ''}
              onChange={handleChange('website')}
              disabled={!editMode}
              placeholder="https://your-site.com"
              className={`mt-1 block w-full rounded-md border py-2 px-3 focus:ring-2 ${
                errors.website ? 'border-red-400 focus:ring-red-300' : 'border-amber-300 focus:ring-amber-300'
              }`}
            />
            {errors.website && <p className="text-sm text-red-600 mt-1">{errors.website}</p>}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Logo (preview + URL + file) */}
          <div>
            <label className="block text-sm font-medium text-amber-800">Logo / Image</label>

            <div className="mt-2 flex items-start gap-4">
              <div className="w-28 h-28 bg-amber-100 rounded-md flex items-center justify-center overflow-hidden border border-amber-200">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoPreview} alt="logo preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-amber-500 text-sm">No logo</div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="url"
                  value={form.logo ?? ''}
                  onChange={(e) => {
                    handleChange('logo')(e);
                    setLogoPreview(e.target.value || null);
                    setLogoFile(null);
                    if (logoFileRef.current) logoFileRef.current.value = '';
                  }}
                  disabled={!editMode}
                  placeholder="Enter image URL or choose a file"
                  className="block w-full rounded-md border py-2 px-3 focus:ring-2 border-amber-300 focus:ring-amber-300"
                />

                <div className="mt-2 flex items-center gap-3">
                  <label className={`inline-flex items-center gap-2 text-sm ${editMode ? 'text-amber-700' : 'text-amber-400'}`}>
                    <input
                      ref={logoFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={!editMode}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => logoFileRef.current?.click()}
                      disabled={!editMode}
                      className="text-amber-600 underline text-sm"
                    >
                      Choose file
                    </button>
                    <span className="text-xs text-amber-500"> (or paste a public image URL above)</span>
                  </label>
                </div>

                <p className="text-xs text-amber-500 mt-2">
                  Tip: prefer using a hosted image URL. If you choose a file we'll convert it to a data URL and include it in the request.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-amber-800">Description</label>
            <textarea
              value={form.description ?? ''}
              onChange={handleChange('description')}
              disabled={!editMode}
              rows={6}
              className={`mt-1 block w-full rounded-md border py-2 px-3 focus:ring-2 ${
                errors.description ? 'border-red-400 focus:ring-red-300' : 'border-amber-300 focus:ring-amber-300'
              }`}
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Read-only created_at and rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-800">Created at</label>
              <input
                readOnly
                value={form.created_at ? new Date(form.created_at).toLocaleString() : ''}
                className="mt-1 block w-full rounded-md border-0 py-2 px-3 bg-amber-100 text-amber-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800">Rating</label>
              <input
                readOnly
                value={String(form.rating ?? '0.0')}
                className="mt-1 block w-full rounded-md border-0 py-2 px-3 bg-amber-100 text-amber-700"
              />
            </div>
          </div>

          {/* Any additional fields found on the organizer object (display-only) */}
          {Object.entries(organizer)
            .filter(([k]) => !['id','name','email','phone','logo','website','description','speciality','contact_email','created_at','rating'].includes(k))
            .map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-amber-800">{key.replace('_', ' ')}</label>
                <pre className="mt-1 rounded-md bg-amber-100 p-2 text-xs text-amber-700 overflow-auto">{JSON.stringify(value, null, 2)}</pre>
              </div>
            ))}
        </div>
      </div>

      {/* Footer actions for small screens */}
      <div className="mt-6 flex justify-end gap-3">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded-md"
          >
            Edit profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-amber-700 text-white px-4 py-2 rounded-md disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button onClick={handleCancel} className="border border-amber-300 px-4 py-2 rounded-md text-amber-800">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
