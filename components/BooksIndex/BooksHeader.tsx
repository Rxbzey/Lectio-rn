import { View, Text } from 'react-native';

interface BooksHeaderProps {
  titleColor: string;
  mutedColor: string;
}

export const BooksHeader: React.FC<BooksHeaderProps> = ({ titleColor, mutedColor }) => {
  return (
    <View className="w-full pt-4 pb-8 px-6 flex-row justify-between items-start">
      <View className="flex-1 gap-2">
        <Text className={`text-[12px] uppercase tracking-[0.28em] ${mutedColor}`} style={{ fontFamily: 'Inter-Medium', lineHeight: 16 }}>
          Í N D I C E   T I P O G R Á F I C O
        </Text>
        <Text className={`text-5xl ${titleColor}`} style={{ fontFamily: 'PlayfairDisplay', lineHeight: 56, letterSpacing: -1 }}>
          Escrituras
        </Text>
      </View>
    </View>
  );
};
