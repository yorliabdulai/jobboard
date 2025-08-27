'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Job } from '@/lib/filters';
import { formatDate, formatSalaryRange, getExperienceColor, getJobTypeColor } from '@/lib/formatting';

// Mock data - in a real app, this would come from an API
const mockJobs: Job[] = [
  {
    "id": "jb_0001",
    "title": "Frontend Developer",
    "company": "Acme Labs",
    "location": "Accra, GH",
    "type": "Full-time",
    "remote": true,
    "salary": { "min": 6000, "max": 9000, "currency": "GHS", "period": "month" },
    "experience": "Junior",
    "postedAt": "2025-01-18",
    "tags": ["React", "TypeScript", "Next.js"],
    "description": "We're looking for a passionate Frontend Developer to join our growing team. You'll work on building beautiful, responsive user interfaces and contribute to our product development.",
    "responsibilities": ["Build responsive UI components", "Write clean, maintainable code", "Collaborate with design and backend teams", "Write unit tests"],
    "requirements": ["1+ year experience with React", "Proficiency in TypeScript", "Knowledge of modern CSS and responsive design", "Experience with Git"],
    "benefits": ["Health insurance", "Remote work stipend", "Learning budget", "Flexible hours"],
    "companyLogo": "/logo.svg"
  },
  {
    "id": "jb_0002",
    "title": "Senior Backend Engineer",
    "company": "TechCorp Solutions",
    "location": "Lagos, NG",
    "type": "Full-time",
    "remote": false,
    "salary": { "min": 12000, "max": 18000, "currency": "NGN", "period": "month" },
    "experience": "Senior",
    "postedAt": "2025-01-17",
    "tags": ["Node.js", "Python", "PostgreSQL", "AWS"],
    "description": "Join our engineering team to build scalable backend services and APIs. You'll lead technical decisions and mentor junior developers.",
    "responsibilities": ["Design and implement backend services", "Optimize database performance", "Lead code reviews", "Mentor junior developers"],
    "requirements": ["5+ years backend development", "Expert in Node.js or Python", "Experience with cloud platforms", "Strong system design skills"],
    "benefits": ["Competitive salary", "Health coverage", "Stock options", "Conference attendance"],
    "companyLogo": "/logo.svg"
  },
  {
    "id": "jb_0003",
    "title": "UI/UX Designer",
    "company": "Creative Studio",
    "location": "Nairobi, KE",
    "type": "Contract",
    "remote": true,
    "salary": { "min": 8000, "max": 12000, "currency": "USD", "period": "month" },
    "experience": "Mid",
    "postedAt": "2025-01-16",
    "tags": ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    "description": "We need a talented designer to create intuitive user experiences and beautiful interfaces for our digital products.",
    "responsibilities": ["Create user interface designs", "Conduct user research", "Build interactive prototypes", "Collaborate with development team"],
    "requirements": ["3+ years UI/UX experience", "Proficiency in Figma", "Portfolio of web/mobile designs", "Understanding of user-centered design"],
    "benefits": ["Flexible schedule", "Remote work", "Creative freedom", "Competitive rate"],
    "companyLogo": "/logo.svg"
  },
  {
    "id": "jb_0004",
    "title": "DevOps Engineer",
    "company": "CloudTech Inc",
    "location": "Cairo, EG",
    "type": "Full-time",
    "remote": true,
    "salary": { "min": 7000, "max": 11000, "currency": "USD", "period": "month" },
    "experience": "Mid",
    "postedAt": "2025-01-15",
    "tags": ["Docker", "Kubernetes", "AWS", "CI/CD"],
    "description": "Help us build and maintain robust infrastructure and deployment pipelines. You'll work with cutting-edge cloud technologies.",
    "responsibilities": ["Manage cloud infrastructure", "Automate deployment processes", "Monitor system performance", "Implement security best practices"],
    "requirements": ["3+ years DevOps experience", "Experience with AWS/Azure", "Knowledge of containerization", "Scripting skills (Python/Bash)"],
    "benefits": ["Remote work", "Health insurance", "Learning opportunities", "Modern tech stack"],
    "companyLogo": "/logo.svg"
  },
  {
    "id": "jb_0005",
    "title": "Data Scientist",
    "company": "Analytics Pro",
    "location": "Johannesburg, ZA",
    "type": "Full-time",
    "remote": false,
    "salary": { "min": 15000, "max": 22000, "currency": "ZAR", "period": "month" },
    "experience": "Senior",
    "postedAt": "2025-01-14",
    "tags": ["Python", "Machine Learning", "SQL", "Statistics"],
    "description": "Join our data team to extract insights from complex datasets and build predictive models that drive business decisions.",
    "responsibilities": ["Analyze large datasets", "Build ML models", "Create data visualizations", "Present findings to stakeholders"],
    "requirements": ["5+ years data science experience", "Strong Python skills", "ML/AI expertise", "Statistical analysis background"],
    "benefits": ["Competitive salary", "Health benefits", "Data science conferences", "Research opportunities"],
    "companyLogo": "/logo.svg"
  }
];

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const jobId = params.id as string;
    const foundJob = mockJobs.find(j => j.id === jobId);
    
    if (foundJob) {
      setJob(foundJob);
      // Check if job is saved
      const savedJobs = localStorage.getItem('savedJobs');
      if (savedJobs) {
        const savedJobIds = JSON.parse(savedJobs);
        setIsSaved(savedJobIds.includes(jobId));
      }
    }
    
    setIsLoading(false);
  }, [params.id]);

  const handleSaveToggle = () => {
    if (!job) return;
    
    const savedJobs = localStorage.getItem('savedJobs');
    let savedJobIds = savedJobs ? JSON.parse(savedJobs) : [];
    
    if (isSaved) {
      savedJobIds = savedJobIds.filter((id: string) => id !== job.id);
    } else {
      savedJobIds.push(job.id);
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(savedJobIds));
    setIsSaved(!isSaved);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">
              Jobs
            </Link>
            <span>/</span>
            <span className="text-gray-900">{job.title}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {job.company.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-600 font-medium">{job.company}</p>
                </div>
              </div>

              {/* Job Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📍</span>
                  <span className="text-gray-700">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">💰</span>
                  <span className="text-gray-700">{formatSalaryRange(job.salary.min, job.salary.max, job.salary.currency, job.salary.period)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📅</span>
                  <span className="text-gray-700">Posted {formatDate(job.postedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🏢</span>
                  <span className="text-gray-700">{job.type}</span>
                </div>
              </div>

              {/* Tags and Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.type)}`}>
                  {job.type}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(job.experience)}`}>
                  {job.experience}
                </span>
                {job.remote && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Remote
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-6 lg:mt-0 lg:ml-6">
              <button
                onClick={handleSaveToggle}
                className={`inline-flex items-center justify-center px-6 py-3 border rounded-md text-sm font-medium transition-colors ${
                  isSaved 
                    ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <svg 
                  className={`mr-2 h-5 w-5 ${isSaved ? 'text-red-600' : 'text-gray-400'}`}
                  fill={isSaved ? 'currentColor' : 'none'} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
                {isSaved ? 'Saved' : 'Save Job'}
              </button>

              <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-gray-700">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.company}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📍</span>
                  <span className="text-gray-700">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🏢</span>
                  <span className="text-gray-700">{job.type} position</span>
                </div>
                {job.remote && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🌐</span>
                    <span className="text-gray-700">Remote work available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Apply */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Apply</h3>
              <p className="text-gray-600 text-sm mb-4">
                Ready to take the next step? Apply now and join our team!
              </p>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                Apply for this position
              </button>
            </div>

            {/* Back to Jobs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Link 
                href="/"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                ← Back to All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
