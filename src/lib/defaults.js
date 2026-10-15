import { DEFAULT_AVATAR_URL } from './avatar';

/**
 * @file src/lib/defaults.js
 * @description Standard fallback data used when database tables are empty.
 * Ensures the portfolio renders cleanly in development before admin population.
 */

export const DEFAULT_SITE_SETTINGS = {
  id: 1,
  site_name: 'DevPortfolio',
  logo_url: null,
  hero_title: 'Building Scalable Web Applications',
  hero_subtitle: 'Full-Stack Software Engineer & SIWES Intern',
  hero_description:
    'Specializing in Next.js, modern JavaScript, and scalable PostgreSQL database architectures. Focused on high performance, clean architecture, and responsive user interfaces.',
  hero_image_url: DEFAULT_AVATAR_URL,
  contact_email: 'developer@example.com',
  phone_number: '+234 800 123 4567',
  about_summary:
    'Full-stack developer focused on modern web engineering, clean design systems, and responsive user experiences.',
  resume_url: '#',
  github_url: 'https://github.com',
  linkedin_url: 'https://linkedin.com',
  twitter_url: 'https://twitter.com',
  extra_settings: {
    theme: 'dark',
    accentColor: 'purple',
    availabilityStatus: 'Available for Opportunities',
  },
};

export const DEFAULT_PROFILE = {
  id: 1,
  full_name: 'Full-Stack Developer',
  headline: 'Software Engineer & SIWES Industrial Trainee',
  professional_intro:
    'Hello, I am a software engineer focused on building robust full-stack web applications with modern JavaScript, Next.js App Router, and relational database systems.',
  biography:
    'Currently completing my Students Industrial Work Experience Scheme (SIWES) software development internship. Over the past two years of hands-on project work, I have gained strong expertise in building end-to-end web products, architecting PostgreSQL schemas with Supabase, and designing responsive, accessible user interfaces with CSS Modules. I prioritize clean code architecture, performance optimization, and reliable software delivery.',
  avatar_url: DEFAULT_AVATAR_URL,
  years_of_experience: 2,
  location: 'Nigeria',
  available_for_hire: true,
};

export const DEFAULT_SKILLS = [
  {
    id: 'skill-1',
    name: 'JavaScript (ES6+)',
    category: 'Frontend',
    description: 'Modern ECMAScript standards, asynchronous patterns, and DOM manipulation.',
    icon_name: 'Code',
    proficiency_level: 90,
    display_order: 1,
    is_featured: true,
  },
  {
    id: 'skill-2',
    name: 'React 19',
    category: 'Frontend',
    description: 'Component lifecycles, hooks, compiler optimizations, and modern state patterns.',
    icon_name: 'Layers',
    proficiency_level: 88,
    display_order: 2,
    is_featured: true,
  },
  {
    id: 'skill-3',
    name: 'Next.js App Router',
    category: 'Frontend',
    description: 'Server components, route handlers, server actions, and metadata management.',
    icon_name: 'Cpu',
    proficiency_level: 86,
    display_order: 3,
    is_featured: true,
  },
  {
    id: 'skill-4',
    name: 'CSS Modules & Design Tokens',
    category: 'Frontend',
    description: 'Locally scoped component styling, responsive layouts, and CSS custom properties.',
    icon_name: 'Palette',
    proficiency_level: 85,
    display_order: 4,
    is_featured: false,
  },
  {
    id: 'skill-5',
    name: 'Node.js',
    category: 'Backend',
    description: 'Server-side JavaScript runtime for RESTful APIs and backend microservices.',
    icon_name: 'Server',
    proficiency_level: 82,
    display_order: 5,
    is_featured: true,
  },
  {
    id: 'skill-6',
    name: 'RESTful API Design',
    category: 'Backend',
    description: 'Clean endpoint architecture, JSON payload contracts, and HTTP status codes.',
    icon_name: 'Network',
    proficiency_level: 85,
    display_order: 6,
    is_featured: false,
  },
  {
    id: 'skill-7',
    name: 'PostgreSQL',
    category: 'Database',
    description: 'Relational database schema modeling, indexing, foreign keys, and constraints.',
    icon_name: 'Database',
    proficiency_level: 82,
    display_order: 7,
    is_featured: true,
  },
  {
    id: 'skill-8',
    name: 'Supabase',
    category: 'Database',
    description: 'Database hosting, Row Level Security (RLS) policies, and client integration.',
    icon_name: 'Cloud',
    proficiency_level: 84,
    display_order: 8,
    is_featured: true,
  },
  {
    id: 'skill-9',
    name: 'Git & GitHub',
    category: 'Tools',
    description: 'Distributed version control, branching strategies, and team collaboration.',
    icon_name: 'GitBranch',
    proficiency_level: 88,
    display_order: 9,
    is_featured: false,
  },
  {
    id: 'skill-10',
    name: 'Web Performance & Accessibility',
    category: 'Tools',
    description: 'Core Web Vitals, semantic HTML structure, and WCAG AA contrast compliance.',
    icon_name: 'Zap',
    proficiency_level: 80,
    display_order: 10,
    is_featured: false,
  },
];

