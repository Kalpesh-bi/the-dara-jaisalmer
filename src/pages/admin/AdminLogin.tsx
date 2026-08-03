import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const { signIn } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else {
      navigate('/admin/passkey');
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Enter your email address first');
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabaseResetPassword(email);
    if (resetError) {
      setError(resetError);
    } else {
      setForgotSent(true);
      setError('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-5 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="relative h-[64px] w-[64px] rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] ring-1 ring-gold-200/40 mx-auto">
              <img
                src="/Gemini_Generated_Image_686qs5686qs5686q.png"
                alt="The Dara Jaisalmer"
                className="h-full w-full object-cover scale-[1.35]"
              />
            </div>
          </Link>
          <div className="w-14 h-14 rounded-full bg-gradient-gold mx-auto flex items-center justify-center mb-4">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="font-serif text-3xl text-ivory">Admin Login</h1>
          <p className="text-sm text-ivory/50 mt-2 uppercase tracking-[0.15em]">The Dara Jaisalmer Management</p>
        </div>

        {forgotSent ? (
          <div className="glass rounded-2xl p-8 text-center">
            <ShieldCheck size={40} className="text-gold-400 mx-auto mb-4" />
            <p className="text-ivory mb-2">Password reset link sent to your email.</p>
            <p className="text-sm text-ivory/50">Check your inbox and follow the instructions to reset your password.</p>
            <button onClick={() => setForgotSent(false)} className="btn-outline mt-6">Back to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
            <div>
              <label className="label-luxury">Email</label>
              <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-luxury pl-11"
                      placeholder="admin@thedarajaisalmer.com"
                      required
                    />
                  </div>
            </div>
            <div>
              <label className="label-luxury">Password</label>
              <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-luxury pl-11 pr-11"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal/60"
                    >
                      {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-charcoal/20 text-gold-500 focus:ring-gold-400"
                />
                <span className="text-sm text-charcoal/60">Remember Me</span>
              </label>
              <button type="button" onClick={handleForgot} className="text-sm text-gold-600 hover:text-gold-700">
                Forgot Password?
              </button>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>
            )}
            <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing In...</> : 'Login'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-ivory/30 mt-6">
          Authorized personnel only. All access is logged and monitored.
        </p>
      </div>
    </div>
  );

  async function supabaseResetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin/login` });
      return { error: error?.message ?? null };
    } catch {
      return { error: 'Could not send reset email. Please try again.' };
    }
  }
}
