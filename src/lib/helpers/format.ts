/**
 * Get initials from a name
 * @param name - Full name or email
 * @returns Uppercase initials (max 2 characters)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format a date as relative time or absolute date
 * @param date - Date to format
 * @returns Formatted string (e.g., "5m ago", "2h ago", "Dec 25")
 */
export function formatDate(date: Date): string {
  const targetDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - targetDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year:
      targetDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
