import { View, Text } from 'react-native';

interface DividerProps {
  isDark: boolean;
}

export const Divider: React.FC<DividerProps> = ({ isDark }) => {
  const lineColor = isDark ? 'rgba(197,160,89,0.28)' : 'rgba(88,68,23,0.28)';
  const crossColor = isDark ? '#8f722f' : '#775a19';

  return (
    <View className="flex-row items-center justify-center gap-4 my-8">
      <View className="h-px flex-1" style={{ backgroundColor: lineColor }} />
      <Text style={{ color: crossColor, fontFamily: 'PlayfairDisplay', fontSize: 14 }}>+</Text>
      <View className="h-px flex-1" style={{ backgroundColor: lineColor }} />
    </View>
  );
};
