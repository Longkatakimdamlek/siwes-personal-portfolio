import Header from '@/components/Header';
import About from '@/components/About';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import Footer from '@/components/Footer';
import {
  getSiteSettings,
  getProfile,
  getExperiences,
  getEducation,
} from '@/lib/models';

export const metadata = {
  title: 'About Me | SIWES Developer Portfolio',
  description: 'Learn more about my software engineering background, industrial training, and education.',
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [siteSettingsRes, profileRes, experiencesRes, educationRes] = await Promise.all([
    getSiteSettings(),
    getProfile(),
    getExperiences(),
    getEducation(),
  ]);

  const siteSettings = siteSettingsRes.data;
  const profile = profileRes.data;
  const experiences = experiencesRes.data || [];
  const education = educationRes.data || [];

  return (
    <div>
      <Header siteSettings={siteSettings} />
      <main id="main-content" style={{ paddingTop: '2rem' }}>
        <About profile={profile} siteSettings={siteSettings} />
        <ExperienceTimeline experiences={experiences} education={education} />
      </main>
      <Footer siteSettings={siteSettings} profile={profile} />
    </div>
  );
}
