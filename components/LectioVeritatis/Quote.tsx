import { View, Text } from 'react-native';

interface QuoteProps {
  subtextColor: string;
  verse?: { text: string; reference: string } | null;
}

export const Quote: React.FC<QuoteProps> = ({ subtextColor, verse }) => {
  if (!verse) return <View className="h-24 mb-16" />;

  return (
    <View className="items-center z-10 max-w-xl mb-16 px-4">
      <Text
        className={`text-sm text-center ${subtextColor}`}
        style={{ fontFamily: 'PlayfairDisplay-Italic', lineHeight: 22 }}
      >
        "{verse.text}"
      </Text>
      <Text
        className="mt-3 text-[10px] uppercase tracking-[0.3em] text-gold text-center"
        style={{ fontFamily: 'PlayfairDisplay' }}
      >
        {verse.reference}
      </Text>
    </View>
  );
};
