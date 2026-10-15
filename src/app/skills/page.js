import Header from '@/components/Header';
import Skills from '@/components/Skills';
import Footer from '@/components/Footer';
import { getSiteSettings, getSkills } from '@/lib/models';

export const metadata = {
  title: 'Technical Skills | SIWES Developer Portfolio',
  description: 'Explore my programming languages, frontend and backend frameworks, and database tools.',
};

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  const [siteSettingsRes, skillsRes] = await Promise.all([
    getSiteSettings(),
    getSkills(),
  ]);

  const siteSettings = siteSettingsRes.data;
  const skills = skillsRes.data || [];

  return (
    <div>
      <Header siteSettings={siteSettings} />
      <main id="main-content" style={{ paddingTop: '2rem' }}>
        <Skills skills={skills} />
      </main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
