import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { MarksScreen } from 'components/MarksScreen';
import { useIsFocused } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Marks'> & {
  isDark: boolean;
  appBarHeight: number;
  marksRefreshKey: number;
};

export function MarksNavScreen({ navigation, isDark, appBarHeight, marksRefreshKey }: Props) {
  const isFocused = useIsFocused();

  return (
    <MarksScreen
      isDark={isDark}
      active={isFocused}
      appBarHeight={appBarHeight}
      onClose={() => navigation.goBack()}
      onOpenMark={(bookSlug, chapter, verse) =>
        navigation.navigate('Reader', { bookSlug, chapter, scrollPercent: 0, targetVerse: verse })
      }
      onMarkDeleted={() => {}}
    />
  );
}
