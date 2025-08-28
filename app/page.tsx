'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import FilterBar from '@/components/FilterBar';
import JobCard from '@/components/JobCard';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import LoadingIndicator from '@/components/LoadingIndicator';
import { Job, FilterOptions, applySearch, applyFilters, applySort, paginate } from '@/lib/filters';
import { getAllJobs } from '@/lib/jobs';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const jobsPerPage = 12;

  // Load jobs data synchronously from the jobs module
  useEffect(() => {
    try {
      const jobsData = getAllJobs();
      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    if (jobs.length === 0) return;
    
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
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle save/unsave job
  const handleSaveJob = (jobId: string) => {
    const newSavedJobs = [...savedJobs, jobId];
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
    // Dispatch custom event to update header counter
    window.dispatchEvent(new Event('savedJobsChanged'));
  };

  const handleUnsaveJob = (jobId: string) => {
    const newSavedJobs = savedJobs.filter(id => id !== jobId);
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
    // Dispatch custom event to update header counter
    window.dispatchEvent(new Event('savedJobsChanged'));
  };

  // Get paginated results
  const { jobs: paginatedJobs, total, totalPages } = paginate(filteredJobs, currentPage, jobsPerPage);

  // Reset filters
  const resetFilters = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingIndicator size="large" text="Loading jobs..." className="min-h-screen" />
      </div>
    );
  }

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
            <div className="mt-6">
              <Link
                href="/saved"
                className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 bg-white rounded-md hover:bg-primary-50 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                View Saved Jobs ({savedJobs.length})
              </Link>
            </div>
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
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalJobs={total}
              jobsPerPage={jobsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}


