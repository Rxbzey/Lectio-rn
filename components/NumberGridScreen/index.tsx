import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNumberGridTheme } from './hooks/useNumberGridTheme';
import { NumberCell } from './NumberCell';

interface NumberGridScreenProps {
  title: string;
  subtitle?: string;
  count: number;
  isDark: boolean;
  selectedNumber?: number;
  completedChapters?: number[];
  onSelect: (number: number) => void;
  onBack: () => void;
  appBarHeight?: number;
}

export const NumberGridScreen: React.FC<NumberGridScreenProps> = ({
  title,
  subtitle,
  count,
  isDark,
  selectedNumber,
  completedChapters,
  onSelect,
  onBack,
  appBarHeight,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useNumberGridTheme(isDark);
  const numbers = Array.from({ length: count }, (_, i) => i + 1);

  return (
    <Animated.View
      pointerEvents="auto"
      className="absolute inset-0"
      style={{
        backgroundColor: theme.bg,
        paddingTop: appBarHeight || insets.top + 60,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Header */}
      <View className="px-6 pt-4 pb-6 flex-row justify-between items-start">
        <View className="flex-1 gap-2">
          {subtitle ? (
            <Text
              className="text-[11px] uppercase tracking-[0.28em]"
              style={{ color: theme.gold, fontFamily: 'Inter-Medium', opacity: 0.72 }}
            >
              {subtitle}
            </Text>
          ) : null}
          <Text
            style={{
              color: theme.textColor,
              fontFamily: 'PlayfairDisplay',
              fontSize: 32,
              lineHeight: 40,
              letterSpacing: -0.5,
            }}
          >
            {title}
          </Text>
        </View>
      </View>

      {/* Back link */}
      <Pressable className="px-6 py-3 flex-row items-center gap-2" onPress={onBack}>
        <View className="w-6 h-px" style={{ backgroundColor: theme.gold, opacity: 0.4 }} />
        <Text
          className="text-[11px] uppercase tracking-[0.24em]"
          style={{ color: theme.mutedText, fontFamily: 'Inter-Medium' }}
        >
          Volver al índice
        </Text>
      </Pressable>

      {/* Grid */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap">
          {numbers.map((num) => (
            <NumberCell
              key={num}
              num={num}
              isSelected={num === selectedNumber}
              isCompleted={completedChapters?.includes(num) ?? false}
              theme={theme}
              onPress={onSelect}
            />
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
};
