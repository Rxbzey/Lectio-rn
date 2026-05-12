import { View, Text } from 'react-native';

interface CrossBackgroundProps {
  isDark: boolean;
}

export const CrossBackground: React.FC<CrossBackgroundProps> = ({ isDark }) => {
  return (
    <View className="absolute inset-0 items-center justify-center pointer-events-none">
      <Text
        className="font-serif text-center"
        style={{
          fontSize: 680,
          fontWeight: '900',
          lineHeight: 680,
          color: isDark ? 'rgba(236,231,219,0.05)' : 'rgba(0,0,0,0.05)',
          textShadowColor: isDark ? 'rgba(236,231,219,0.08)' : 'rgba(0,0,0,0.06)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 40,
          transform: [{ translateX: -8 }, { translateY: -44 }],
        }}
      >
        ✝
      </Text>
    </View>
  );
};
