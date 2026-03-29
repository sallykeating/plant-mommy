export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  if (diffDays <= 7) return `In ${diffDays} days`;
  return formatDate(dateStr);
}

export function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date(new Date().toDateString());
}

export function isDueToday(dateStr: string): boolean {
  const due = new Date(dateStr).toDateString();
  return due === new Date().toDateString();
}

export function isDueSoon(dateStr: string, withinDays = 3): boolean {
  const due = new Date(dateStr);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= withinDays;
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function healthStatusColor(status: string): string {
  const map: Record<string, string> = {
    thriving: 'text-forest bg-forest/10',
    healthy: 'text-forest-light bg-forest-light/10',
    fair: 'text-sun bg-sun/15',
    struggling: 'text-terracotta-dark bg-terracotta/20',
    critical: 'text-danger bg-danger/10',
  };
  return map[status] ?? 'text-sage bg-sage-muted/50';
}

export function careTypeIcon(type: string): string {
  const map: Record<string, string> = {
    watering: '💧',
    fertilizing: '🌱',
    misting: '🌫️',
    repotting: '🪴',
    pruning: '✂️',
    rotating: '🔄',
    cleaning: '🧹',
    other: '📝',
  };
  return map[type] ?? '📝';
}
