'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JobCard from '@/components/JobCard';
import SearchBox from '@/components/SearchBox';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import { Job, FilterOptions, applySearch, applyFilters, applySort, paginate } from '@/lib/filters';

export default function SavedJobsPage() {
  const router = useRouter();
  
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const jobsPerPage = 10;

  // Load saved jobs from localStorage and mock data
  useEffect(() => {
    const savedIds = localStorage.getItem('savedJobs');
    if (savedIds) {
      const ids = JSON.parse(savedIds);
      setSavedJobIds(ids);
      
      // Load the actual job data for saved jobs
      // In a real app, this would be an API call
      const loadSavedJobs = async () => {
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Get mock jobs data (in real app, fetch from API)
          // This should match the data structure from the main page
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
          
          // Filter to only include saved jobs
          const saved = mockJobs.filter(job => ids.includes(job.id));
          setSavedJobs(saved);
          setFilteredJobs(saved);
        } catch (error) {
          console.error('Error loading saved jobs:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadSavedJobs();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Apply search and filters
  useEffect(() => {
    let result = [...savedJobs];
    
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
  }, [savedJobs, searchQuery, activeFilters]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filters change
  const handleFiltersChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle unsave job
  const handleUnsaveJob = (jobId: string) => {
    const newSavedJobIds = savedJobIds.filter(id => id !== jobId);
    setSavedJobIds(newSavedJobIds);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobIds));
    
    // Remove from saved jobs list
    const newSavedJobs = savedJobs.filter(job => job.id !== jobId);
    setSavedJobs(newSavedJobs);
    
    // Dispatch custom event to update header counter
    window.dispatchEvent(new Event('savedJobsChanged'));
  };

  // Handle save job (in case user wants to re-save)
  const handleSaveJob = (jobId: string) => {
    const newSavedJobIds = [...savedJobIds, jobId];
    setSavedJobIds(newSavedJobIds);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobIds));
    
    // Dispatch custom event to update header counter
    window.dispatchEvent(new Event('savedJobsChanged'));
  };

  // Get paginated results
  const { jobs: paginatedJobs, total, totalPages } = paginate(filteredJobs, currentPage, jobsPerPage);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveFilters({});
  };

  // Go back to main jobs page
  const goToMainJobs = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your saved jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
              <p className="text-gray-600">
                {savedJobs.length === 0 
                  ? "You haven't saved any jobs yet" 
                  : `You have ${savedJobs.length} saved job${savedJobs.length === 1 ? '' : 's'}`
                }
              </p>
            </div>
            <button
              onClick={goToMainJobs}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Browse All Jobs
            </button>
          </div>
          
          {savedJobs.length > 0 && (
            <SearchBox onSearch={handleSearch} placeholder="Search saved jobs..." />
          )}
        </div>
      </section>

      {/* Filters */}
      {savedJobs.length > 0 && (
        <FilterBar jobs={savedJobs} onFiltersChange={handleFiltersChange} />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {filteredJobs.length === 0 
              ? (savedJobs.length === 0 ? 'No saved jobs' : 'No jobs match your criteria') 
              : `${filteredJobs.length} job${filteredJobs.length === 1 ? '' : 's'} found`
            }
          </h2>
          {(searchQuery || Object.keys(activeFilters).length > 0) && (
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                Showing results for {searchQuery && `"${searchQuery}"`} 
                {searchQuery && Object.keys(activeFilters).length > 0 && ' and '}
                {Object.keys(activeFilters).length > 0 && 'applied filters'}
              </p>
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all
              </button>
            </div>
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
                isSaved={savedJobIds.includes(job.id)}
              />
            ))}
          </div>
        ) : savedJobs.length > 0 ? (
          <EmptyState 
            showResetButton={true}
            onReset={clearAllFilters}
            title="No jobs match your criteria"
            description="Try adjusting your search or filters to find more jobs."
          />
        ) : (
          <EmptyState 
            showResetButton={true}
            onReset={goToMainJobs}
            title="No saved jobs yet"
            description="Start browsing jobs and save the ones that interest you. Your saved jobs will appear here for easy access."
            buttonText="Browse Jobs"
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