export const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Personal Developer Portfolio',
    slug: 'personal-developer-portfolio',
    short_description:
      'A high-performance personal developer portfolio built with Next.js App Router and PostgreSQL through Supabase.',
    full_description:
      'Engineered as a core milestone for my SIWES software development project. Employs CSS Modules, dark mode aesthetics with purple accents, Row Level Security, and administrative content management.',
    thumbnail_url: '/images/project-portfolio.jpg',
    technologies: ['Next.js', 'React', 'JavaScript', 'CSS Modules', 'PostgreSQL', 'Supabase'],
    project_url: 'https://example.com',
    github_url: 'https://github.com',
    project_year: '2026',
    status: 'In Progress',
    is_featured: true,
    display_order: 1,
  },
  {
    id: 'proj-2',
    title: 'Full-Stack Inventory Tracker',
    slug: 'full-stack-inventory-tracker',
    short_description:
      'A lightweight inventory and stock tracking web application with relational database storage.',
    full_description:
      'Provides automated stock alerts, product cataloging, and analytical reports for small retail businesses. Implemented with clean REST API architecture and PostgreSQL.',
    thumbnail_url: '/images/project-inventory.jpg',
    technologies: ['Node.js', 'PostgreSQL', 'JavaScript', 'Express'],
    project_url: 'https://example.com/inventory',
    github_url: 'https://github.com',
    project_year: '2025',
    status: 'Completed',
    is_featured: true,
    display_order: 2,
  },
  {
    id: 'proj-3',
    title: 'Academic Resource Hub',
    slug: 'academic-resource-hub',
    short_description:
      'A collaborative course material sharing and revision platform for university students.',
    full_description:
      'Features PDF search, categorized course notes, and peer discussion boards. Built with responsive layout and database querying.',
    thumbnail_url: '/images/project-academic.jpg',
    technologies: ['React', 'JavaScript', 'PostgreSQL'],
    project_url: 'https://example.com/academic',
    github_url: 'https://github.com',
    project_year: '2025',
    status: 'Completed',
    is_featured: false,
    display_order: 3,
  },
];

export const DEFAULT_EXPERIENCES = [
  {
    id: 'exp-1',
    role_title: 'Software Development Intern (SIWES)',
    company_name: 'Tech Solutions Hub',
    company_url: 'https://example.com',
    location: 'Abuja, Nigeria',
    description:
      'Developing full-stack web applications, learning modern JavaScript development workflows, database management with PostgreSQL, and production deployment pipelines.',
    start_date: '2026-01-15',
    end_date: null,
    is_current: true,
    display_order: 1,
  },
  {
    id: 'exp-2',
    role_title: 'Junior Frontend Trainee',
    company_name: 'Digital Skills Academy',
    company_url: 'https://example.com',
    location: 'Remote',
    description:
      'Built responsive user interfaces with semantic HTML, modern CSS, and JavaScript. Collaborated on group projects using Git version control.',
    start_date: '2025-06-01',
    end_date: '2025-12-15',
    is_current: false,
    display_order: 2,
  },
];

export const DEFAULT_EDUCATION = [
  {
    id: 'edu-1',
    institution: 'University of Technology',
    degree: 'Bachelor of Science (B.Sc.)',
    field_of_study: 'Computer Science',
    description:
      'Coursework covering Data Structures, Algorithms, Database Management Systems, Object-Oriented Programming, and Software Engineering.',
    start_date: '2022-09-01',
    end_date: '2026-07-31',
    display_order: 1,
  },
];
