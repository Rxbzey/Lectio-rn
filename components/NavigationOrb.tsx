import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOOKS_META, slugifyBookName } from '../data/biblia/books-meta';

export type NavigationOrbMode = 'books' | 'search' | 'chapters' | 'verses';

interface NavigationOrbProps {
  visible: boolean;
  mode: NavigationOrbMode;
  isDark: boolean;
  currentBookSlug: string;
  currentChapter: number;
  verseCount: number;
  onClose: () => void;
  onNavigateChapter: (bookSlug: string, chapter: number) => void;
  onNavigateVerse: (bookSlug: string, chapter: number, verse: number) => void;
}

export const NavigationOrb: React.FC<NavigationOrbProps> = ({
  visible,
  mode,
  isDark,
  currentBookSlug,
  currentChapter,
  verseCount,
  onClose,
  onNavigateChapter,
  onNavigateVerse,
}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const currentBook = BOOKS_META.find((book) => slugifyBookName(book.name) === currentBookSlug) ?? BOOKS_META[0];
  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return BOOKS_META;
    return BOOKS_META.filter((book) => book.name.toLowerCase().includes(normalized));
  }, [query]);

  const foreground = isDark ? '#f4ead9' : '#fff8ea';
  const muted = isDark ? 'rgba(244,234,217,0.56)' : 'rgba(255,248,234,0.62)';
  const panel = isDark ? 'rgba(6,6,6,0.92)' : 'rgba(10,8,6,0.94)';
  const gold = '#c9a84c';

  const title = mode === 'books' ? 'Libros' : mode === 'search' ? 'Buscar' : mode === 'chapters' ? currentBook.name : `${currentBook.name} ${currentChapter}`;
  const subtitle = mode === 'books' ? 'Selecciona un libro' : mode === 'search' ? 'Busca por nombre de libro' : mode === 'chapters' ? 'Capítulos' : 'Versículos';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.82)', paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View className="flex-1 px-6 py-6" style={{ backgroundColor: panel }}>
          <View className="flex-row items-start justify-between mb-8">
            <View>
              <Text className="text-[11px] uppercase tracking-[0.48em]" style={{ color: gold, fontFamily: 'Inter-Medium' }}>
                Navigation Orb
              </Text>
              <Text className="text-5xl mt-3" style={{ color: foreground, fontFamily: 'PlayfairDisplay', lineHeight: 58 }}>
                {title}
              </Text>
              <Text className="text-xs uppercase tracking-[0.35em] mt-1" style={{ color: muted, fontFamily: 'Inter' }}>
                {subtitle}
              </Text>
            </View>
            <Pressable onPress={onClose} className="w-12 h-12 rounded-full items-center justify-center border" style={{ borderColor: 'rgba(201,168,76,0.36)' }}>
              <Text style={{ color: gold, fontSize: 24, lineHeight: 28 }}>×</Text>
            </Pressable>
          </View>

          {mode === 'search' ? (
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Ej. Génesis"
              placeholderTextColor="rgba(244,234,217,0.35)"
              className="rounded-3xl px-5 py-4 mb-6 text-lg"
              style={{ color: foreground, borderWidth: 1, borderColor: 'rgba(201,168,76,0.34)', fontFamily: 'Inter' }}
            />
          ) : null}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
            {(mode === 'books' || mode === 'search') ? filteredBooks.map((book) => {
              const slug = slugifyBookName(book.name);
              return (
                <Pressable key={book.id} onPress={() => onNavigateChapter(slug, 1)} className="py-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.14)' }}>
                  <Text className="text-2xl" style={{ color: slug === currentBookSlug ? gold : foreground, fontFamily: 'PlayfairDisplay' }}>
                    {book.name}
                  </Text>
                  <Text className="text-[10px] uppercase tracking-[0.32em] mt-1" style={{ color: muted, fontFamily: 'Inter' }}>
                    {book.chapters} capítulos · {book.testament === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento'}
                  </Text>
                </Pressable>
              );
            }) : null}

            {mode === 'chapters' ? (
              <View className="flex-row flex-wrap gap-3">
                {Array.from({ length: currentBook.chapters }, (_, index) => index + 1).map((chapter) => (
                  <Pressable key={chapter} onPress={() => onNavigateChapter(currentBookSlug, chapter)} className="w-16 h-16 rounded-2xl items-center justify-center border" style={{ borderColor: chapter === currentChapter ? gold : 'rgba(201,168,76,0.24)' }}>
                    <Text style={{ color: chapter === currentChapter ? gold : foreground, fontFamily: 'PlayfairDisplay', fontSize: 24 }}>{chapter}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {mode === 'verses' ? (
              <View className="flex-row flex-wrap gap-3">
                {Array.from({ length: Math.max(verseCount, 1) }, (_, index) => index + 1).map((verse) => (
                  <Pressable key={verse} onPress={() => onNavigateVerse(currentBookSlug, currentChapter, verse)} className="w-14 h-14 rounded-2xl items-center justify-center border" style={{ borderColor: 'rgba(201,168,76,0.24)' }}>
                    <Text style={{ color: foreground, fontFamily: 'Inter-Medium', fontSize: 16 }}>{verse}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
