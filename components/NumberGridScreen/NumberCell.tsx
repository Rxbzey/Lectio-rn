import { Pressable, Text, View } from 'react-native';
import { NumberGridTheme } from './hooks/useNumberGridTheme';

interface NumberCellProps {
  num: number;
  isSelected: boolean;
  isCompleted: boolean;
  theme: NumberGridTheme;
  onPress: (num: number) => void;
}

export const NumberCell: React.FC<NumberCellProps> = ({ num, isSelected, isCompleted, theme, onPress }) => {
  const completedVisual = isCompleted && !isSelected;

  return (
    <Pressable
      className="items-center justify-center"
      style={{ width: '16.666%', aspectRatio: 1, padding: 4 }}
      onPress={() => onPress(num)}
    >
      <View
        className="w-full h-full items-center justify-center rounded-lg"
        style={{
          backgroundColor: isSelected ? theme.cellBgActive : completedVisual ? theme.cellBgCompleted : theme.cellBg,
          borderWidth: isSelected ? 1 : completedVisual ? 1 : 0,
          borderColor: isSelected ? `${theme.gold}40` : completedVisual ? `${theme.completed}35` : 'transparent',
        }}
      >
        <Text
          style={{
            color: isSelected ? theme.gold : completedVisual ? theme.completed : theme.textColor,
            fontFamily: isSelected ? 'Inter-Medium' : 'Inter',
            fontSize: 16,
            opacity: isSelected ? 1 : completedVisual ? 0.45 : 0.7,
          }}
        >
          {num}
        </Text>
      </View>
    </Pressable>
  );
};
