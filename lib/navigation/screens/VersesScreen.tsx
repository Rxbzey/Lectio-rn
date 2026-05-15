import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { NumberGridScreen } from 'components/NumberGridScreen';
import { getChapter } from '../../api';

type Props = NativeStackScreenProps<RootStackParamList, 'Verses'> & {
  isDark: boolean;
  appBarHeight: number;
};

export function VersesScreen({ navigation, route, isDark, appBarHeight }: Props) {
  const { bookSlug, chapter, verseCount } = route.params;
  const [count, setCount] = useState(verseCount);

  useEffect(() => {
    if (verseCount > 0) return;
    let active = true;
    getChapter(bookSlug, chapter)
      .then((data) => {
        if (!active) return;
        setCount(data.verses.length);
      })
      .catch(() => {
        if (!active) return;
        setCount(0);
      });
    return () => { active = false; };
  }, [bookSlug, chapter, verseCount]);

  return (
    <NumberGridScreen
      title={`Capítulo ${chapter}`}
      subtitle="Selecciona versículo"
      count={count}
      isDark={isDark}
      appBarHeight={appBarHeight}
      onSelect={(verse) =>
        navigation.navigate('Reader', { bookSlug, chapter, scrollPercent: 0, targetVerse: verse })
      }
      onBack={() => navigation.goBack()}
    />
  );
}
