import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NumberGridScreenProps {
  title: string;
  subtitle?: string;
  count: number;
  isDark: boolean;
  selectedNumber?: number;
  onSelect: (number: number) => void;
  onBack: () => void;
  appBarHeight?: number;
  progress?: Animated.Value;
}

export const NumberGridScreen: React.FC<NumberGridScreenProps> = ({
  title,
  subtitle,
  count,
  isDark,
  selectedNumber,
  onSelect,
  onBack,
  appBarHeight,
  progress,
}) => {
  const insets = useSafeAreaInsets();
  const gold = isDark ? '#c5a059' : '#775a19';
  const textColor = isDark ? '#c9c4b8' : '#3d3629';
  const mutedText = isDark ? 'rgba(201,196,184,0.50)' : 'rgba(61,54,41,0.45)';
  const bgColor = isDark ? '#000000' : '#efe6d4';
  const cellBg = isDark ? 'rgba(197,160,89,0.08)' : 'rgba(119,90,25,0.06)';
  const cellBgActive = isDark ? 'rgba(197,160,89,0.22)' : 'rgba(119,90,25,0.16)';

  const numbers = Array.from({ length: count }, (_, i) => i + 1);

  const opacity = progress ?? new Animated.Value(1);

  return (
    <Animated.View
      pointerEvents="auto"
      className="absolute inset-0"
      style={{
        opacity,
        backgroundColor: bgColor,
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
              style={{ color: gold, fontFamily: 'Inter-Medium', opacity: 0.72 }}
            >
              {subtitle}
            </Text>
          ) : null}
          <Text
            style={{
              color: textColor,
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
        <View className="w-6 h-px" style={{ backgroundColor: gold, opacity: 0.4 }} />
        <Text
          className="text-[11px] uppercase tracking-[0.24em]"
          style={{ color: mutedText as string, fontFamily: 'Inter-Medium' }}
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
          {numbers.map((num) => {
            const isSelected = num === selectedNumber;
            return (
              <Pressable
                key={num}
                className="items-center justify-center"
                style={{
                  width: '16.666%',
                  aspectRatio: 1,
                  padding: 4,
                }}
                onPress={() => onSelect(num)}
              >
                <View
                  className="w-full h-full items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: isSelected ? cellBgActive : cellBg,
                    borderWidth: isSelected ? 1 : 0,
                    borderColor: isSelected ? `${gold}40` : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: isSelected ? gold : textColor,
                      fontFamily: isSelected ? 'Inter-Medium' : 'Inter',
                      fontSize: 16,
                      opacity: isSelected ? 1 : 0.7,
                    }}
                  >
                    {num}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Animated.View>
  );
};
