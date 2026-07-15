// Small display-formatting helpers shared across the app.

export const formatNumber = (num: number) =>
  new Intl.NumberFormat().format(Math.round(num || 0));

export const formatCompact = (num: number) =>
  num >= 1_000_000
    ? `${(num / 1_000_000).toFixed(2)}M`
    : num >= 1_000
      ? `${(num / 1_000).toFixed(1)}K`
      : `${num}`;

// Initials for portrait fallbacks, e.g. "Justia (Summer)" → "JU"
export const getInitials = (name: string) => {
  if (!name) return '?';
  const clean = name.replace(/\(.*\)/g, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};
