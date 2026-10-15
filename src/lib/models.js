/**
 * @file src/lib/models.js
 * @description Centralized data access functions for Supabase PostgreSQL tables.
 * Used by server components and pages to safely query portfolio content with fallback defaults.
 */

import { getSupabase } from './supabase';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_PROFILE,
  DEFAULT_SKILLS,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCES,
  DEFAULT_EDUCATION,
} from './defaults';

/**
 * Fetch global site settings.
 * @returns {Promise<{ data: object, isFallback: boolean, error: object|null }>}
 */
export async function getSiteSettings() {
  const supabase = getSupabase();
  if (!supabase) {
    return { data: DEFAULT_SITE_SETTINGS, isFallback: true, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) {
      return { data: DEFAULT_SITE_SETTINGS, isFallback: true, error };
    }

    return { data, isFallback: false, error: null };
  } catch (err) {
    return { data: DEFAULT_SITE_SETTINGS, isFallback: true, error: err };
  }
}

/**
 * Fetch the developer profile.
 * @returns {Promise<{ data: object, isFallback: boolean, error: object|null }>}
 */
export async function getProfile() {
  const supabase = getSupabase();
  if (!supabase) {
    return { data: DEFAULT_PROFILE, isFallback: true, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) {
      return { data: DEFAULT_PROFILE, isFallback: true, error };
    }

    return { data, isFallback: false, error: null };
  } catch (err) {
    return { data: DEFAULT_PROFILE, isFallback: true, error: err };
  }
}

/**
 * Fetch all skills, ordered by display_order.
 * @param {object} [options]
 * @param {boolean} [options.featuredOnly=false]
 * @param {string} [options.category]
 * @returns {Promise<{ data: Array, isFallback: boolean, error: object|null }>}
 */
export async function getSkills({ featuredOnly = false, category = null } = {}) {
  const supabase = getSupabase();
  if (!supabase) {
    let filtered = DEFAULT_SKILLS;
    if (featuredOnly) filtered = filtered.filter((s) => s.is_featured);
    if (category) filtered = filtered.filter((s) => s.category === category);
    return { data: filtered, isFallback: true, error: null };
  }

  try {
    let query = supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let filtered = DEFAULT_SKILLS;
      if (featuredOnly) filtered = filtered.filter((s) => s.is_featured);
      if (category) filtered = filtered.filter((s) => s.category === category);
      return { data: filtered, isFallback: true, error };
    }

    return { data, isFallback: false, error: null };
  } catch (err) {
    let filtered = DEFAULT_SKILLS;
    if (featuredOnly) filtered = filtered.filter((s) => s.is_featured);
    if (category) filtered = filtered.filter((s) => s.category === category);
    return { data: filtered, isFallback: true, error: err };
  }
}

/**
 * Fetch all projects, ordered by display_order.
 * @param {object} [options]
 * @param {boolean} [options.featuredOnly=false]
 * @param {string} [options.status]
 * @returns {Promise<{ data: Array, isFallback: boolean, error: object|null }>}
 */
export async function getProjects({ featuredOnly = false, status = null } = {}) {
  const supabase = getSupabase();
  if (!supabase) {
    let filtered = DEFAULT_PROJECTS;
    if (featuredOnly) filtered = filtered.filter((p) => p.is_featured);
    if (status) filtered = filtered.filter((p) => p.status === status);
    return { data: filtered, isFallback: true, error: null };
  }

  try {
    let query = supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let filtered = DEFAULT_PROJECTS;
      if (featuredOnly) filtered = filtered.filter((p) => p.is_featured);
      if (status) filtered = filtered.filter((p) => p.status === status);
      return { data: filtered, isFallback: true, error };
    }

    return { data, isFallback: false, error: null };
  } catch (err) {
    let filtered = DEFAULT_PROJECTS;
    if (featuredOnly) filtered = filtered.filter((p) => p.is_featured);
    if (status) filtered = filtered.filter((p) => p.status === status);
    return { data: filtered, isFallback: true, error: err };
  }
}

/**
 * Fetch a single project by slug.
 * @param {string} slug
 * @returns {Promise<{ data: object|null, isFallback: boolean, error: object|null }>}
 */
export async function getProjectBySlug(slug) {
  const supabase = getSupabase();
  if (!supabase) {
    const fallback = DEFAULT_PROJECTS.find((p) => p.slug === slug) || null;
    return { data: fallback, isFallback: true, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const fallback = DEFAULT_PROJECTS.find((p) => p.slug === slug) || null;
      return { data: fallback, isFallback: true, error };
    }

    return { data, isFallback: false, error: null };
  } catch (err) {
    const fallback = DEFAULT_PROJECTS.find((p) => p.slug === slug) || null;
    return { data: fallback, isFallback: true, error: err };
  }
}

/**
 * Fetch all work experiences, ordered by display_order and start_date.
 * @returns {Promise<{ data: Array, isFallback: boolean, error: object|null }>}
 */
export async function getExperiences() {
  const supabase = getSupabase();
  if (!supabase) {
    return { data: DEFAULT_EXPERIENCES, isFallback: true, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('display_order', { ascending: true })
      .order('start_date', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: DEFAULT_EXPERIENCES, isFallback: true, error };
    }

    return { data, isFallback: false, error: null };
  } catch (err) {
    return { data: DEFAULT_EXPERIENCES, isFallback: true, error: err };
  }
}

/**
 * Fetch all education entries, ordered by display_order and start_date.
 * @returns {Promise<{ data: Array, isFallback: boolean, error: object|null }>}
 */
export async function getEducation() {
  const supabase = getSupabase();
  if (!supabase) {
    return { data: DEFAULT_EDUCATION, isFallback: true, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('display_order', { ascending: true })
      .order('start_date', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: DEFAULT_EDUCATION, isFallback: true, error };
    }

    return { data, isFallback: false, error: null };
  } catch (err) {
    return { data: DEFAULT_EDUCATION, isFallback: true, error: err };
  }
}
