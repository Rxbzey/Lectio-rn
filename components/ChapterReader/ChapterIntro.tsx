import { Animated, Text, View } from 'react-native';

interface ChapterIntroProps {
  isDark: boolean;
  scrollY: Animated.Value;
  bookName: string;
  chapter: number;
  testamentLabel: string;
}

export const ChapterIntro: React.FC<ChapterIntroProps> = ({ isDark, scrollY, bookName, chapter, testamentLabel }) => {
  const opacity = scrollY.interpolate({
    inputRange: [0, 220, 420],
    outputRange: [1, 0.45, 0],
    extrapolate: 'clamp',
  });

  const translateY = scrollY.interpolate({
    inputRange: [0, 420],
    outputRange: [0, -90],
    extrapolate: 'clamp',
  });

  const scale = scrollY.interpolate({
    inputRange: [0, 420],
    outputRange: [1, 0.96],
    extrapolate: 'clamp',
  });

  const bgNumberOpacity = scrollY.interpolate({
    inputRange: [0, 260],
    outputRange: [isDark ? 0.11 : 0.08, 0],
    extrapolate: 'clamp',
  });

  const foreground = isDark ? '#f1eadf' : '#17120b';
  const muted = isDark ? 'rgba(226,226,226,0.28)' : 'rgba(23,18,11,0.38)';

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute inset-0 items-center justify-center px-6"
      style={{ opacity, transform: [{ translateY }, { scale }] }}
    >
      <Animated.Text
        className="absolute text-[330px]"
        style={{
          color: '#c5a059',
          opacity: bgNumberOpacity,
          fontFamily: 'PlayfairDisplay-Bold',
          lineHeight: 360,
          transform: [{ translateY: 50 }],
        }}
      >
        {chapter}
      </Animated.Text>

      <View className="items-center">
        <Text
          className="text-[62px]"
          style={{
            color: foreground,
            fontFamily: 'PlayfairDisplay',
            lineHeight: 70,
            letterSpacing: -1.8,
            textShadowColor: isDark ? 'rgba(197,160,89,0.16)' : 'transparent',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 20,
          }}
        >
          {bookName}
        </Text>

        <View className="flex-row items-center gap-3 -mt-2">
          <View className="w-24 h-px" style={{ backgroundColor: 'rgba(197,160,89,0.42)' }} />
          <Text
            className="text-[12px] uppercase tracking-[0.48em]"
            style={{ color: '#c5a059', fontFamily: 'Inter-Medium', lineHeight: 18 }}
          >
            Capítulo {chapter}
          </Text>
          <View className="w-24 h-px" style={{ backgroundColor: 'rgba(197,160,89,0.42)' }} />
        </View>

        <Text
          className="mt-1 text-[10px] uppercase tracking-[0.48em]"
          style={{ color: muted, fontFamily: 'Inter', lineHeight: 16 }}
        >
          · {testamentLabel} ·
        </Text>
      </View>

      <View className="absolute bottom-24 items-center">
        <Text className="text-[10px] uppercase tracking-[0.48em] mb-4" style={{ color: muted, fontFamily: 'Inter' }}>
          Scroll
        </Text>
        <View className="w-px h-14" style={{ backgroundColor: isDark ? 'rgba(197,160,89,0.16)' : 'rgba(88,68,23,0.18)' }} />
      </View>
    </Animated.View>
  );
};
