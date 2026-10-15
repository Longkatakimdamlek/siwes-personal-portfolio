import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { getSiteSettings, getProfile } from '@/lib/models';

export const metadata = {
  title: 'Contact | SIWES Developer Portfolio',
  description: 'Get in touch for software development opportunities, industrial internships, and inquiries.',
};

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const [siteSettingsRes, profileRes] = await Promise.all([
    getSiteSettings(),
    getProfile(),
  ]);

  const siteSettings = siteSettingsRes.data;
  const profile = profileRes.data;

  return (
    <div>
      <Header siteSettings={siteSettings} />
      <main id="main-content" style={{ paddingTop: '2rem' }}>
        <ContactSection siteSettings={siteSettings} profile={profile} />
      </main>
      <Footer siteSettings={siteSettings} profile={profile} />
    </div>
  );
}
