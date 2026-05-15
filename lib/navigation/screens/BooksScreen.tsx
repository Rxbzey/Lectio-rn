import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { BooksIndex } from 'components/BooksIndex';
import { useProgressStore } from '../../stores/useProgressStore';
import { slugifyBookName, BOOKS_META } from '../../../data/biblia/books-meta';

type Props = NativeStackScreenProps<RootStackParamList, 'Books'> & {
  isDark: boolean;
  appBarHeight: number;
};

export function BooksScreen({ navigation, isDark, appBarHeight }: Props) {
  const { bookProgressMap } = useProgressStore();

  return (
    <BooksIndex
      isDark={isDark}
      activeBookSlug="genesis"
      appBarHeight={appBarHeight}
      bookProgressMap={bookProgressMap}
      onClose={() => navigation.goBack()}
      onBookPress={(bookSlug) => {
        const meta = BOOKS_META.find((b) => slugifyBookName(b.name) === bookSlug);
        navigation.navigate('Chapters', {
          bookSlug,
          bookName: meta?.name ?? bookSlug,
          chapterCount: meta?.chapters ?? 0,
        });
      }}
      onHome={() => navigation.navigate('Home')}
      onSearch={() => navigation.navigate('Search')}
      onMarks={() => navigation.navigate('Marks')}
    />
  );
}
