import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { AdminProfile, AdminRole } from './admin-types';

interface AdminAuthState {
  session: Session | null;
  profile: AdminProfile | null;
  passkeyVerified: boolean;
  loading: boolean;
}

interface AdminAuthContextType extends AdminAuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  verifyPasskey: (passkey: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  hasRole: (...roles: AdminRole[]) => boolean;
  isSuperAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    session: null,
    profile: null,
    passkeyVerified: false,
    loading: true,
  });
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => {
      supabase.auth.signOut();
      setState({ session: null, profile: null, passkeyVerified: false, loading: false });
    }, SESSION_TIMEOUT_MS);
    setTimeoutId(id);
  }, [timeoutId]);

  const loadProfile = useCallback(async (userId: string): Promise<AdminProfile | null> => {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error || !data) return null;
    return data as AdminProfile;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.session?.user?.id) return;
    const profile = await loadProfile(state.session.user.id);
    setState((s) => ({ ...s, profile }));
  }, [state.session, loadProfile]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        const profile = await loadProfile(session.user.id);
        if (mounted) {
          setState({ session, profile, passkeyVerified: false, loading: false });
        }
      } else {
        if (mounted) setState({ session: null, profile: null, passkeyVerified: false, loading: false });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session) {
          const profile = await loadProfile(session.user.id);
          if (mounted) {
            setState((s) => ({
              session,
              profile,
              passkeyVerified: s.session?.user?.id === session.user.id ? s.passkeyVerified : false,
              loading: false,
            }));
          }
        } else {
          if (mounted) {
            setState({ session: null, profile: null, passkeyVerified: false, loading: false });
          }
        }
      })();
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  useEffect(() => {
    if (state.session && state.passkeyVerified) {
      resetTimeout();
      const events = ['click', 'keydown', 'mousemove', 'touchstart'];
      const handler = () => resetTimeout();
      events.forEach((e) => window.addEventListener(e, handler));
      return () => {
        events.forEach((e) => window.removeEventListener(e, handler));
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [state.session, state.passkeyVerified, resetTimeout, timeoutId]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      const profile = await loadProfile(data.user.id);
      if (!profile) {
        await supabase.auth.signOut();
        return { error: 'You do not have admin access. Contact the Super Admin.' };
      }
      if (!profile.is_active) {
        await supabase.auth.signOut();
        return { error: 'Your account has been deactivated. Contact the Super Admin.' };
      }
      setState({ session: data.session, profile, passkeyVerified: false, loading: false });
    }
    return { error: null };
  }, [loadProfile]);

  const verifyPasskey = useCallback(async (passkey: string) => {
    const { data, error } = await supabase.rpc('verify_admin_passkey', { p_passkey: passkey });
    if (error) return { error: 'Verification failed. Please try again.' };
    if (!data) return { error: 'Incorrect security passkey. Please enter the correct passkey to continue.' };
    setState((s) => ({ ...s, passkeyVerified: true }));
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ session: null, profile: null, passkeyVerified: false, loading: false });
  }, []);

  const hasRole = useCallback((...roles: AdminRole[]) => {
    if (!state.profile) return false;
    return roles.includes(state.profile.role);
  }, [state.profile]);

  return (
    <AdminAuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        verifyPasskey,
        refreshProfile,
        hasRole,
        isSuperAdmin: state.profile?.role === 'super_admin',
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
