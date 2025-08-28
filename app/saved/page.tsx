'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import JobCard from '@/components/JobCard';
import SearchBox from '@/components/SearchBox';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import LoadingIndicator from '@/components/LoadingIndicator';
import { Job, FilterOptions, applySearch, applyFilters, applySort, paginate } from '@/lib/filters';

// Import jobs from external data file
import jobsData from '@/data/jobs.json';

export default function SavedJobsPage() {
  const router = useRouter();
  
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const jobsPerPage = 12; // Increased from 10 for better UX

  // Load saved jobs from localStorage and jobs data
  useEffect(() => {
    const savedIds = localStorage.getItem('savedJobs');
    if (savedIds) {
      const ids = JSON.parse(savedIds);
      setSavedJobIds(ids);
      
      // Filter to only include saved jobs from the full jobs data
      const saved = jobsData.filter(job => ids.includes(job.id));
      setSavedJobs(saved);
      setFilteredJobs(saved);
    }
    setIsLoading(false);
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
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <div className="min-h-screen bg-gray-50">
        <LoadingIndicator size="large" text="Loading your saved jobs..." className="min-h-screen" />
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
