'use client';

import { useEffect, useState } from 'react';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export default function LoadingIndicator({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '' 
}: LoadingIndicatorProps) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-32 w-32'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-primary-600 mx-auto ${sizeClasses[size]}`}></div>
        {text && (
          <p className="mt-4 text-gray-600">{text}</p>
        )}
      </div>
    </div>
  );
}

