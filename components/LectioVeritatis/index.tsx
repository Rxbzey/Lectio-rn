import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './hooks/useTheme';
import { CrossBackground } from './CrossBackground';
import { Header } from './Header';
import { Title } from './Title';
import { Quote } from './Quote';
import { ActionLinks } from './ActionLinks';
import { FloatingActionButton } from './FloatingActionButton';


interface LectioVeritatisProps {
  isDark: boolean;
  onToggleTheme: () => void;
  hasProgress?: boolean;
  progressLabel?: string;
  verseOfDay?: { text: string; reference: string } | null;
  onStartReading?: () => void;
  onExploreBooks?: () => void;
  onHome?: () => void;
  onSearch?: () => void;
}

export const LectioVeritatis: React.FC<LectioVeritatisProps> = ({
  isDark,
  onToggleTheme,
  hasProgress,
  progressLabel,
  verseOfDay,
  onStartReading,
  onExploreBooks,
  onHome,
  onSearch,
}) => {
  const { bgColor, textColor, subtextColor, mutedColor } = useTheme(isDark);
  const insets = useSafeAreaInsets();

  return (
    <View className={`flex-1 ${bgColor} ${textColor}`} style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-8 relative pb-20">
        <CrossBackground isDark={isDark} />
        <Header />
        <Title isDark={isDark} />
        <Quote subtextColor={subtextColor} verse={verseOfDay} />
        <ActionLinks
          isDark={isDark}
          mutedColor={mutedColor}
          hasProgress={hasProgress}
          progressLabel={progressLabel}
          onStartReading={onStartReading}
          onExploreBooks={onExploreBooks}
        />
      </View>

      <FloatingActionButton isDark={isDark} onHome={onHome} onBooks={onExploreBooks} onSearch={onSearch} />
    </View>
  );
};
