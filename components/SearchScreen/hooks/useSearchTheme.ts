export interface SearchTheme {
  bg: string;
  gold: string;
  mutedGold: string;
  textColor: string;
  mutedText: string;
  highlightText: string;
}

export function useSearchTheme(isDark: boolean): SearchTheme {
  return {
    bg:            isDark ? '#050505'                : '#efe6d4',
    gold:          isDark ? '#c5a059'               : '#775a19',
    mutedGold:     isDark ? 'rgba(197,160,89,0.5)'  : 'rgba(119,90,25,0.5)',
    textColor:     isDark ? 'rgba(226,226,226,0.8)' : 'rgba(23,18,11,0.8)',
    mutedText:     isDark ? 'rgba(226,226,226,0.4)' : 'rgba(23,18,11,0.4)',
    highlightText: '#000000',
  };
}
