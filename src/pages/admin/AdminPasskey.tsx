import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shield, KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';

export default function AdminPasskey() {
  const { session, profile, verifyPasskey } = useAdminAuth();
  const navigate = useNavigate();
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!session || !profile) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: verifyError } = await verifyPasskey(passkey);
    if (verifyError) {
      setError(verifyError);
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-5 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-gold mx-auto flex items-center justify-center mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="font-serif text-3xl text-ivory">Two-Step Verification</h1>
          <p className="text-sm text-ivory/50 mt-2 uppercase tracking-[0.15em]">
            Welcome, {profile.full_name}
          </p>
        </div>

        <div className="glass rounded-2xl p-6 mb-6">
          <p className="text-sm text-ivory/60 text-center">
            For your security, please enter your security passkey to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          <div>
            <label className="label-luxury">Security Passkey</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
              <input
                type="text"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                className="input-luxury pl-11 tracking-[0.3em]"
                placeholder="••••••••"
                autoFocus
                required
              />
            </div>
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>
          )}
          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : 'Verify & Continue'}
          </button>
        </form>

        <button
          onClick={() => navigate('/admin/login')}
          className="flex items-center gap-2 text-sm text-ivory/40 hover:text-ivory/70 mx-auto mt-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Login
        </button>

        <p className="text-center text-xs text-ivory/30 mt-4">
          Future support for OTP and Authenticator Apps is planned.
        </p>
      </div>
    </div>
  );
}
