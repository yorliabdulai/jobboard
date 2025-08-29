'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  jobsPerPage: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, totalJobs, jobsPerPage, onPageChange }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size safely
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Only run on client side
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const updatePage = (page: number) => {
    // Call the callback if provided
    if (onPageChange) {
      onPageChange(page);
    }
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && currentPage > 1) {
        updatePage(currentPage - 1);
      } else if (event.key === 'ArrowRight' && currentPage < totalPages) {
        updatePage(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  const getVisiblePages = () => {
    // For mobile, show fewer pages
    const delta = isMobile ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();
  const startJob = (currentPage - 1) * jobsPerPage + 1;
  const endJob = Math.min(currentPage * jobsPerPage, totalJobs);

  return (
    <div className="bg-white px-4 py-4 flex items-center justify-between border border-gray-200 sm:px-6 rounded-lg shadow-sm">
      {/* Mobile Layout - Simple Previous/Next */}
      <div className="flex-1 flex justify-between sm:hidden pagination-mobile">
        <button
          onClick={() => updatePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px] justify-center pagination-button"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        {/* Mobile Page Indicator */}
        <div className="flex items-center px-4 py-2">
          <span className="text-sm text-gray-600 font-medium">
            {currentPage} of {totalPages}
          </span>
        </div>
        
        <button
          onClick={() => updatePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px] justify-center pagination-button"
          aria-label="Next page"
        >
          Next
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Desktop Layout - Full Pagination */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        {/* Results Info */}
        <div className="flex-shrink-0">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startJob}</span> to{' '}
            <span className="font-medium">{endJob}</span> of{' '}
            <span className="font-medium">{totalJobs.toLocaleString()}</span> results
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Pagination Navigation */}
        <div className="flex-shrink-0">
          <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px pagination-desktop" aria-label="Pagination">
            {/* Previous Button */}
            <button
              onClick={() => updatePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[44px] justify-center pagination-button"
              aria-label="Previous page"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Page Numbers */}
            {visiblePages.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && updatePage(page)}
                disabled={typeof page !== 'number'}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors min-w-[44px] justify-center pagination-button ${
                  page === currentPage
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                    : typeof page === 'number'
                    ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    : 'bg-white border-gray-300 text-gray-500 cursor-default'
                }`}
                aria-label={typeof page === 'number' ? `Page ${page}` : undefined}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => updatePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[44px] justify-center pagination-button"
              aria-label="Next page"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>

      {/* Large Screen Layout - Enhanced with Quick Navigation */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:ml-8">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Go to:</span>
          <div className="flex items-center">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  updatePage(page);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt(e.currentTarget.value);
                  if (page >= 1 && page <= totalPages) {
                    updatePage(page);
                  }
                }
              }}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              aria-label="Go to page number"
            />
            <span className="ml-2 text-sm text-gray-500">of {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
