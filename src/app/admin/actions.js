'use server';

import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_PROFILE,
  DEFAULT_SKILLS,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCES,
  DEFAULT_EDUCATION,
} from '@/lib/defaults';

/**
 * Revalidates public and admin paths so changes appear instantly everywhere.
 */
function revalidatePortfolioPaths(additionalPath = '') {
  try {
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/skills');
    revalidatePath('/projects');
    revalidatePath('/contact');
    revalidatePath('/admin');
    if (additionalPath) {
      revalidatePath(additionalPath);
    }
  } catch (err) {
    console.warn('[Cache Revalidation]', err.message);
  }
}

/**
 * Helper to assert admin authorization on the server.
 */
async function assertAdmin() {
  const session = await getAdminSession();
  if (!session.user || !session.isAuthorized) {
    throw new Error('Unauthorized: Administrator authentication required.');
  }
  return session.user;
}

// ==============================================================================
// 1. SITE SETTINGS ACTIONS
// ==============================================================================

export async function saveSiteSettingsAction(formData) {
  try {
    await assertAdmin();

    const site_name = formData.site_name?.trim() || 'Developer Portfolio';
    const logo_url = formData.logo_url?.trim() || null;
    const hero_title = formData.hero_title?.trim();
    const hero_subtitle = formData.hero_subtitle?.trim() || null;
    const hero_description = formData.hero_description?.trim() || null;
    const hero_image_url = formData.hero_image_url?.trim() || null;
    const contact_email = formData.contact_email?.trim();
    const phone_number = formData.phone_number?.trim() || null;
    const about_summary = formData.about_summary?.trim() || null;
    const resume_url = formData.resume_url?.trim() || null;
    const github_url = formData.github_url?.trim() || null;
    const linkedin_url = formData.linkedin_url?.trim() || null;
    const twitter_url = formData.twitter_url?.trim() || null;

    if (!hero_title) {
      return { success: false, error: 'Hero title is required.' };
    }
    if (!contact_email || !contact_email.includes('@')) {
      return { success: false, error: 'A valid contact email address is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const payload = {
      id: 1,
      site_name,
      logo_url,
      hero_title,
      hero_subtitle,
      hero_description,
      hero_image_url,
      contact_email,
      phone_number,
      about_summary,
      resume_url,
      github_url,
      linkedin_url,
      twitter_url,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/settings');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to save site settings.' };
  }
}

// ==============================================================================
// 2. PROFILE ACTIONS
// ==============================================================================

export async function saveProfileAction(formData) {
  try {
    await assertAdmin();

    const full_name = formData.full_name?.trim();
    const headline = formData.headline?.trim();
    const professional_intro = formData.professional_intro?.trim();
    const biography = formData.biography?.trim() || null;
    const avatar_url = formData.avatar_url?.trim() || null;
    const years_of_experience = parseInt(formData.years_of_experience, 10) || 0;
    const location = formData.location?.trim() || null;
    const available_for_hire = Boolean(formData.available_for_hire);

    if (!full_name) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!headline) {
      return { success: false, error: 'Professional headline is required.' };
    }
    if (!professional_intro) {
      return { success: false, error: 'Professional introduction is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const payload = {
      id: 1,
      full_name,
      headline,
      professional_intro,
      biography,
      avatar_url,
      years_of_experience,
      location,
      available_for_hire,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/about');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to save profile.' };
  }
}

// ==============================================================================
// 3. SKILLS CRUD ACTIONS
// ==============================================================================

export async function createSkillAction(skillData) {
  try {
    await assertAdmin();

    const name = skillData.name?.trim();
    const category = skillData.category?.trim() || 'Frontend';
    const description = skillData.description?.trim() || null;
    const icon_name = skillData.icon_name?.trim() || null;
    const proficiency_level = Math.min(
      100,
      Math.max(1, parseInt(skillData.proficiency_level, 10) || 80)
    );
    const display_order = parseInt(skillData.display_order, 10) || 0;
    const is_featured = Boolean(skillData.is_featured);

    if (!name) {
      return { success: false, error: 'Skill name is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { data, error } = await supabase
      .from('skills')
      .insert({
        name,
        category,
        description,
        icon_name,
        proficiency_level,
        display_order,
        is_featured,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/skills');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to create skill.' };
  }
}

export async function updateSkillAction(id, skillData) {
  try {
    await assertAdmin();

    if (!id) {
      return { success: false, error: 'Skill ID is required.' };
    }

    const name = skillData.name?.trim();
    const category = skillData.category?.trim() || 'Frontend';
    const description = skillData.description?.trim() || null;
    const icon_name = skillData.icon_name?.trim() || null;

    const proficiency_level = Math.min(
      100,
      Math.max(1, parseInt(skillData.proficiency_level, 10) || 80)
    );
    const display_order = parseInt(skillData.display_order, 10) || 0;
    const is_featured = Boolean(skillData.is_featured);

    if (!name) {
      return { success: false, error: 'Skill name is required.' };
    }

    const supabase = await createClient();

    if (!supabase) {
      return {
        success: false,
        error: 'Database client initialization failed.',
      };
    }

    const { data, error } = await supabase
      .from('skills')
      .update({
        name,
        category,
        description,
        icon_name,
        proficiency_level,
        display_order,
        is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, name, category, description, icon_name, proficiency_level, display_order, is_featured')
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return {
        success: false,
        error: 'No skill was updated. The skill may no longer exist, or your database permissions may be blocking the update. Refresh the skills page and try again.',
      };
    }

    revalidatePortfolioPaths('/admin/skills');
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Failed to update skill.',
    };
  }
}

export async function deleteSkillAction(id) {
  try {
    await assertAdmin();

    if (!id) {
      return { success: false, error: 'Skill ID is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { error } = await supabase.from('skills').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/skills');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to delete skill.' };
  }
}

// ==============================================================================
// 4. PROJECTS CRUD ACTIONS
// ==============================================================================

export async function createProjectAction(projectData) {
  try {
    await assertAdmin();

    const title = projectData.title?.trim();
    let slug = projectData.slug?.trim();
    if (!slug && title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const short_description = projectData.short_description?.trim();
    const full_description = projectData.full_description?.trim() || null;
    const thumbnail_url = projectData.thumbnail_url?.trim() || null;

    let technologies = [];
    if (Array.isArray(projectData.technologies)) {
      technologies = projectData.technologies;
    } else if (typeof projectData.technologies === 'string') {
      technologies = projectData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const project_url = projectData.project_url?.trim() || null;
    const github_url = projectData.github_url?.trim() || null;
    const project_year = projectData.project_year?.trim() || new Date().getFullYear().toString();
    const status = projectData.status?.trim() || 'Completed';
    const is_featured = Boolean(projectData.is_featured);
    const display_order = parseInt(projectData.display_order, 10) || 0;

    if (!title) {
      return { success: false, error: 'Project title is required.' };
    }
    if (!slug) {
      return { success: false, error: 'Project slug identifier is required.' };
    }
    if (!short_description) {
      return { success: false, error: 'Short project description is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        slug,
        short_description,
        full_description,
        thumbnail_url,
        technologies,
        project_url,
        github_url,
        project_year,
        status,
        is_featured,
        display_order,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/projects');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to create project.' };
  }
}

export async function updateProjectAction(id, projectData) {
  try {
    await assertAdmin();

    if (!id) {
      return { success: false, error: 'Project ID is required.' };
    }

    const title = projectData.title?.trim();
    let slug = projectData.slug?.trim();
    if (!slug && title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const short_description = projectData.short_description?.trim();
    const full_description = projectData.full_description?.trim() || null;
    const thumbnail_url = projectData.thumbnail_url?.trim() || null;

    let technologies = [];
    if (Array.isArray(projectData.technologies)) {
      technologies = projectData.technologies;
    } else if (typeof projectData.technologies === 'string') {
      technologies = projectData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const project_url = projectData.project_url?.trim() || null;
    const github_url = projectData.github_url?.trim() || null;
    const project_year = projectData.project_year?.trim() || new Date().getFullYear().toString();
    const status = projectData.status?.trim() || 'Completed';
    const is_featured = Boolean(projectData.is_featured);
    const display_order = parseInt(projectData.display_order, 10) || 0;

    if (!title) {
      return { success: false, error: 'Project title is required.' };
    }
    if (!slug) {
      return { success: false, error: 'Project slug identifier is required.' };
    }
    if (!short_description) {
      return { success: false, error: 'Short project description is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        slug,
        short_description,
        full_description,
        thumbnail_url,
        technologies,
        project_url,
        github_url,
        project_year,
        status,
        is_featured,
        display_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/projects');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to update project.' };
  }
}

export async function deleteProjectAction(id) {
  try {
    await assertAdmin();

    if (!id) {
      return { success: false, error: 'Project ID is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/projects');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to delete project.' };
  }
}

// ==============================================================================
// 5. EXPERIENCE CRUD ACTIONS
// ==============================================================================

export async function createExperienceAction(expData) {
  try {
    await assertAdmin();

    const role_title = expData.role_title?.trim();
    const company_name = expData.company_name?.trim();
    const company_url = expData.company_url?.trim() || null;
    const location = expData.location?.trim() || null;
    const description = expData.description?.trim() || null;
    const start_date = expData.start_date?.trim();
    const end_date = expData.end_date?.trim() || null;
    const is_current = Boolean(expData.is_current);
    const display_order = parseInt(expData.display_order, 10) || 0;

    if (!role_title) {
      return { success: false, error: 'Job/role title is required.' };
    }
    if (!company_name) {
      return { success: false, error: 'Company or organization name is required.' };
    }
    if (!start_date) {
      return { success: false, error: 'Start date is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { data, error } = await supabase
      .from('experiences')
      .insert({
        role_title,
        company_name,
        company_url,
        location,
        description,
        start_date,
        end_date: is_current ? null : end_date,
        is_current,
        display_order,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/experience');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to create experience.' };
  }
}

export async function updateExperienceAction(id, expData) {
  try {
    await assertAdmin();

    if (!id) {
      return { success: false, error: 'Experience ID is required.' };
    }

    const role_title = expData.role_title?.trim();
    const company_name = expData.company_name?.trim();
    const company_url = expData.company_url?.trim() || null;
    const location = expData.location?.trim() || null;
    const description = expData.description?.trim() || null;
    const start_date = expData.start_date?.trim();
    const end_date = expData.end_date?.trim() || null;
    const is_current = Boolean(expData.is_current);
    const display_order = parseInt(expData.display_order, 10) || 0;

    if (!role_title) {
      return { success: false, error: 'Job/role title is required.' };
    }
    if (!company_name) {
      return { success: false, error: 'Company or organization name is required.' };
    }
    if (!start_date) {
      return { success: false, error: 'Start date is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { data, error } = await supabase
      .from('experiences')
      .update({
        role_title,
        company_name,
        company_url,
        location,
        description,
        start_date,
        end_date: is_current ? null : end_date,
        is_current,
        display_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/experience');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to update experience.' };
  }
}

export async function deleteExperienceAction(id) {
  try {
    await assertAdmin();

    if (!id) {
      return { success: false, error: 'Experience ID is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { error } = await supabase.from('experiences').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/experience');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to delete experience.' };
  }
}

// ==============================================================================
// 6. EDUCATION CRUD ACTIONS
// ==============================================================================

export async function createEducationAction(eduData) {
  try {
    await assertAdmin();

    const institution = eduData.institution?.trim();
    const degree = eduData.degree?.trim();
    const field_of_study = eduData.field_of_study?.trim();
    const description = eduData.description?.trim() || null;
    const start_date = eduData.start_date?.trim();
    const end_date = eduData.end_date?.trim() || null;
    const display_order = parseInt(eduData.display_order, 10) || 0;

    if (!institution) {
      return { success: false, error: 'Institution name is required.' };
    }
    if (!degree) {
      return { success: false, error: 'Degree or qualification is required.' };
    }
    if (!field_of_study) {
      return { success: false, error: 'Field of study is required.' };
    }
    if (!start_date) {
      return { success: false, error: 'Start date is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { data, error } = await supabase
      .from('education')
      .insert({
        institution,
        degree,
        field_of_study,
        description,
        start_date,
        end_date,
        display_order,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/education');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to create education entry.' };
  }
}

export async function updateEducationAction(id, eduData) {
  try {
    await assertAdmin();

    if (!id) {
      return { success: false, error: 'Education ID is required.' };
    }

    const institution = eduData.institution?.trim();
    const degree = eduData.degree?.trim();
    const field_of_study = eduData.field_of_study?.trim();
    const description = eduData.description?.trim() || null;
    const start_date = eduData.start_date?.trim();
    const end_date = eduData.end_date?.trim() || null;
    const display_order = parseInt(eduData.display_order, 10) || 0;

    if (!institution) {
      return { success: false, error: 'Institution name is required.' };
    }
    if (!degree) {
      return { success: false, error: 'Degree or qualification is required.' };
    }
    if (!field_of_study) {
      return { success: false, error: 'Field of study is required.' };
    }
    if (!start_date) {
      return { success: false, error: 'Start date is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { data, error } = await supabase
      .from('education')
      .update({
        institution,
        degree,
        field_of_study,
        description,
        start_date,
        end_date,
        display_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/education');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to update education entry.' };
  }
}

export async function deleteEducationAction(id) {
  try {
    await assertAdmin();

    if (!id) {
      return { success: false, error: 'Education ID is required.' };
    }

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    const { error } = await supabase.from('education').delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePortfolioPaths('/admin/education');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to delete education entry.' };
  }
}

// ==============================================================================
// 7. INITIAL STARTER SEED ACTION (Convenience helper for admin)
// ==============================================================================

export async function seedStarterDataAction() {
  try {
    await assertAdmin();

    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: 'Database client initialization failed.' };
    }

    // 1. Site Settings
    await supabase.from('site_settings').upsert({
      id: 1,
      ...DEFAULT_SITE_SETTINGS,
      updated_at: new Date().toISOString(),
    });

    // 2. Profile
    await supabase.from('profiles').upsert({
      id: 1,
      ...DEFAULT_PROFILE,
      updated_at: new Date().toISOString(),
    });

    // 3. Skills (insert if empty)
    const { count: skillCount } = await supabase
      .from('skills')
      .select('*', { count: 'exact', head: true });
    if (!skillCount || skillCount === 0) {
      const skillsToInsert = DEFAULT_SKILLS.map((s) => ({
        name: s.name,
        category: s.category,
        description: s.description,
        icon_name: s.icon_name,
        proficiency_level: s.proficiency_level,
        display_order: s.display_order,
        is_featured: s.is_featured,
      }));
      await supabase.from('skills').insert(skillsToInsert);
    }

    // 4. Projects (insert if empty)
    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    if (!projectCount || projectCount === 0) {
      const projectsToInsert = DEFAULT_PROJECTS.map((p) => ({
        title: p.title,
        slug: p.slug,
        short_description: p.short_description,
        full_description: p.full_description,
        thumbnail_url: p.thumbnail_url,
        technologies: p.technologies,
        project_url: p.project_url,
        github_url: p.github_url,
        project_year: p.project_year,
        status: p.status,
        is_featured: p.is_featured,
        display_order: p.display_order,
      }));
      await supabase.from('projects').insert(projectsToInsert);
    }

    // 5. Experiences (insert if empty)
    const { count: expCount } = await supabase
      .from('experiences')
      .select('*', { count: 'exact', head: true });
    if (!expCount || expCount === 0) {
      const expsToInsert = DEFAULT_EXPERIENCES.map((e) => ({
        role_title: e.role_title,
        company_name: e.company_name,
        company_url: e.company_url,
        location: e.location,
        description: e.description,
        start_date: e.start_date,
        end_date: e.end_date,
        is_current: e.is_current,
        display_order: e.display_order,
      }));
      await supabase.from('experiences').insert(expsToInsert);
    }

    // 6. Education (insert if empty)
    const { count: eduCount } = await supabase
      .from('education')
      .select('*', { count: 'exact', head: true });
    if (!eduCount || eduCount === 0) {
      const eduToInsert = DEFAULT_EDUCATION.map((ed) => ({
        institution: ed.institution,
        degree: ed.degree,
        field_of_study: ed.field_of_study,
        description: ed.description,
        start_date: ed.start_date,
        end_date: ed.end_date,
        display_order: ed.display_order,
      }));
      await supabase.from('education').insert(eduToInsert);
    }

    revalidatePortfolioPaths();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to seed starter data.' };
  }
}
