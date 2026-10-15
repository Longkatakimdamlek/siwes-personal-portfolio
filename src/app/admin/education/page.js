import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_EDUCATION } from '@/lib/defaults';
import EducationClient from './EducationClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Education Management | SIWES Admin',
  description: 'Manage academic qualifications, degrees, and university credentials.',
};

export default async function AdminEducationPage() {
  const { user, isAuthorized } = await getAdminSession();

  if (!user || !isAuthorized) {
    redirect('/admin/login');
  }

  const supabase = await createClient();
  let educationList = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true })
        .order('start_date', { ascending: false });

      if (data && data.length > 0) {
        educationList = data;
      } else if (!error) {
        educationList = DEFAULT_EDUCATION;
      }
    } catch (err) {
      console.error('[Admin Education Fetch]', err);
      educationList = DEFAULT_EDUCATION;
    }
  } else {
    educationList = DEFAULT_EDUCATION;
  }

  return <EducationClient initialEducation={educationList} />;
}
