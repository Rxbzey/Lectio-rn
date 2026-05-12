import { Pressable, Text, View } from 'react-native';
import { NumberGridTheme } from './hooks/useNumberGridTheme';

interface NumberCellProps {
  num: number;
  isSelected: boolean;
  theme: NumberGridTheme;
  onPress: (num: number) => void;
}

export const NumberCell: React.FC<NumberCellProps> = ({ num, isSelected, theme, onPress }) => {
  return (
    <Pressable
      className="items-center justify-center"
      style={{ width: '16.666%', aspectRatio: 1, padding: 4 }}
      onPress={() => onPress(num)}
    >
      <View
        className="w-full h-full items-center justify-center rounded-lg"
        style={{
          backgroundColor: isSelected ? theme.cellBgActive : theme.cellBg,
          borderWidth: isSelected ? 1 : 0,
          borderColor: isSelected ? `${theme.gold}40` : 'transparent',
        }}
      >
        <Text
          style={{
            color: isSelected ? theme.gold : theme.textColor,
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
};
