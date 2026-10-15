-- ==============================================================================
-- SIWES Developer Portfolio - Database Schema (Module 2)
-- Target Database: PostgreSQL via Supabase
-- Description: Core tables for personal developer portfolio content management.
-- ==============================================================================

-- 1. SITE SETTINGS TABLE (Singleton configuration for site-wide settings)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'Developer Portfolio',
  logo_url TEXT,
  hero_title TEXT NOT NULL DEFAULT 'Hi, I am a Full-Stack Developer',
  hero_subtitle TEXT DEFAULT 'Building high-performance web applications and digital experiences',
  hero_description TEXT DEFAULT 'Specializing in Next.js, modern JavaScript, and scalable PostgreSQL architectures.',
  hero_image_url TEXT,
  contact_email TEXT NOT NULL DEFAULT 'developer@example.com',
  phone_number TEXT,
  about_summary TEXT,
  resume_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  extra_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. DEVELOPER PROFILE TABLE (Singleton developer personal & bio details)
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  full_name TEXT NOT NULL,
  headline TEXT NOT NULL,
  professional_intro TEXT NOT NULL,
  biography TEXT,
  avatar_url TEXT,
  years_of_experience INTEGER NOT NULL DEFAULT 0,
  location TEXT,
  available_for_hire BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. SKILLS TABLE (Manageable list of developer technical skills)
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 100),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PROJECTS TABLE (Portfolio showcase projects)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT,
  thumbnail_url TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  project_url TEXT,
  github_url TEXT,
  project_year TEXT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::TEXT,
  status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Completed', 'In Progress', 'Archived')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. EXPERIENCES TABLE (Professional job history and internships)
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_url TEXT,
  location TEXT,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. EDUCATION TABLE (Academic qualifications and training)
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES (Optimized for public read performance and ordering)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills (category);
CREATE INDEX IF NOT EXISTS idx_skills_featured ON skills (is_featured);

CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);

CREATE INDEX IF NOT EXISTS idx_experiences_display_order ON experiences (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_experiences_start_date ON experiences (start_date DESC);

CREATE INDEX IF NOT EXISTS idx_education_display_order ON education (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_education_start_date ON education (start_date DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Rule: Public visitors have READ-ONLY permission (SELECT).
-- Rule: Only authenticated administrators have WRITE permission (INSERT, UPDATE, DELETE).
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- 1. site_settings Policies
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 2. profiles Policies
CREATE POLICY "Public can view profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can modify profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. skills Policies
CREATE POLICY "Public can view skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can modify skills"
  ON skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. projects Policies
CREATE POLICY "Public can view projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can modify projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. experiences Policies
CREATE POLICY "Public can view experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can modify experiences"
  ON experiences FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. education Policies
CREATE POLICY "Public can view education"
  ON education FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can modify education"
  ON education FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
