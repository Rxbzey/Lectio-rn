import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <Pressable
      onPress={onToggle}
      className={`absolute top-6 left-6 z-50 p-2 rounded-full ${isDark ? 'bg-void-mid' : 'bg-parchment'}`}
    >
      <MaterialIcons
        name={isDark ? 'light-mode' : 'dark-mode'}
        size={20}
        color={isDark ? '#d4cfc5' : '#3d3629'}
      />
    </Pressable>
  );
};
