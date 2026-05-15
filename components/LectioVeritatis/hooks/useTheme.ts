export const useTheme = (isDark: boolean) => {
  const bgColor = isDark ? 'bg-background-dark' : 'bg-background-light';
  const textColor = isDark ? 'text-cream-bright' : 'text-ink';
  const subtextColor = isDark ? 'text-cream' : 'text-ink/70';
  const mutedColor = isDark ? 'text-cream/60' : 'text-ink/50';

  return {
    bgColor,
    textColor,
    subtextColor,
    mutedColor,
  };
};
