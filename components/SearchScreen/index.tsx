import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type SearchResult } from '../../lib/api';
import { useSearch } from './hooks/useSearch';
import { useSearchTheme } from './hooks/useSearchTheme';
import { SearchBar } from './SearchBar';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchResultItem } from './SearchResultItem';

interface SearchScreenProps {
  isDark: boolean;
  appBarHeight?: number;
  onResultPress: (bookSlug: string, chapter: number) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ isDark, appBarHeight, onResultPress }) => {
  const insets = useSafeAreaInsets();
  const headerTop = appBarHeight ?? insets.top + 16;
  const theme = useSearchTheme(isDark);
  const { query, setQuery, results, loading, searched, inputRef } = useSearch();

  const renderItem = ({ item }: { item: SearchResult }) => (
    <SearchResultItem
      item={item}
      query={query.trim()}
      theme={theme}
      onPress={onResultPress}
    />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      {/* Header tipográfico */}
      <View className="px-6 flex-row justify-between items-start" style={{ paddingTop: headerTop }}>
        <View className="flex-1 gap-1">
          <Text
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: theme.mutedGold, fontFamily: 'Inter-Medium' }}
          >
            Motor de Búsqueda
          </Text>
          <Text
            className="text-3xl leading-tight"
            style={{ color: theme.textColor, fontFamily: 'PlayfairDisplay' }}
          >
            Buscar en las Escrituras
          </Text>
        </View>
      </View>

      {/* Search input + contador */}
      <SearchBar
        query={query}
        resultCount={results.length}
        searched={searched}
        onChangeText={setQuery}
        onClear={() => setQuery('')}
        inputRef={inputRef}
        theme={theme}
        paddingTop={24}
      />

      {/* Estados y resultados */}
      {loading ? (
        <View className="flex-1 items-center justify-center gap-4">
          <ActivityIndicator color={theme.gold} />
          <Text
            className="text-[13px]"
            style={{ color: theme.mutedText, fontFamily: 'Inter' }}
          >
            Buscando…
          </Text>
        </View>
      ) : searched && results.length === 0 ? (
        <SearchEmptyState variant="no-results" query={query} theme={theme} />
      ) : !searched && !query ? (
        <SearchEmptyState variant="idle" theme={theme} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.book.abbrev.pt}-${item.chapter}-${item.number}`}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View className="h-12" />}
          contentContainerStyle={{ paddingBottom: insets.bottom + 96, paddingTop: 8 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};
