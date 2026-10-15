/**
 * @file src/lib/auth.js
 * @description Centralized server-side authentication and single-owner authorization helpers.
 */

import { createClient } from './supabase/server';

/**
 * Checks whether an authenticated user is the authorized portfolio administrator.
 * If ADMIN_EMAIL is configured in environment variables, the user's email must match.
 *
 * @param {object|null} user - The Supabase auth user object.
 * @returns {boolean} True if the user is authorized as portfolio admin.
 */
export function isAuthorizedAdmin(user) {
  if (!user || !user.email) return false;

  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configuredAdminEmail) {
    // If no specific admin email is configured, any authenticated user
    // in this private project instance is authorized as the owner.
    return true;
  }

  return user.email.toLowerCase() === configuredAdminEmail;
}

/**
 * Securely retrieves the current administrator session on the server.
 * Uses supabase.auth.getUser() to prevent JWT tampering.
 *
 * @returns {Promise<{ user: object|null, isAuthorized: boolean, error: object|null }>}
 */
export async function getAdminSession() {
  const supabase = await createClient();
  if (!supabase) {
    return {
      user: null,
      isAuthorized: false,
      error: new Error('Supabase server client not initialized. Check environment variables.'),
    };
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null, isAuthorized: false, error };
    }

    const authorized = isAuthorizedAdmin(user);
    return { user, isAuthorized: authorized, error: null };
  } catch (err) {
    return { user: null, isAuthorized: false, error: err };
  }
}
