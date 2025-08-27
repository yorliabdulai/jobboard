'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import FilterBar from '@/components/FilterBar';
import JobCard from '@/components/JobCard';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { Job, FilterOptions, applySearch, applyFilters, applySort, paginate } from '@/lib/filters';

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

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const jobsPerPage = 10;

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  // Get URL parameters
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || '';
    const location = searchParams.get('location') || '';
    const remote = searchParams.get('remote');
    const salaryMin = searchParams.get('salaryMin');
    const salaryMax = searchParams.get('salaryMax');
    const experience = searchParams.get('experience') || '';

    setCurrentPage(page);
    setSearchQuery(query);
    
    const filters: FilterOptions = {};
    if (type) filters.type = type;
    if (location) filters.location = location;
    if (remote !== null) filters.remote = remote === 'true';
    if (salaryMin) filters.salaryMin = parseInt(salaryMin);
    if (salaryMax) filters.salaryMax = parseInt(salaryMax);
    if (experience) filters.experience = experience;
    
    setActiveFilters(filters);
  }, [searchParams]);

  // Apply search and filters
  useEffect(() => {
    let result = [...jobs];
    
    // Apply search
    if (searchQuery) {
      result = applySearch(result, searchQuery);
    }
    
    // Apply filters
    if (Object.keys(activeFilters).length > 0) {
      result = applyFilters(result, activeFilters);
    }
    
    // Apply sorting (newest first)
    result = applySort(result, 'postedAt', 'desc');
    
    setFilteredJobs(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [jobs, searchQuery, activeFilters]);

  // Handle search
  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  // Handle filters change
  const handleFiltersChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle save/unsave job
  const handleSaveJob = (jobId: string) => {
    const newSavedJobs = [...savedJobs, jobId];
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  const handleUnsaveJob = (jobId: string) => {
    const newSavedJobs = savedJobs.filter(id => id !== jobId);
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  // Get paginated results
  const { jobs: paginatedJobs, total, totalPages } = paginate(filteredJobs, currentPage, jobsPerPage);

  // Reset filters
  const resetFilters = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Next Career Opportunity
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover thousands of job opportunities across various industries. 
              Search, filter, and apply to jobs that match your skills and career goals.
            </p>
            <SearchBox onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Filters */}
      <FilterBar jobs={jobs} onFiltersChange={handleFiltersChange} />

      {/* Main Content */}
      <div id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {filteredJobs.length === 0 ? 'No jobs found' : `${filteredJobs.length} job${filteredJobs.length === 1 ? '' : 's'} found`}
          </h2>
          {(searchQuery || Object.keys(activeFilters).length > 0) && (
            <p className="text-gray-600">
              Showing results for {searchQuery && `"${searchQuery}"`} 
              {searchQuery && Object.keys(activeFilters).length > 0 && ' and '}
              {Object.keys(activeFilters).length > 0 && 'applied filters'}
            </p>
          )}
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSaveJob={handleSaveJob}
                onUnsaveJob={handleUnsaveJob}
                isSaved={savedJobs.includes(job.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            showResetButton={true}
            onReset={resetFilters}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalJobs={total}
            jobsPerPage={jobsPerPage}
          />
        )}
      </div>
    </div>
  );
}
