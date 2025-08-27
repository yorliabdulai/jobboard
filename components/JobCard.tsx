'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Job } from '@/lib/filters';
import { formatDate, formatSalaryRange, truncateText, getExperienceColor, getJobTypeColor } from '@/lib/formatting';

interface JobCardProps {
  job: Job;
  onSaveJob?: (jobId: string) => void;
  onUnsaveJob?: (jobId: string) => void;
  isSaved?: boolean;
}

export default function JobCard({ job, onSaveJob, onUnsaveJob, isSaved = false }: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveToggle = () => {
    if (isSaved && onUnsaveJob) {
      onUnsaveJob(job.id);
    } else if (!isSaved && onSaveJob) {
      onSaveJob(job.id);
    }
  };

  return (
    <article 
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-gray-600">
                {job.company.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                <Link href={`/jobs/${job.id}`} className="hover:text-primary-600">
                  {job.title}
                </Link>
              </h3>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {(onSaveJob || onUnsaveJob) && (
          <button
            onClick={handleSaveToggle}
            className={`p-2 rounded-full transition-colors ${
              isSaved 
                ? 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100' 
                : 'text-gray-400 hover:text-primary-600 bg-gray-50 hover:bg-primary-50'
            }`}
            aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
          >
            <svg 
              className="w-5 h-5" 
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
          </button>
        )}
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">📍 {job.location}</span>
          {job.remote && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Remote
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeColor(job.type)}`}>
            {job.type}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExperienceColor(job.experience)}`}>
            {job.experience}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          💰 {formatSalaryRange(job.salary.min, job.salary.max, job.salary.currency, job.salary.period)}
        </div>

        <div className="text-sm text-gray-500">
          📅 Posted {formatDate(job.postedAt)}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {truncateText(job.description, 150)}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.slice(0, 4).map((tag, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {tag}
          </span>
        ))}
        {job.tags.length > 4 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            +{job.tags.length - 4} more
          </span>
        )}
      </div>

      {/* View Details Button */}
      <div className="flex justify-between items-center">
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          View Details
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
