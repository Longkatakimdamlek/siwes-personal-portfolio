import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_SKILLS } from '@/lib/defaults';
import SkillsClient from './SkillsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Skills Management | SIWES Admin',
  description: 'Manage technical skills, proficiency levels, and categories.',
};

export default async function AdminSkillsPage() {
  const { user, isAuthorized } = await getAdminSession();

  if (!user || !isAuthorized) {
    redirect('/admin/login');
  }

  const supabase = await createClient();
  let skills = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (data && data.length > 0) {
        skills = data;
      } else if (!error) {
        // Fallback default skills if database has not yet been seeded
        skills = DEFAULT_SKILLS;
      }
    } catch (err) {
      console.error('[Admin Skills Fetch]', err);
      skills = DEFAULT_SKILLS;
    }
  } else {
    skills = DEFAULT_SKILLS;
  }

  return <SkillsClient initialSkills={skills} />;
}
