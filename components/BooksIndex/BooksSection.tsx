import { View } from 'react-native';
import { BookSection, slugifyBookName } from './data/books';
import { SectionHeader } from './SectionHeader';
import { BookButton } from './BookButton';

interface BooksSectionProps {
  section: BookSection;
  bodyColor: string;
  outlineColor: string;
  activeBookSlug?: string;
  onBookPress?: (bookSlug: string) => void;
}

export const BooksSection: React.FC<BooksSectionProps> = ({ section, bodyColor, outlineColor, activeBookSlug, onBookPress }) => {
  return (
    <View className="mb-12">
      <SectionHeader title={section.title} ornament={section.ornament} outlineColor={outlineColor} />
      <View className="flex-row gap-4">
        {section.columns.map((column, columnIndex) => (
          <View key={`${section.title}-${columnIndex}`} className="flex-1 gap-4">
            {column.map((book) => (
              <BookButton
                key={book.id}
                book={book}
                active={slugifyBookName(book.name) === activeBookSlug}
                bodyColor={bodyColor}
                onPress={() => onBookPress?.(slugifyBookName(book.name))}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};
