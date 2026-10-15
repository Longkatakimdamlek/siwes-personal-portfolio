import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_SITE_SETTINGS } from '@/lib/defaults';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Site Settings Management | SIWES Admin',
  description: 'Manage site branding, hero text, contact channels, and links.',
};

export default async function AdminSettingsPage() {
  const { user, isAuthorized } = await getAdminSession();

  if (!user || !isAuthorized) {
    redirect('/admin/login');
  }

  const supabase = await createClient();
  let settings = DEFAULT_SITE_SETTINGS;

  if (supabase) {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (data) {
        settings = data;
      }
    } catch (err) {
      console.error('[Admin Settings Fetch]', err);
    }
  }

  return <SettingsClient initialSettings={settings} />;
}
