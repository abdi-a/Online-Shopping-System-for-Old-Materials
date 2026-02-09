'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import DashboardLayout from '@/components/DashboardLayout';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/user');
      setUser(res.data);
      setFormData({
        name: res.data.name || '',
        email: res.data.email || '',
      });
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Note: You'll need to create an update endpoint in the backend
      alert('Profile update functionality coming soon!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role={user?.role || 'buyer'}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={user?.role || 'buyer'}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
              <p className="text-slate-600 mt-1">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
              <p className="text-sm text-slate-600 mt-1">Update your account profile information</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                  <input 
                    type="text"
                    value={user?.role || ''}
                    disabled
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Your role cannot be changed</p>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-xl font-bold text-slate-900">Account Information</h2>
              <p className="text-sm text-slate-600 mt-1">View your account details</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Account ID</span>
                  <span className="text-sm text-slate-900">#{user?.id}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Member Since</span>
                  <span className="text-sm text-slate-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-slate-700">Account Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-red-200">
            <div className="px-6 py-5 border-b border-red-200 bg-red-50">
              <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
              <p className="text-sm text-red-700 mt-1">Irreversible and destructive actions</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Delete Account</h3>
                  <p className="text-sm text-slate-600 mt-1">Permanently delete your account and all associated data</p>
                </div>
                <button 
                  onClick={() => alert('Account deletion functionality coming soon!')}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
