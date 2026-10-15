import Header from '@/components/Header';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
import { getSiteSettings, getProjects } from '@/lib/models';

export const metadata = {
  title: 'Selected Projects | SIWES Developer Portfolio',
  description: 'Explore full-stack web applications and software development projects.',
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const [siteSettingsRes, projectsRes] = await Promise.all([
    getSiteSettings(),
    getProjects(),
  ]);

  const siteSettings = siteSettingsRes.data;
  const projects = projectsRes.data || [];

  return (
    <div>
      <Header siteSettings={siteSettings} />
      <main id="main-content" style={{ paddingTop: '2rem' }}>
        <Projects projects={projects} />
      </main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
