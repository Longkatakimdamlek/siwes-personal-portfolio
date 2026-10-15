import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_PROFILE } from '@/lib/defaults';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About & Profile Management | SIWES Admin',
  description: 'Manage developer biography, avatar, professional intro, and availability.',
};

export default async function AdminAboutPage() {
  const { user, isAuthorized } = await getAdminSession();

  if (!user || !isAuthorized) {
    redirect('/admin/login');
  }

  const supabase = await createClient();
  let profile = DEFAULT_PROFILE;

  if (supabase) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (data) {
        profile = data;
      }
    } catch (err) {
      console.error('[Admin Profile Fetch]', err);
    }
  }

  return <ProfileClient initialProfile={profile} />;
}
