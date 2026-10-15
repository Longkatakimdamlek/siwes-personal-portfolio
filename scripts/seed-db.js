/**
 * @file scripts/seed-db.js
 * @description Seeds initial placeholder data into Supabase PostgreSQL tables.
 * Run using: npm run db:seed
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually parse .env.local if present
const envLocalPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').trim().replace(/^["']|["']$/g, '');
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer service role key for seeding to bypass RLS policies if admin writes are restricted
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('====================================================');
console.log('SIWES Portfolio - Database Seeder (Module 2)');
console.log('====================================================\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in environment.');
  console.log('Please copy .env.local.example to .env.local and configure your keys.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding initial data into Supabase...\n');

  // 1. Site Settings
  const { error: settingsError } = await supabase.from('site_settings').upsert({
    id: 1,
    site_name: 'SIWES Developer Portfolio',
    hero_title: 'Crafting Modern Web Experiences',
    hero_subtitle: 'Full-Stack Developer & Software Engineering Student',
    hero_image_url: '/images/developer_avatar_portrait_1790252834755.jpg',
    hero_description:
      'Specializing in Next.js, modern JavaScript, and scalable PostgreSQL architectures. Built as part of my SIWES industrial training project.',
    contact_email: 'developer@example.com',
    phone_number: '+234 800 123 4567',
    about_summary:
      'Passionate full-stack developer committed to writing clean, maintainable code and developing responsive, accessible applications.',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://twitter.com',
    extra_settings: { theme: 'dark', accentColor: 'purple', enablePwa: true },
  });
  if (settingsError) {
    console.log(`⚠️  site_settings: ${settingsError.message}`);
  } else {
    console.log('✅ site_settings seeded.');
  }

  // 2. Profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: 1,
    full_name: 'Developer (SIWES Intern)',
    headline: 'Full-Stack Software Engineer',
    professional_intro:
      'Hello! I am a full-stack developer passionate about building high-performance web applications and solving real-world challenges.',
    biography:
      'Currently completing my Students Industrial Work Experience Scheme (SIWES), focused on end-to-end full-stack development with Next.js App Router, PostgreSQL, and modern web architectures.',
    avatar_url: '/images/developer_avatar_portrait_1790252834755.jpg',
    years_of_experience: 2,
    location: 'Nigeria',
    available_for_hire: true,
  });
  if (profileError) {
    console.log(`⚠️  profiles: ${profileError.message}`);
  } else {
    console.log('✅ profiles seeded.');
  }

  // 3. Skills
  const skillsData = [
    { name: 'JavaScript (ES6+)', category: 'Frontend', description: 'Modern ECMAScript standards, asynchronous programming, and DOM manipulation.', icon_name: 'code', proficiency_level: 90, display_order: 1, is_featured: true },
    { name: 'React', category: 'Frontend', description: 'Component lifecycle, hooks, and modern state patterns.', icon_name: 'atom', proficiency_level: 88, display_order: 2, is_featured: true },
    { name: 'Next.js (App Router)', category: 'Frontend', description: 'Server components, server actions, route handlers, and performance optimization.', icon_name: 'layers', proficiency_level: 85, display_order: 3, is_featured: true },
    { name: 'CSS Modules', category: 'Frontend', description: 'Locally-scoped component styling, responsive design, and CSS custom properties.', icon_name: 'palette', proficiency_level: 85, display_order: 4, is_featured: false },
    { name: 'Node.js', category: 'Backend', description: 'Server-side JavaScript runtime for APIs and backend services.', icon_name: 'server', proficiency_level: 82, display_order: 5, is_featured: true },
    { name: 'PostgreSQL', category: 'Database', description: 'Relational database schema design, queries, and constraints.', icon_name: 'database', proficiency_level: 80, display_order: 6, is_featured: true },
    { name: 'Supabase', category: 'Database', description: 'Backend-as-a-service, PostgreSQL hosting, Row Level Security, and auth.', icon_name: 'cloud', proficiency_level: 82, display_order: 7, is_featured: true },
    { name: 'Git & GitHub', category: 'DevOps & Tools', description: 'Version control, branching strategies, and collaboration.', icon_name: 'git-branch', proficiency_level: 88, display_order: 8, is_featured: false },
    { name: 'RESTful APIs', category: 'Backend', description: 'Architecting and consuming standard JSON REST APIs.', icon_name: 'network', proficiency_level: 85, display_order: 9, is_featured: false },
  ];

  for (const skill of skillsData) {
    await supabase.from('skills').upsert(skill, { onConflict: 'name' });
  }
  console.log('✅ skills seeded.');

  // 4. Projects
  const projectsData = [
    {
      title: 'Personal Developer Portfolio',
      slug: 'personal-developer-portfolio',
      short_description: 'A high-performance personal developer portfolio built with Next.js App Router and PostgreSQL through Supabase.',
      full_description: 'Engineered as a core milestone for my SIWES software development project. Employs CSS Modules, dark mode aesthetics with purple accents, Row Level Security, and administrative content management.',
      thumbnail_url: '/assets/project-portfolio.png',
      technologies: ['Next.js', 'React', 'JavaScript', 'CSS Modules', 'PostgreSQL', 'Supabase'],
      project_url: 'https://example.com',
      github_url: 'https://github.com',
      project_year: '2026',
      status: 'In Progress',
      is_featured: true,
      display_order: 1,
    },
    {
      title: 'Full-Stack Inventory Tracker',
      slug: 'full-stack-inventory-tracker',
      short_description: 'A lightweight inventory and stock tracking web application with relational database storage.',
      full_description: 'Provides automated alerts, product cataloging, and analytical reports for small retail businesses.',
      thumbnail_url: '/assets/project-inventory.png',
      technologies: ['Node.js', 'PostgreSQL', 'JavaScript', 'Express'],
      project_url: 'https://example.com/inventory',
      github_url: 'https://github.com',
      project_year: '2025',
      status: 'Completed',
      is_featured: true,
      display_order: 2,
    },
    {
      title: 'Academic Resource Hub',
      slug: 'academic-resource-hub',
      short_description: 'A collaborative course material sharing and revision platform for university students.',
      full_description: 'Features PDF search, categorized course notes, and discussion boards for peer learning.',
      thumbnail_url: '/assets/project-academic.png',
      technologies: ['React', 'JavaScript', 'PostgreSQL'],
      project_url: 'https://example.com/academic',
      github_url: 'https://github.com',
      project_year: '2025',
      status: 'Completed',
      is_featured: false,
      display_order: 3,
    },
  ];

  for (const proj of projectsData) {
    await supabase.from('projects').upsert(proj, { onConflict: 'slug' });
  }
  console.log('✅ projects seeded.');

  // 5. Experiences
  const expData = [
    {
      role_title: 'Software Development Intern (SIWES)',
      company_name: 'Tech Solutions Hub',
      company_url: 'https://example.com',
      location: 'Abuja, Nigeria',
      description: 'Developing full-stack web applications, learning modern JavaScript development workflows, database management with PostgreSQL, and production deployment pipelines.',
      start_date: '2026-01-15',
      end_date: null,
      is_current: true,
      display_order: 1,
    },
    {
      role_title: 'Junior Frontend Trainee',
      company_name: 'Digital Skills Academy',
      company_url: 'https://example.com',
      location: 'Remote',
      description: 'Built responsive user interfaces with semantic HTML, modern CSS, and JavaScript. Collaborated on group projects using Git version control.',
      start_date: '2025-06-01',
      end_date: '2025-12-15',
      is_current: false,
      display_order: 2,
    },
  ];

  for (const exp of expData) {
    await supabase.from('experiences').insert(exp);
  }
  console.log('✅ experiences seeded.');

  // 6. Education
  const eduData = [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science (B.Sc.)',
      field_of_study: 'Computer Science',
      description: 'Coursework covering Data Structures, Algorithms, Database Management Systems, Object-Oriented Programming, and Software Engineering.',
      start_date: '2022-09-01',
      end_date: '2026-07-31',
      display_order: 1,
    },
  ];

  for (const edu of eduData) {
    await supabase.from('education').insert(edu);
  }
  console.log('✅ education seeded.');

  console.log('\nSeeding completed. You can run "npm run db:verify" to verify table counts.');
}

seed().catch((err) => {
  console.error('Seeding encountered an error:', err.message);
  console.log('\nTip: You can also copy and paste "supabase/seed.sql" directly into the Supabase Dashboard SQL Editor.');
});
