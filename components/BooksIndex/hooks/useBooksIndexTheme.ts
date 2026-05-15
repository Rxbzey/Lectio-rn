export const useBooksIndexTheme = (isDark: boolean) => {
  const bgColor = isDark ? 'bg-void-mid' : 'bg-parchment';
  const titleColor = isDark ? 'text-cream-bright' : 'text-ink';
  const bodyColor = isDark ? 'text-cream' : 'text-ink/70';
  const outlineColor = isDark ? 'rgba(154,143,128,0.2)' : 'rgba(10,10,8,0.16)';
  const mutedColor = isDark ? 'text-cream/60' : 'text-ink/45';

  return {
    bgColor,
    titleColor,
    bodyColor,
    outlineColor,
    mutedColor,
  };
};
