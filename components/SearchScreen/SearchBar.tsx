import { Pressable, Text, TextInput, View } from 'react-native';
import { SearchTheme } from './hooks/useSearchTheme';

interface SearchBarProps {
  query: string;
  resultCount: number;
  searched: boolean;
  onChangeText: (text: string) => void;
  onClear: () => void;
  inputRef: React.RefObject<TextInput | null>;
  theme: SearchTheme;
  paddingTop: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  resultCount,
  searched,
  onChangeText,
  onClear,
  inputRef,
  theme,
  paddingTop,
}) => {
  const countLabel = resultCount === 80 ? 'Más de 80 coincidencias' : `${resultCount} Coincidencia${resultCount !== 1 ? 's' : ''}`;

  return (
    <View className="px-6 mb-8" style={{ paddingTop }}>
      {/* Label superior */}
      <Text
        className="text-[10px] uppercase tracking-[0.2em] mb-1"
        style={{ color: theme.mutedGold, fontFamily: 'Inter-Medium' }}
      >
        Buscar en toda la Biblia
      </Text>

      {/* Input con border-bottom gold */}
      <View
        className="flex-row items-center pb-1"
        style={{ borderBottomWidth: 1, borderBottomColor: theme.gold }}
      >
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={onChangeText}
          placeholder="Palabra o frase…"
          placeholderTextColor={theme.mutedText}
          className="flex-1"
          style={{
            fontFamily: 'PlayfairDisplay',
            fontSize: 24,
            color: theme.textColor,
            paddingVertical: 4,
            backgroundColor: 'transparent',
          }}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 ? (
          <Pressable onPress={onClear} hitSlop={12} className="pl-3">
            <Text style={{ color: theme.mutedText, fontSize: 16, lineHeight: 24 }}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Contador de coincidencias */}
      {searched && resultCount > 0 ? (
        <Text
          className="text-[10px] uppercase tracking-[0.1em] mt-2"
          style={{ color: theme.gold, fontFamily: 'Inter-Medium' }}
        >
          {countLabel}
        </Text>
      ) : null}
    </View>
  );
};
