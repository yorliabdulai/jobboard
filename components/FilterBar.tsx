'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterOptions, Job } from '@/lib/filters';
import { getUniqueValues, getSalaryRange } from '@/lib/filters';

interface FilterBarProps {
  jobs: Job[];
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function FilterBar({ jobs, onFiltersChange }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique values for filter options
  const jobTypes = getUniqueValues(jobs, 'type');
  const locations = getUniqueValues(jobs, 'location');
  const experiences = getUniqueValues(jobs, 'experience');
  const salaryRange = getSalaryRange(jobs);

  useEffect(() => {
    const newFilters: FilterOptions = {};
    
    if (searchParams.get('type')) newFilters.type = searchParams.get('type')!;
    if (searchParams.get('location')) newFilters.location = searchParams.get('location')!;
    if (searchParams.get('remote')) newFilters.remote = searchParams.get('remote') === 'true';
    if (searchParams.get('salaryMin')) newFilters.salaryMin = parseInt(searchParams.get('salaryMin')!);
    if (searchParams.get('salaryMax')) newFilters.salaryMax = parseInt(searchParams.get('salaryMax')!);
    if (searchParams.get('experience')) newFilters.experience = searchParams.get('experience')!;
    
    setFilters(newFilters);
  }, [searchParams]);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
    router.push('/');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== null && value !== '');

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Basic Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Job Type */}
            <select
              value={filters.type || ''}
              onChange={(e) => updateFilters({ type: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Location */}
            <select
              value={filters.location || ''}
              onChange={(e) => updateFilters({ location: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            {/* Remote */}
            <select
              value={filters.remote === undefined ? '' : filters.remote ? 'true' : 'false'}
              onChange={(e) => updateFilters({ remote: e.target.value === '' ? undefined : e.target.value === 'true' })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Work Types</option>
              <option value="true">Remote Only</option>
              <option value="false">On-site Only</option>
            </select>

            {/* Experience */}
            <select
              value={filters.experience || ''}
              onChange={(e) => updateFilters({ experience: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Experience</option>
              {experiences.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {isExpanded ? 'Hide' : 'Show'} Advanced Filters
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Salary Range:</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.salaryMin || ''}
                  onChange={(e) => updateFilters({ salaryMin: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.salaryMax || ''}
                  onChange={(e) => updateFilters({ salaryMax: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <span className="text-sm text-gray-500">USD</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
