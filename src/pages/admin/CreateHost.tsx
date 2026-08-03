import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2, Shield, Phone, Mail, Lock } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import type { AdminRole } from '@/lib/admin-types';

const ROLES: { value: AdminRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'reception', label: 'Reception' },
];

export default function CreateHost() {
  const { session, profile, passkeyVerified, isSuperAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    role: 'reception' as AdminRole,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!session || !profile || !passkeyVerified) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal px-5">
        <div className="text-center max-w-md">
          <Shield size={48} className="text-red-400 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-ivory mb-2">Access Denied</h1>
          <p className="text-ivory/50">Only Super Admins can create new host accounts.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const token = currentSession?.access_token;
      if (!token) {
        setError('Session expired. Please login again.');
        return;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-host`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
          is_active: form.is_active,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to create host account');
        return;
      }

      setSuccess(`Host account created for ${form.full_name}. Default passkey is "dara2024".`);
      setForm({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
        role: 'reception',
        is_active: true,
      });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal px-5 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-ivory/50 hover:text-ivory text-sm mb-6 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-gold mx-auto flex items-center justify-center mb-4">
            <UserPlus size={28} className="text-white" />
          </div>
          <h1 className="font-serif text-3xl text-ivory">Create Host Account</h1>
          <p className="text-sm text-ivory/50 mt-2 uppercase tracking-[0.15em]">
            Add a new admin or staff member
          </p>
        </div>

        {success && (
          <div className="bg-olive-100/20 border border-olive-400/30 text-olive-300 text-sm p-4 rounded-xl mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-400 text-sm p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          <div>
            <label className="label-luxury">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="input-luxury"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-luxury pl-11"
                  placeholder="staff@thedarajaisalmer.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label-luxury">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-luxury pl-11"
                  placeholder="+91 90000 00000"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-luxury pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label-luxury">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                <input
                  type="password"
                  value={form.confirm_password}
                  onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                  className="input-luxury pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="label-luxury">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
              className="input-luxury"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-charcoal/20 text-gold-500 focus:ring-gold-400"
            />
            <span className="text-sm text-charcoal/60">Active (can login)</span>
          </label>

          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Creating Account...</> : 'Create Host Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
