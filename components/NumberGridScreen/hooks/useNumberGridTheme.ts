export interface NumberGridTheme {
  bg: string;
  gold: string;
  completed: string;
  textColor: string;
  mutedText: string;
  cellBg: string;
  cellBgActive: string;
  cellBgCompleted: string;
}

export function useNumberGridTheme(isDark: boolean): NumberGridTheme {
  return {
    bg:           isDark ? '#000000'                : '#efe6d4',
    gold:         isDark ? '#c5a059'                : '#775a19',
    completed:    isDark ? '#7d9b76'                : '#4a7c59',
    textColor:    isDark ? '#c9c4b8'                : '#3d3629',
    mutedText:    isDark ? 'rgba(201,196,184,0.50)' : 'rgba(61,54,41,0.45)',
    cellBg:          isDark ? 'rgba(197,160,89,0.08)'  : 'rgba(119,90,25,0.06)',
    cellBgActive:    isDark ? 'rgba(197,160,89,0.22)'  : 'rgba(119,90,25,0.16)',
    cellBgCompleted: isDark ? 'rgba(125,155,118,0.22)' : 'rgba(74,124,89,0.18)',
  };
}
