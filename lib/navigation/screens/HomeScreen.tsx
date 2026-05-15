import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { LectioVeritatis } from 'components/LectioVeritatis';
import { useProgressStore } from '../../stores/useProgressStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  isDark: boolean;
  verseOfDay: { text: string; reference: string } | null;
};

export function HomeScreen({ navigation, isDark, verseOfDay }: Props) {
  const { readingProgress } = useProgressStore();
  const progressLabel = readingProgress
    ? `${readingProgress.bookName} · Capítulo ${readingProgress.chapter}`
    : undefined;

  const handleStartReading = () => {
    if (readingProgress) {
      navigation.navigate('Reader', {
        bookSlug: readingProgress.bookSlug,
        chapter: readingProgress.chapter,
        scrollPercent: readingProgress.scrollPercent,
      });
    } else {
      navigation.navigate('Reader', { bookSlug: 'genesis', chapter: 1, scrollPercent: 0 });
    }
  };

  return (
    <LectioVeritatis
      isDark={isDark}
      hasProgress={Boolean(readingProgress)}
      progressLabel={progressLabel}
      verseOfDay={verseOfDay}
      onStartReading={handleStartReading}
      onExploreBooks={() => navigation.navigate('Books')}
      onHome={() => navigation.navigate('Home')}
      onSearch={() => navigation.navigate('Search')}
      onMarks={() => navigation.navigate('Marks')}
    />
  );
}
