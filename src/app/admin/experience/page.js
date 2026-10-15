import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_EXPERIENCES } from '@/lib/defaults';
import ExperienceClient from './ExperienceClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Experience Management | SIWES Admin',
  description: 'Manage work history, internships, and professional career milestones.',
};

export default async function AdminExperiencePage() {
  const { user, isAuthorized } = await getAdminSession();

  if (!user || !isAuthorized) {
    redirect('/admin/login');
  }

  const supabase = await createClient();
  let experiences = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('display_order', { ascending: true })
        .order('start_date', { ascending: false });

      if (data && data.length > 0) {
        experiences = data;
      } else if (!error) {
        experiences = DEFAULT_EXPERIENCES;
      }
    } catch (err) {
      console.error('[Admin Experience Fetch]', err);
      experiences = DEFAULT_EXPERIENCES;
    }
  } else {
    experiences = DEFAULT_EXPERIENCES;
  }

  return <ExperienceClient initialExperiences={experiences} />;
}
