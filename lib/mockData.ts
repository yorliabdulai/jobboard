import { Job } from './filters';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    remote: true,
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD',
      period: 'year'
    },
    experience: 'Senior',
    postedAt: '2024-01-15',
    tags: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    description: 'We are looking for a Senior Frontend Developer to join our team and help build amazing user experiences.',
    responsibilities: [
      'Lead frontend development initiatives',
      'Mentor junior developers',
      'Architect scalable frontend solutions'
    ],
    requirements: [
      '5+ years of React experience',
      'Strong TypeScript skills',
      'Experience with modern frontend tools'
    ],
    benefits: [
      'Competitive salary',
      'Remote work options',
      'Health insurance',
      '401k matching'
    ],
    companyLogo: '/company-logos/techcorp.png'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'Full-time',
    remote: false,
    salary: {
      min: 100000,
      max: 150000,
      currency: 'USD',
      period: 'year'
    },
    experience: 'Mid-level',
    postedAt: '2024-01-14',
    tags: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
    description: 'Join our fast-growing startup and help build the next big thing in tech.',
    responsibilities: [
      'Develop full-stack features',
      'Collaborate with design team',
      'Write clean, maintainable code'
    ],
    requirements: [
      '3+ years of full-stack experience',
      'Proficiency in JavaScript/Node.js',
      'Experience with React and databases'
    ],
    benefits: [
      'Equity options',
      'Flexible work hours',
      'Professional development',
      'Team events'
    ],
    companyLogo: '/company-logos/startupxyz.png'
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'Austin, TX',
    type: 'Contract',
    remote: true,
    salary: {
      min: 80000,
      max: 120000,
      currency: 'USD',
      period: 'year'
    },
    experience: 'Mid-level',
    postedAt: '2024-01-13',
    tags: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    description: 'Create beautiful and intuitive user experiences for our digital products.',
    responsibilities: [
      'Design user interfaces',
      'Conduct user research',
      'Create design systems',
      'Collaborate with developers'
    ],
    requirements: [
      '3+ years of UI/UX experience',
      'Proficiency in design tools',
      'Portfolio of work',
      'Understanding of user-centered design'
    ],
    benefits: [
      'Remote work',
      'Flexible schedule',
      'Creative freedom',
      'Competitive pay'
    ],
    companyLogo: '/company-logos/designstudio.png'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Seattle, WA',
    type: 'Full-time',
    remote: true,
    salary: {
      min: 130000,
      max: 190000,
      currency: 'USD',
      period: 'year'
    },
    experience: 'Senior',
    postedAt: '2024-01-12',
    tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    description: 'Help us build and maintain robust cloud infrastructure and deployment pipelines.',
    responsibilities: [
      'Manage cloud infrastructure',
      'Automate deployment processes',
      'Monitor system performance',
      'Implement security best practices'
    ],
    requirements: [
      '5+ years of DevOps experience',
      'Strong AWS knowledge',
      'Experience with containerization',
      'Infrastructure as code experience'
    ],
    benefits: [
      'Competitive salary',
      'Remote work',
      'Health benefits',
      'Professional development',
      '401k matching'
    ],
    companyLogo: '/company-logos/cloudtech.png'
  },
  {
    id: '5',
    title: 'Product Manager',
    company: 'ProductHub',
    location: 'Boston, MA',
    type: 'Full-time',
    remote: false,
    salary: {
      min: 110000,
      max: 160000,
      currency: 'USD',
      period: 'year'
    },
    experience: 'Mid-level',
    postedAt: '2024-01-11',
    tags: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis'],
    description: 'Drive product strategy and execution for our innovative SaaS platform.',
    responsibilities: [
      'Define product roadmap',
      'Gather and prioritize requirements',
      'Work with cross-functional teams',
      'Analyze user feedback and data'
    ],
    requirements: [
      '3+ years of product management experience',
      'Strong analytical skills',
      'Experience with agile methodologies',
      'Excellent communication skills'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      'Flexible work arrangements',
      'Professional development',
      'Team building events'
    ],
    companyLogo: '/company-logos/producthub.png'
  },
  {
    id: '6',
    title: 'Backend Developer',
    company: 'DataSystems',
    location: 'Denver, CO',
    type: 'Full-time',
    remote: true,
    salary: {
      min: 95000,
      max: 140000,
      currency: 'USD',
      period: 'year'
    },
    experience: 'Mid-level',
    postedAt: '2024-01-10',
    tags: ['Python', 'Django', 'PostgreSQL', 'Redis', 'API Development'],
    description: 'Build scalable backend services and APIs for our data processing platform.',
    responsibilities: [
      'Develop RESTful APIs',
      'Design database schemas',
      'Optimize performance',
      'Write unit tests'
    ],
    requirements: [
      '3+ years of backend development experience',
      'Strong Python skills',
      'Experience with databases',
      'Understanding of API design principles'
    ],
    benefits: [
      'Remote work options',
      'Competitive salary',
      'Health benefits',
      'Professional development',
      'Flexible hours'
    ],
    companyLogo: '/company-logos/datasystems.png'
  }
];
