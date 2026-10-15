import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';
import {
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_EXPERIENCES,
  DEFAULT_EDUCATION,
} from '@/lib/defaults';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard | SIWES Developer Portfolio',
  description: 'Manage portfolio showcase items, skills, biography, and settings.',
};

export default async function AdminDashboardPage() {
  const { user, isAuthorized } = await getAdminSession();

  if (!user || !isAuthorized) {
    redirect('/admin/login');
  }

  const supabase = await createClient();

  let projectsCount = 0;
  let skillsCount = 0;
  let experienceCount = 0;
  let educationCount = 0;
  let recentProjects = [];
  let recentSkills = [];

  if (supabase) {
    try {
      const [
        { count: pCount, data: pData },
        { count: sCount, data: sData },
        { count: expCount },
        { count: eduCount },
      ] = await Promise.all([
        supabase
          .from('projects')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('skills')
          .select('*', { count: 'exact' })
          .order('display_order', { ascending: true })
          .limit(5),
        supabase.from('experiences').select('*', { count: 'exact', head: true }),
        supabase.from('education').select('*', { count: 'exact', head: true }),
      ]);

      projectsCount = pCount || 0;
      skillsCount = sCount || 0;
      experienceCount = expCount || 0;
      educationCount = eduCount || 0;
      recentProjects = pData || [];
      recentSkills = sData || [];
    } catch (err) {
      console.error('[Admin Dashboard Data Fetch]', err);
    }
  }

  // If database is completely unseeded, provide fallback for visual dashboard context
  const stats = {
    projectsCount,
    skillsCount,
    experienceCount,
    educationCount,
  };

  const displayProjects = projectsCount > 0 ? recentProjects : DEFAULT_PROJECTS.slice(0, 5);
  const displaySkills = skillsCount > 0 ? recentSkills : DEFAULT_SKILLS.slice(0, 5);

  return (
    <DashboardClient
      userEmail={user.email || 'admin@portfolio'}
      stats={stats}
      recentProjects={displayProjects}
      recentSkills={displaySkills}
    />
  );
}
