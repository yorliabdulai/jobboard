'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Job } from '@/lib/filters';
import { formatDate, formatSalaryRange, getExperienceColor, getJobTypeColor } from '@/lib/formatting';
import LoadingIndicator from '@/components/LoadingIndicator';
import { getJobById } from '@/lib/jobs';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
    const jobId = params.id as string;
      const foundJob = getJobById(jobId);
    
    if (foundJob) {
      setJob(foundJob);
      // Check if job is saved
      const savedJobs = localStorage.getItem('savedJobs');
      if (savedJobs) {
        const savedJobIds = JSON.parse(savedJobs);
        setIsSaved(savedJobIds.includes(jobId));
      }
    }
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
    setIsLoading(false);
    }
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
    
    // Dispatch custom event to update header counter
    window.dispatchEvent(new Event('savedJobsChanged'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingIndicator size="large" text="Loading job details..." />
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
      <div id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-8">
        {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
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
                  {job.tags && job.tags.length > 0 && (
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
                )}
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

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">{job.description}</p>
                {job.requirements && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
              </ul>
            </div>
                )}
                {job.responsibilities && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
              </ul>
            </div>
                )}
              </div>
            </div>

            {/* Company Culture */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Culture</h2>
              <p className="text-gray-700 mb-4">
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

