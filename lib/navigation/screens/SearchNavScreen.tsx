import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { SearchScreen } from 'components/SearchScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'> & {
  isDark: boolean;
  appBarHeight: number;
};

export function SearchNavScreen({ navigation, isDark, appBarHeight }: Props) {
  return (
    <SearchScreen
      isDark={isDark}
      appBarHeight={appBarHeight}
      onResultPress={(bookSlug, chapter) =>
        navigation.navigate('Reader', { bookSlug, chapter, scrollPercent: 0 })
      }
    />
  );
}
