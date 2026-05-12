import { Pressable, Text } from 'react-native';
import { SearchResult } from '../../lib/api';
import { SearchTheme } from './hooks/useSearchTheme';

interface SearchResultItemProps {
  item: SearchResult;
  query: string;
  theme: SearchTheme;
  onPress: (bookSlug: string, chapter: number) => void;
}

function HighlightedText({
  text,
  query,
  theme,
}: {
  text: string;
  query: string;
  theme: SearchTheme;
}) {
  if (!query) return <Text style={{ color: theme.textColor, fontFamily: 'PlayfairDisplay', fontSize: 18, lineHeight: 30 }}>{text}</Text>;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return <Text style={{ color: theme.textColor, fontFamily: 'PlayfairDisplay', fontSize: 18, lineHeight: 30 }}>{text}</Text>;
  return (
    <Text style={{ color: theme.textColor, fontFamily: 'PlayfairDisplay', fontSize: 18, lineHeight: 30 }}>
      {text.slice(0, idx)}
      <Text style={{ backgroundColor: theme.gold, color: theme.highlightText, fontFamily: 'PlayfairDisplay' }}>
        {text.slice(idx, idx + query.length)}
      </Text>
      {text.slice(idx + query.length)}
    </Text>
  );
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ item, query, theme, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress(item.book.abbrev.pt, item.chapter)}
      className="flex-col gap-1 px-6"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {/* Nombre del libro */}
      <Text
        className="text-lg"
        style={{ color: theme.gold, fontFamily: 'PlayfairDisplay' }}
      >
        {item.book.name}
      </Text>
      {/* Referencia */}
      <Text
        className="text-[10px] uppercase tracking-[0.15em] mb-2"
        style={{ color: theme.mutedGold, fontFamily: 'Inter-Medium' }}
      >
        Capítulo {item.chapter}
        <Text style={{ color: theme.mutedGold }}>  ·  </Text>
        Versículo {item.number}
      </Text>
      {/* Texto del versículo */}
      <Text numberOfLines={4}>
        <HighlightedText text={item.text} query={query} theme={theme} />
      </Text>
    </Pressable>
  );
};
