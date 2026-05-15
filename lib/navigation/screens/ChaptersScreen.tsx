import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { NumberGridScreen } from 'components/NumberGridScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Chapters'> & {
  isDark: boolean;
  appBarHeight: number;
};

export function ChaptersScreen({ navigation, route, isDark, appBarHeight }: Props) {
  const { bookSlug, bookName, chapterCount } = route.params;

  return (
    <NumberGridScreen
      title={bookName}
      subtitle="Selecciona capítulo"
      count={chapterCount}
      isDark={isDark}
      appBarHeight={appBarHeight}
      onSelect={(chapter) =>
        navigation.navigate('Verses', {
          bookSlug,
          chapter,
          verseCount: 0,
        })
      }
      onBack={() => navigation.goBack()}
    />
  );
}
