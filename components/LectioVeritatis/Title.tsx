import { View, Text } from 'react-native';

interface TitleProps {
  isDark: boolean;
}

export const Title: React.FC<TitleProps> = ({ isDark }) => {
  return (
    <View className="items-center z-10 mb-12">
      <Text
        className={`text-center text-7xl ${isDark ? 'text-cream-bright' : 'text-ink'}`}
        style={{
          fontFamily: 'PlayfairDisplay',
          lineHeight: 62,
          letterSpacing: -1.8,
        }}
      >
        Lectio
        {'\n'}
        <Text className="text-gold/80" style={{ fontFamily: 'PlayfairDisplay-Italic' }}>
          Veritatis
        </Text>
      </Text>
    </View>
  );
};
