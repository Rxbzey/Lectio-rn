import { View, Text } from 'react-native';

export const Header: React.FC = () => {
  return (
    <View className="items-center mb-4 z-10">
      <Text className="text-[10px] uppercase tracking-[0.4em] font-light text-gold/80 mb-6 font-sans">
        BIBLIA LATINOAMERICANA
      </Text>
    </View>
  );
};
