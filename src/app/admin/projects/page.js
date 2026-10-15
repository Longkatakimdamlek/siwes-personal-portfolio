import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_PROJECTS } from '@/lib/defaults';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects Management | SIWES Admin',
  description: 'Create, update, and manage portfolio showcase projects.',
};

export default async function AdminProjectsPage() {
  const { user, isAuthorized } = await getAdminSession();

  if (!user || !isAuthorized) {
    redirect('/admin/login');
  }

  const supabase = await createClient();
  let projects = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        projects = data;
      } else if (!error) {
        projects = DEFAULT_PROJECTS;
      }
    } catch (err) {
      console.error('[Admin Projects Fetch]', err);
      projects = DEFAULT_PROJECTS;
    }
  } else {
    projects = DEFAULT_PROJECTS;
  }

  return <ProjectsClient initialProjects={projects} />;
}
