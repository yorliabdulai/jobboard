'use client';

import { useEffect, useState } from 'react';

export default function LoadingIndicator() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-blue-500 transform scale-x-100 origin-left transition-transform duration-300 ease-in-out z-50" />
  );
}

