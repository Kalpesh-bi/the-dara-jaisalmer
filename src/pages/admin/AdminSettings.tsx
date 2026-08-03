import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Settings, Phone, Mail, MessageCircle, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/admin-types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (data) setSettings(data as SiteSettings);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    await supabase.from('site_settings').update({
      whatsapp_number: settings.whatsapp_number,
      contact_phone: settings.contact_phone,
      contact_email: settings.contact_email,
      contact_address: settings.contact_address,
      seo_title: settings.seo_title,
      seo_description: settings.seo_description,
      updated_at: new Date().toISOString(),
    }).eq('id', 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal mb-6">Website Management</h1>

      <div className="space-y-6">
        {/* Contact Details */}
        <div className="card-luxury p-6">
          <h3 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
            <Phone size={18} className="text-gold-500" /> Contact Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Contact Phone</label>
              <input value={settings.contact_phone} onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })} className="input-luxury" />
            </div>
            <div>
              <label className="label-luxury">Contact Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                <input value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} className="input-luxury pl-11" />
              </div>
            </div>
            <div>
              <label className="label-luxury">WhatsApp Number</label>
              <div className="relative">
                <MessageCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                <input value={settings.whatsapp_number} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} className="input-luxury pl-11" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="label-luxury">Address</label>
              <textarea value={settings.contact_address} onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })} rows={2} className="input-luxury resize-none" />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="card-luxury p-6">
          <h3 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
            <Search size={18} className="text-gold-500" /> SEO Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label-luxury">SEO Title</label>
              <input value={settings.seo_title} onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })} className="input-luxury" />
            </div>
            <div>
              <label className="label-luxury">SEO Description</label>
              <textarea value={settings.seo_description} onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })} rows={3} className="input-luxury resize-none" />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button onClick={save} disabled={saving} className="btn-gold flex items-center gap-2 disabled:opacity-60">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
          </button>
          {saved && <span className="text-sm text-olive-600">Changes saved successfully!</span>}
        </div>
      </div>
    </div>
  );
}
