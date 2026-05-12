import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

interface AppBarProps {
  screen: 'home' | 'books' | 'reader';
  isDark: boolean;
  onBack: () => void;
  onToggleTheme: () => void;
  progress: Animated.Value;
  onHeightMeasured?: (height: number) => void;
}

export const AppBar: React.FC<AppBarProps> = ({ screen, isDark, onBack, onToggleTheme, progress, onHeightMeasured }) => {
  const insets = useSafeAreaInsets();
  const gold = isDark ? '#c5a059' : '#775a19';
  const iconColor = isDark ? '#d4cfc5' : '#3d3629';
  const bg = isDark ? 'rgba(5,5,5,0.72)' : 'rgba(239,230,212,0.72)';
  const border = isDark ? 'rgba(197,160,89,0.14)' : 'rgba(119,90,25,0.14)';
  const isHome = screen === 'home';

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        opacity: progress,
      }}
    >
      <View
        onLayout={(e) => onHeightMeasured?.(e.nativeEvent.layout.height)}
        style={{
          paddingTop: insets.top,
          backgroundColor: isHome ? 'transparent' : bg,
          borderBottomWidth: isHome ? 0 : 1,
          borderBottomColor: border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: isHome ? 'flex-start' : 'space-between',
          paddingHorizontal: 16,
          paddingBottom: isHome ? 0 : 10,
        }}
      >
        {/* Back button — solo en books y reader */}
        {!isHome ? (
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 4 }}
          >
            <Text style={{ color: gold, fontSize: 20, lineHeight: 24 }}>←</Text>
            <Text style={{ color: iconColor, fontFamily: 'Inter', fontSize: 13, letterSpacing: 0.2 }}>Atrás</Text>
          </Pressable>
        ) : null}

        {/* Theme toggle — siempre visible */}
        <Pressable
          onPress={onToggleTheme}
          hitSlop={12}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isHome ? (isDark ? 'rgba(20,20,20,0.6)' : 'rgba(239,230,212,0.9)') : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: isHome ? 8 : 0,
          }}
        >
          <MaterialIcons
            name={isDark ? 'light-mode' : 'dark-mode'}
            size={20}
            color={iconColor}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
};
