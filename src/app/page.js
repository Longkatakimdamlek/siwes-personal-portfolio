import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import {
  getSiteSettings,
  getProfile,
  getSkills,
  getProjects,
  getExperiences,
  getEducation,
} from '@/lib/models';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch portfolio data through centralized models (with fallback defaults)
  const [
    siteSettingsRes,
    profileRes,
    skillsRes,
    projectsRes,
    experiencesRes,
    educationRes,
  ] = await Promise.all([
    getSiteSettings(),
    getProfile(),
    getSkills(),
    getProjects(),
    getExperiences(),
    getEducation(),
  ]);

  const siteSettings = siteSettingsRes.data;
  const profile = profileRes.data;
  const skills = skillsRes.data || [];
  const projects = projectsRes.data || [];
  const experiences = experiencesRes.data || [];
  const education = educationRes.data || [];

  return (
    <div className="portfolio-wrapper">
      <Header siteSettings={siteSettings} />
      <main id="main-content">
        <Hero siteSettings={siteSettings} profile={profile} />
        <About profile={profile} siteSettings={siteSettings} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <ExperienceTimeline experiences={experiences} education={education} />
        <ContactSection siteSettings={siteSettings} profile={profile} />
      </main>
      <Footer siteSettings={siteSettings} profile={profile} />
    </div>
  );
}
