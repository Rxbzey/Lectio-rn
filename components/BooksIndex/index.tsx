import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bookSections } from './data/books';
import { useBooksIndexTheme } from './hooks/useBooksIndexTheme';
import { BooksHeader } from './BooksHeader';
import { BooksSection } from './BooksSection';
import { FloatingActionButton } from '../LectioVeritatis/FloatingActionButton';
import { BookProgressMap } from '../../lib/bookProgress';

interface BooksIndexProps {
  isDark: boolean;
  activeBookSlug?: string;
  appBarHeight?: number;
  bookProgressMap?: BookProgressMap;
  onClose?: () => void;
  onBookPress?: (bookSlug: string) => void;
  onHome?: () => void;
  onSearch?: () => void;
  onMarks?: () => void;
}

export const BooksIndex: React.FC<BooksIndexProps> = ({ isDark, activeBookSlug, appBarHeight, bookProgressMap, onClose, onBookPress, onHome, onSearch, onMarks }) => {
  const insets = useSafeAreaInsets();
  const { bgColor, titleColor, bodyColor, outlineColor, mutedColor } = useBooksIndexTheme(isDark);

  return (
    <View className={`flex-1 ${bgColor}`} style={{ paddingTop: appBarHeight || insets.top + 60 }}>
      <BooksHeader titleColor={titleColor} mutedColor={mutedColor} onClose={onClose} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 128 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-4xl self-center">
          {bookSections.map((section) => (
            <BooksSection
              key={section.title}
              section={section}
              bodyColor={bodyColor}
              outlineColor={outlineColor}
              activeBookSlug={activeBookSlug}
              bookProgressMap={bookProgressMap}
              onBookPress={onBookPress}
            />
          ))}
        </View>
      </ScrollView>
      <FloatingActionButton isDark={isDark} onHome={onHome} onBooks={onClose} onSearch={onSearch} onMarks={onMarks} />
    </View>
  );
};
