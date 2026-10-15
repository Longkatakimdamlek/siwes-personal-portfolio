-- ==============================================================================
-- SIWES Developer Portfolio - Seed Data (Module 2)
-- Description: Realistic initial data for testing and populating the database.
-- NOTE: All data is starter placeholder content and can be edited in Module 4.
-- ==============================================================================

-- 1. Insert Initial Site Settings (Singleton row with id = 1)
INSERT INTO site_settings (
  id,
  site_name,
  hero_title,
  hero_subtitle,
  hero_image_url,
  hero_description,
  contact_email,
  phone_number,
  about_summary,
  github_url,
  linkedin_url,
  twitter_url,
  extra_settings
) VALUES (
  1,
  'SIWES Developer Portfolio',
  'Crafting Modern Web Experiences',
  'Full-Stack Developer & Software Engineering Student',
  '/images/developer_avatar_portrait_1790252834755.jpg',
  'Specializing in Next.js, modern JavaScript, and scalable PostgreSQL architectures. Built as part of my SIWES industrial training project.',
  'developer@example.com',
  '+234 800 123 4567',
  'Passionate full-stack developer committed to writing clean, maintainable code and developing responsive, accessible applications.',
  'https://github.com',
  'https://linkedin.com',
  'https://twitter.com',
  '{"theme": "dark", "accentColor": "purple", "enablePwa": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  hero_image_url = EXCLUDED.hero_image_url,
  hero_description = EXCLUDED.hero_description,
  updated_at = timezone('utc'::text, now());

-- 2. Insert Initial Profile (Singleton row with id = 1)
INSERT INTO profiles (
  id,
  full_name,
  headline,
  professional_intro,
  biography,
  avatar_url,
  years_of_experience,
  location,
  available_for_hire
) VALUES (
  1,
  'Developer (SIWES Intern)',
  'Full-Stack Software Engineer',
  'Hello! I am a full-stack developer passionate about building high-performance web applications and solving real-world challenges.',
  'Currently completing my Students Industrial Work Experience Scheme (SIWES), focused on end-to-end full-stack development with Next.js App Router, PostgreSQL, and modern web architectures.',
  '/images/developer_avatar_portrait_1790252834755.jpg',
  2,
  'Nigeria',
  true
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  headline = EXCLUDED.headline,
  professional_intro = EXCLUDED.professional_intro,
  biography = EXCLUDED.biography,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = timezone('utc'::text, now());

-- 3. Insert Initial Skills
INSERT INTO skills (name, category, description, icon_name, proficiency_level, display_order, is_featured)
VALUES
  ('JavaScript (ES6+)', 'Frontend', 'Modern ECMAScript standards, asynchronous programming, and DOM manipulation.', 'code', 90, 1, true),
  ('React', 'Frontend', 'Component lifecycle, hooks, and modern state patterns.', 'atom', 88, 2, true),
  ('Next.js (App Router)', 'Frontend', 'Server components, server actions, route handlers, and performance optimization.', 'layers', 85, 3, true),
  ('CSS Modules', 'Frontend', 'Locally-scoped component styling, responsive design, and CSS custom properties.', 'palette', 85, 4, false),
  ('Node.js', 'Backend', 'Server-side JavaScript runtime for APIs and backend services.', 'server', 82, 5, true),
  ('PostgreSQL', 'Database', 'Relational database schema design, queries, and constraints.', 'database', 80, 6, true),
  ('Supabase', 'Database', 'Backend-as-a-service, PostgreSQL hosting, Row Level Security, and auth.', 'cloud', 82, 7, true),
  ('Git & GitHub', 'DevOps & Tools', 'Version control, branching strategies, and collaboration.', 'git-branch', 88, 8, false),
  ('RESTful APIs', 'Backend', 'Architecting and consuming standard JSON REST APIs.', 'network', 85, 9, false)
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  proficiency_level = EXCLUDED.proficiency_level,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured,
  updated_at = timezone('utc'::text, now());

-- 4. Insert Initial Projects
INSERT INTO projects (
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
  display_order
)
VALUES
  (
    'Personal Developer Portfolio',
    'personal-developer-portfolio',
    'A high-performance personal developer portfolio built with Next.js App Router and PostgreSQL through Supabase.',
    'Engineered as a core milestone for my SIWES software development project. Employs CSS Modules, dark mode aesthetics with purple accents, Row Level Security, and administrative content management.',
    '/assets/project-portfolio.png',
    ARRAY['Next.js', 'React', 'JavaScript', 'CSS Modules', 'PostgreSQL', 'Supabase'],
    'https://example.com',
    'https://github.com',
    '2026',
    'In Progress',
    true,
    1
  ),
  (
    'Full-Stack Inventory Tracker',
    'full-stack-inventory-tracker',
    'A lightweight inventory and stock tracking web application with relational database storage.',
    'Provides automated alerts, product cataloging, and analytical reports for small retail businesses.',
    '/assets/project-inventory.png',
    ARRAY['Node.js', 'PostgreSQL', 'JavaScript', 'Express'],
    'https://example.com/inventory',
    'https://github.com',
    '2025',
    'Completed',
    true,
    2
  ),
  (
    'Academic Resource Hub',
    'academic-resource-hub',
    'A collaborative course material sharing and revision platform for university students.',
    'Features PDF search, categorized course notes, and discussion boards for peer learning.',
    '/assets/project-academic.png',
    ARRAY['React', 'JavaScript', 'PostgreSQL'],
    'https://example.com/academic',
    'https://github.com',
    '2025',
    'Completed',
    false,
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  technologies = EXCLUDED.technologies,
  status = EXCLUDED.status,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order,
  updated_at = timezone('utc'::text, now());

-- 5. Insert Initial Experiences
INSERT INTO experiences (
  role_title,
  company_name,
  company_url,
  location,
  description,
  start_date,
  end_date,
  is_current,
  display_order
)
VALUES
  (
    'Software Development Intern (SIWES)',
    'Tech Solutions Hub',
    'https://example.com',
    'Abuja, Nigeria',
    'Developing full-stack web applications, learning modern JavaScript development workflows, database management with PostgreSQL, and production deployment pipelines.',
    '2026-01-15',
    NULL,
    true,
    1
  ),
  (
    'Junior Frontend Trainee',
    'Digital Skills Academy',
    'https://example.com',
    'Remote',
    'Built responsive user interfaces with semantic HTML, modern CSS, and JavaScript. Collaborated on group projects using Git version control.',
    '2025-06-01',
    '2025-12-15',
    false,
    2
  );

-- 6. Insert Initial Education
INSERT INTO education (
  institution,
  degree,
  field_of_study,
  description,
  start_date,
  end_date,
  display_order
)
VALUES
  (
    'University of Technology',
    'Bachelor of Science (B.Sc.)',
    'Computer Science',
    'Coursework covering Data Structures, Algorithms, Database Management Systems, Object-Oriented Programming, and Software Engineering.',
    '2022-09-01',
    '2026-07-31',
    1
  );
