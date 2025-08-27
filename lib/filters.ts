export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  remote: boolean;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  experience: string;
  postedAt: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  companyLogo: string;
}

export interface FilterOptions {
  type?: string;
  location?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  experience?: string;
}

export function applySearch(data: Job[], query: string): Job[] {
  if (!query.trim()) return data;
  
  const searchTerm = query.toLowerCase().trim();
  
  return data.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(searchTerm);
    const companyMatch = job.company.toLowerCase().includes(searchTerm);
    const tagsMatch = job.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    const descriptionMatch = job.description.toLowerCase().substring(0, 200).includes(searchTerm);
    
    return titleMatch || companyMatch || tagsMatch || descriptionMatch;
  });
}

export function applyFilters(data: Job[], filters: FilterOptions): Job[] {
  return data.filter(job => {
    // Type filter
    if (filters.type && job.type !== filters.type) return false;
    
    // Location filter
    if (filters.location && job.location !== filters.location) return false;
    
    // Remote filter
    if (filters.remote !== undefined && job.remote !== filters.remote) return false;
    
    // Salary range filter
    if (filters.salaryMin && job.salary.max < filters.salaryMin) return false;
    if (filters.salaryMax && job.salary.min > filters.salaryMax) return false;
    
    // Experience filter
    if (filters.experience && job.experience !== filters.experience) return false;
    
    return true;
  });
}

export function applySort(data: Job[], key: keyof Job = 'postedAt', direction: 'asc' | 'desc' = 'desc'): Job[] {
  return [...data].sort((a, b) => {
    let aValue: any = a[key];
    let bValue: any = b[key];
    
    // Handle date sorting
    if (key === 'postedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    // Handle salary sorting (use max salary for comparison)
    if (key === 'salary') {
      aValue = a.salary.max;
      bValue = b.salary.max;
    }
    
    if (direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

export function paginate(data: Job[], page: number, perPage: number): { jobs: Job[]; total: number; totalPages: number } {
  const total = data.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  
  const jobs = data.slice(startIndex, endIndex);
  
  return { jobs, total, totalPages };
}

export function getUniqueValues(data: Job[], field: keyof Job): string[] {
  const values = data.map(job => job[field]);
  return [...new Set(values)].filter(Boolean).sort();
}

export function getSalaryRange(data: Job[]): { min: number; max: number } {
  const salaries = data.flatMap(job => [job.salary.min, job.salary.max]);
  return {
    min: Math.min(...salaries),
    max: Math.max(...salaries)
  };
}
