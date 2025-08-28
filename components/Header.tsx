'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [savedJobsCount, setSavedJobsCount] = useState(0);

  useEffect(() => {
    // Load saved jobs count from localStorage
    const savedJobs = localStorage.getItem('savedJobs');
    if (savedJobs) {
      setSavedJobsCount(JSON.parse(savedJobs).length);
    }

    // Listen for changes to saved jobs
    const handleStorageChange = () => {
      const savedJobs = localStorage.getItem('savedJobs');
      if (savedJobs) {
        setSavedJobsCount(JSON.parse(savedJobs).length);
      } else {
        setSavedJobsCount(0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    window.addEventListener('savedJobsChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('savedJobsChanged', handleStorageChange);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold text-gray-900">JobBoard</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Jobs
            </Link>
            <Link 
              href="/saved" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors relative"
            >
              Saved Jobs
              {savedJobsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {savedJobsCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>
              <Link 
                href="/saved" 
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium relative"
                onClick={() => setIsMenuOpen(false)}
              >
                Saved Jobs
                {savedJobsCount > 0 && (
                  <span className="absolute top-2 right-3 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {savedJobsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
