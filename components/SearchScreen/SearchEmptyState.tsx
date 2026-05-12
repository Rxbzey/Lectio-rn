import { Text, View } from 'react-native';
import { SearchTheme } from './hooks/useSearchTheme';

type EmptyStateVariant = 'idle' | 'no-results';

interface SearchEmptyStateProps {
  variant: EmptyStateVariant;
  query?: string;
  theme: SearchTheme;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ variant, query, theme }) => {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <Text
        className="text-[10px] uppercase tracking-[0.2em] mb-3"
        style={{ color: theme.mutedGold, fontFamily: 'Inter-Medium' }}
      >
        {variant === 'idle' ? 'Escrituras' : 'Sin resultados'}
      </Text>
      {variant === 'idle' ? (
        <Text
          className="text-lg text-center"
          style={{ color: theme.mutedText, fontFamily: 'PlayfairDisplay-Italic', lineHeight: 30 }}
        >
          Escribe para buscar en los 73 libros de las Escrituras
        </Text>
      ) : (
        <Text
          className="text-lg text-center"
          style={{ color: theme.mutedText, fontFamily: 'PlayfairDisplay', lineHeight: 30 }}
        >
          {'No se encontraron versículos para "' + (query ?? '') + '"'}
        </Text>
      )}
    </View>
  );
};
