import { View, Text } from 'react-native';

interface SectionHeaderProps {
  title: string;
  ornament: string;
  outlineColor: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, ornament, outlineColor }) => {
  return (
    <View className="flex-row items-center gap-4 mb-6">
      <Text className="text-[12px] uppercase tracking-[0.28em] text-gold" style={{ fontFamily: 'Inter-Medium', lineHeight: 16 }}>
        {title}
      </Text>
      <View className="flex-1 h-px items-center justify-center" style={{ backgroundColor: outlineColor }}>
        <Text className="text-xs text-cream/30 leading-none" style={{ transform: [{ translateY: -1 }] }}>
          {ornament}
        </Text>
      </View>
    </View>
  );
};
