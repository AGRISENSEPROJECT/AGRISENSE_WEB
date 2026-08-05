import DashboardLayout from "./DashboardLayout"
import { useCallback, useEffect, useState } from 'react';
import { Loader2, Trash2, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UserAvatar } from '@/components/UserAvatar';
import {
  ApiError,
  authService,
  farmService,
  type CreateFarmDto,
  type Farm,
  type SoilType,
} from '@/api';
import { useAuth } from '@/context/useAuth';
import {
  sanitizeSingleLine,
  validateEmail,
  validatePassword,
  validatePhone,
  validateUsername,
} from '@/lib/validation';
import { routes } from '@/lib/routes';

const SOIL_TYPES: SoilType[] = ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB per API docs
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const emptyFarm: CreateFarmDto = {
  name: '',
  size: 0,
  soilType: 'loamy',
  country: 'Rwanda',
  province: '',
  district: '',
  sector: '',
  cell: '',
  village: '',
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
};

type TabId = 'profile' | 'security' | 'farms';

const Settings = () => {
  const { user, refreshProfile } = useAuth();
  const location = useLocation();
  const planFromPricing = (location.state as { plan?: string } | null)?.plan;
  const [tab, setTab] = useState<TabId>('profile');

  useEffect(() => {
    document.title = 'Settings | AGRISENSE';
  }, []);

  return (
    <DashboardLayout>
        <div className="p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-[#0B6E4F]">Settings</h1>

          {planFromPricing === 'pro' && (
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
              Looking for Pro?{" "}
              <Link
                to={routes.app.subscription}
                state={{ plan: 'pro' }}
                className="font-semibold text-[#2C6E49] hover:underline"
              >
                Open subscription &amp; payment
              </Link>
            </div>
          )}

          <div className="flex gap-2 border-b overflow-x-auto">
            {(['profile', 'security', 'farms'] as TabId[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`shrink-0 px-4 py-2 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
                  tab === t
                    ? 'border-[#2C6E49] text-[#2C6E49]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'farms' ? 'Farm Management' : t}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <ProfileSection user={user} refreshProfile={refreshProfile} />
          )}
          {tab === 'security' && <SecuritySection />}
          {tab === 'farms' && <FarmsSection />}
        </div>
      </DashboardLayout>
  );
};

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

function ProfileSection({
  user,
  refreshProfile,
}: {
  user: ReturnType<typeof useAuth>['user'];
  refreshProfile: () => Promise<void>;
}) {
  const [username, setUsername] = useState(user?.username || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsername(user?.username || '');
    setPhoneNumber(user?.phoneNumber || '');
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const usernameCheck = validateUsername(username);
    if (!usernameCheck.valid) {
      setError(usernameCheck.message || 'Invalid username.');
      return;
    }
    const phoneCheck = validatePhone(phoneNumber);
    if (!phoneCheck.valid) {
      setError(phoneCheck.message || 'Invalid phone number.');
      return;
    }

    setSaving(true);
    try {
      await authService.updateProfile({
        username: sanitizeSingleLine(username),
        phoneNumber: phoneNumber.trim(),
      });
      await refreshProfile();
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setMessage(null);
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG or WebP images are allowed.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be 5MB or smaller.');
      return;
    }

    setUploading(true);
    try {
      await authService.uploadProfileImage(file);
      await refreshProfile();
      setMessage('Profile image updated.');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white border rounded-lg shadow-sm p-6 space-y-5">
      {message && <Banner type="success">{message}</Banner>}
      {error && <Banner type="error">{error}</Banner>}

      <div className="flex items-center gap-4">
        <UserAvatar
          src={user?.profileImage}
          alt="Avatar"
          sizeClassName="h-16 w-16"
          iconClassName="h-8 w-8"
        />
        <label className="text-sm font-semibold text-[#2C6E49] cursor-pointer hover:underline">
          {uploading ? 'Uploading…' : 'Change photo'}
          <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </label>
      </div>

      <Field label="Email">
        <input
          value={user?.email || ''}
          disabled
          className="w-full h-11 border border-gray-200 rounded-md px-3 bg-gray-50 text-gray-500"
        />
      </Field>

      <Field label="Username">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49]"
        />
      </Field>

      <Field label="Phone Number">
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+250788123456"
          className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49]"
        />
      </Field>

      <button
        type="submit"
        disabled={saving}
        className="bg-[#2C6E49] hover:bg-[#23583a] text-white font-semibold text-sm px-6 py-2.5 rounded-md transition-colors disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Security
// ---------------------------------------------------------------------------

function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!currentPassword) {
      setError('Enter your current password.');
      return;
    }
    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.valid) {
      setError(pwCheck.message || 'Weak password.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from the current one.');
      return;
    }
    setSaving(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm p-6 space-y-5 max-w-lg">
      {message && <Banner type="success">{message}</Banner>}
      {error && <Banner type="error">{error}</Banner>}

      <Field label="Current Password">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49]"
          required
        />
      </Field>

      <Field label="New Password">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49]"
          required
        />
      </Field>

      <button
        type="submit"
        disabled={saving}
        className="bg-[#2C6E49] hover:bg-[#23583a] text-white font-semibold text-sm px-6 py-2.5 rounded-md transition-colors disabled:opacity-60"
      >
        {saving ? 'Updating…' : 'Change password'}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Farm management
// ---------------------------------------------------------------------------

function FarmsSection() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateFarmDto>(emptyFarm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await farmService.getAll();
      setFarms(res.farms || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load farms.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = <K extends keyof CreateFarmDto>(key: K, value: CreateFarmDto[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailCheck = validateEmail(form.ownerEmail);
    if (!emailCheck.valid) {
      setError(`Owner email: ${emailCheck.message}`);
      return;
    }
    const phoneCheck = validatePhone(form.ownerPhone || '');
    if (!phoneCheck.valid) {
      setError(`Owner phone: ${phoneCheck.message}`);
      return;
    }
    if (!(Number(form.size) > 0)) {
      setError('Farm size must be greater than zero.');
      return;
    }

    setSaving(true);
    try {
      await farmService.create({
        ...form,
        name: sanitizeSingleLine(form.name),
        ownerName: sanitizeSingleLine(form.ownerName),
        size: Number(form.size),
        ownerEmail: form.ownerEmail.trim(),
        ownerPhone: form.ownerPhone?.trim() || undefined,
      });
      setForm(emptyFarm);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create farm.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (farmId: string) => {
    if (!confirm('Delete this farm? This cannot be undone.')) return;
    try {
      await farmService.remove(farmId);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete farm.');
    }
  };

  return (
    <div className="space-y-4">
      {error && <Banner type="error">{error}</Banner>}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Your Farms</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 bg-[#2C6E49] hover:bg-[#23583a] text-white font-semibold text-sm px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" /> {showForm ? 'Close' : 'Add Farm'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Farm name">
            <TextInput value={form.name} onChange={(v) => updateField('name', v)} required />
          </Field>
          <Field label="Size (acres)">
            <input
              type="number"
              step="0.1"
              value={form.size}
              onChange={(e) => updateField('size', Number(e.target.value))}
              className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49]"
              required
            />
          </Field>
          <Field label="Soil type">
            <select
              value={form.soilType}
              onChange={(e) => updateField('soilType', e.target.value as SoilType)}
              className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49] capitalize"
            >
              {SOIL_TYPES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Country">
            <TextInput value={form.country} onChange={(v) => updateField('country', v)} required />
          </Field>
          <Field label="Province">
            <TextInput value={form.province} onChange={(v) => updateField('province', v)} required />
          </Field>
          <Field label="District">
            <TextInput value={form.district} onChange={(v) => updateField('district', v)} required />
          </Field>
          <Field label="Sector">
            <TextInput value={form.sector} onChange={(v) => updateField('sector', v)} required />
          </Field>
          <Field label="Cell">
            <TextInput value={form.cell} onChange={(v) => updateField('cell', v)} required />
          </Field>
          <Field label="Village">
            <TextInput value={form.village} onChange={(v) => updateField('village', v)} required />
          </Field>
          <Field label="Owner name">
            <TextInput value={form.ownerName} onChange={(v) => updateField('ownerName', v)} required />
          </Field>
          <Field label="Owner email">
            <input
              type="email"
              value={form.ownerEmail}
              onChange={(e) => updateField('ownerEmail', e.target.value)}
              className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49]"
              required
            />
          </Field>
          <Field label="Owner phone">
            <TextInput value={form.ownerPhone || ''} onChange={(v) => updateField('ownerPhone', v)} />
          </Field>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#2C6E49] hover:bg-[#23583a] text-white font-semibold text-sm px-6 py-2.5 rounded-md transition-colors disabled:opacity-60"
            >
              {saving ? 'Creating…' : 'Create farm'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-7 w-7 animate-spin text-[#2C6E49]" />
        </div>
      ) : farms.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No farms yet. Add your first farm.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farms.map((farm) => (
            <div key={farm.id} className="bg-white border rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{farm.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {farm.soilType} soil · {farm.size} acres
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(farm.id)}
                  className="text-gray-400 hover:text-red-500"
                  title="Delete farm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {[farm.village, farm.cell, farm.sector, farm.district, farm.province, farm.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700 block">{label}</label>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full h-11 border border-gray-300 rounded-md px-3 outline-none focus:border-[#2C6E49]"
    />
  );
}

function Banner({ type, children }: { type: 'success' | 'error'; children: React.ReactNode }) {
  const styles =
    type === 'success'
      ? 'bg-green-50 border-green-200 text-green-700'
      : 'bg-red-50 border-red-200 text-red-700';
  return <div className={`rounded-md border text-sm px-4 py-3 ${styles}`}>{children}</div>;
}

export default Settings;
