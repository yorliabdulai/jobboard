interface EmptyStateProps {
  title?: string;
  description?: string;
  showResetButton?: boolean;
  onReset?: () => void;
}

export default function EmptyState({ 
  title = "No jobs found", 
  description = "Try adjusting your search criteria or filters to find more opportunities.",
  showResetButton = false,
  onReset
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="mx-auto max-w-md">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
          <svg 
            className="h-6 w-6 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-6">
          {description}
        </p>

        {/* Action Button */}
        {showResetButton && onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filters
          </button>
        )}

        {/* Suggestions */}
        <div className="mt-6 text-left max-w-sm mx-auto">
          <p className="text-xs font-medium text-gray-700 mb-2">Try these suggestions:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Check your spelling</li>
            <li>• Use more general keywords</li>
            <li>• Remove some filters</li>
            <li>• Try different locations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
