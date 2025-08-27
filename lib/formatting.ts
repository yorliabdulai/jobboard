export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : currency === 'GHS' ? 'GHS' : currency === 'NGN' ? 'NGN' : currency === 'ZAR' ? 'ZAR' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatSalaryRange(min: number, max: number, currency: string, period: string): string {
  const minFormatted = formatCurrency(min, currency);
  const maxFormatted = formatCurrency(max, currency);
  const periodText = period === 'month' ? 'month' : period === 'year' ? 'year' : period;
  
  return `${minFormatted} - ${maxFormatted} per ${periodText}`;
}

export function formatSalary(salary: { min: number; max: number; currency: string; period: string }): string {
  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };
  
  if (salary.min === salary.max) {
    return `${formatAmount(salary.min)}/${salary.period}`;
  }
  
  return `${formatAmount(salary.min)} - ${formatAmount(salary.max)}/${salary.period}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getExperienceColor(experience: string): string {
  switch (experience.toLowerCase()) {
    case 'intern':
      return 'bg-blue-100 text-blue-800';
    case 'junior':
      return 'bg-green-100 text-green-800';
    case 'mid':
      return 'bg-yellow-100 text-yellow-800';
    case 'senior':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getJobTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'full-time':
      return 'bg-green-100 text-green-800';
    case 'part-time':
      return 'bg-blue-100 text-blue-800';
    case 'contract':
      return 'bg-purple-100 text-purple-800';
    case 'internship':
      return 'bg-orange-100 text-orange-800';
    case 'remote':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
