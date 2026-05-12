import { useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  isDark: boolean;
  isReader?: boolean;
  onHome?: () => void;
  onBooks?: () => void;
  onSearch?: () => void;
  onChapters?: () => void;
  onVerses?: () => void;
}

interface Action {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
}

const FABButton: React.FC<{
  size?: number;
  onPress: () => void;
  isDark: boolean;
  children: React.ReactNode;
}> = ({ size = 56, onPress, isDark, children }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const bg = isDark ? 'rgba(8,8,8,0.94)' : 'rgba(239,230,212,0.96)';
  const border = isDark ? 'rgba(197,160,89,0.28)' : 'rgba(119,90,25,0.22)';
  const glow = isDark ? '#c5a059' : '#775a19';

  return (
    <Pressable
      onPressIn={() => Animated.timing(scale, { toValue: 1.08, duration: 180, useNativeDriver: true }).start()}
      onPressOut={() => Animated.timing(scale, { toValue: 1, duration: 220, useNativeDriver: true }).start()}
      onPress={onPress}
    >
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale }],
          shadowColor: glow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.22,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  isDark,
  isReader,
  onHome,
  onBooks,
  onSearch,
  onChapters,
  onVerses,
}) => {
  const [open, setOpen] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const iconRot = useRef(new Animated.Value(0)).current;

  const gold = isDark ? '#c5a059' : '#775a19';
  const labelColor = isDark ? 'rgba(236,231,219,0.82)' : 'rgba(61,54,41,0.78)';
  const backdropColor = isDark ? 'rgba(5,5,5,0.88)' : 'rgba(239,230,212,0.90)';

  const toggle = () => {
    const toValue = open ? 0 : 1;
    setOpen(!open);
    Animated.parallel([
      Animated.timing(menuAnim, { toValue, duration: 280, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue, duration: 260, useNativeDriver: true }),
      Animated.timing(iconRot, { toValue, duration: 260, useNativeDriver: true }),
    ]).start();
  };

  const closeThen = (action?: () => void) => {
    setOpen(false);
    Animated.parallel([
      Animated.timing(menuAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(iconRot, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => action?.());
  };

  const actions: Action[] = [
    ...(isReader
      ? [
          { icon: 'view-grid-outline' as const, label: 'CAPÍTULOS', onPress: () => closeThen(onChapters) },
          { icon: 'format-list-bulleted' as const, label: 'VERSÍCULOS', onPress: () => closeThen(onVerses) },
        ]
      : []),
    { icon: 'home-outline' as const, label: 'INICIO', onPress: () => closeThen(onHome) },
    { icon: 'book-open-page-variant' as const, label: 'LIBROS', onPress: () => closeThen(onBooks) },
    { icon: 'magnify' as const, label: 'BUSCAR', onPress: () => closeThen(onSearch) },
  ];

  const rotate = iconRot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  return (
    <View style={{ position: 'absolute', right: 24, bottom: 24, zIndex: 50, alignItems: 'flex-end' }}>
      {/* Backdrop */}
      <Animated.View
        pointerEvents={open ? 'auto' : 'none'}
        onTouchEnd={() => closeThen()}
        style={{
          position: 'absolute',
          top: -9999, left: -9999, right: -9999, bottom: -9999,
          backgroundColor: backdropColor,
          opacity: backdropAnim,
        }}
      />

      {/* Action buttons */}
      <View style={{ alignItems: 'flex-end', marginBottom: 12, gap: 10 }}>
        {actions.map((action, i) => {
          const itemAnim = menuAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [24, 0],
          });
          const itemOpacity = menuAnim.interpolate({
            inputRange: [0, 0.4 + i * 0.1, 1],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={action.label}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                opacity: itemOpacity,
                transform: [{ translateY: itemAnim }],
              }}
            >
              <Text
                style={{
                  color: labelColor,
                  fontFamily: 'Inter-Medium',
                  fontSize: 10,
                  letterSpacing: 2.4,
                }}
              >
                {action.label}
              </Text>
              <FABButton size={46} onPress={action.onPress} isDark={isDark}>
                <MaterialCommunityIcons name={action.icon} size={20} color={gold} />
              </FABButton>
            </Animated.View>
          );
        })}
      </View>

      {/* Main FAB */}
      <FABButton size={56} onPress={toggle} isDark={isDark}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialCommunityIcons name="plus" size={26} color={gold} />
        </Animated.View>
      </FABButton>
    </View>
  );
};
