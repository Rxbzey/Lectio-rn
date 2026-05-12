import { useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type MarkColor, MARK_PALETTE } from '../../lib/verseMarks';

interface VerseSelectionToolbarProps {
  isDark: boolean;
  selectedCount: number;
  colorNames: Record<MarkColor, string>;
  onCopy: () => void;
  onShare: () => void;
  onMark: (color: MarkColor) => void;
  onClear: () => void;
}

const ToolbarButton: React.FC<{
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  isDark: boolean;
  accent?: boolean;
}> = ({ icon, label, onPress, isDark, accent }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const gold = isDark ? '#c5a059' : '#775a19';
  const textColor = isDark ? 'rgba(236,231,219,0.78)' : 'rgba(61,54,41,0.78)';
  return (
    <Pressable
      onPressIn={() => Animated.timing(scale, { toValue: 0.91, duration: 110, useNativeDriver: true }).start()}
      onPressOut={() => Animated.timing(scale, { toValue: 1, duration: 170, useNativeDriver: true }).start()}
      onPress={onPress}
      style={{ alignItems: 'center', gap: 5 }}
    >
      <Animated.View style={{ transform: [{ scale }], alignItems: 'center', gap: 5 }}>
        <MaterialCommunityIcons name={icon} size={22} color={accent ? gold : textColor} />
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 9, letterSpacing: 1.8, textTransform: 'uppercase', color: accent ? gold : textColor }}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const COLOR_KEYS: MarkColor[] = ['amber', 'rose', 'sage', 'sky'];

export const VerseSelectionToolbar: React.FC<VerseSelectionToolbarProps> = ({
  isDark,
  selectedCount,
  colorNames,
  onCopy,
  onShare,
  onMark,
  onClear,
}) => {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<'actions' | 'colors'>('actions');
  const phaseAnim = useRef(new Animated.Value(0)).current;

  const gold = isDark ? '#c5a059' : '#775a19';
  const bg = isDark ? 'rgba(10,9,8,0.97)' : 'rgba(239,230,212,0.97)';
  const border = isDark ? 'rgba(197,160,89,0.22)' : 'rgba(119,90,25,0.18)';

  const toColors = () => {
    setPhase('colors');
    Animated.timing(phaseAnim, { toValue: 1, duration: 240, useNativeDriver: true }).start();
  };
  const toActions = () => {
    Animated.timing(phaseAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setPhase('actions'));
  };

  const actionsOpacity = phaseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const actionsTranslate = phaseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });
  const colorsOpacity = phaseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const colorsTranslate = phaseAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom + 16,
        left: 24,
        right: 24,
        zIndex: 60,
        backgroundColor: bg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: border,
        paddingVertical: 16,
        paddingHorizontal: 24,
        overflow: 'hidden',
        shadowColor: gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 12,
      }}
    >
      {/* Phase 1 — Actions */}
      {phase === 'actions' && (
        <Animated.View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', opacity: actionsOpacity, transform: [{ translateX: actionsTranslate }] }}>
          <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
            <ToolbarButton icon="content-copy" label="Copiar" onPress={onCopy} isDark={isDark} />
            <ToolbarButton icon="share-variant-outline" label="Compartir" onPress={onShare} isDark={isDark} accent />
            <ToolbarButton icon="bookmark-plus-outline" label="Marcar" onPress={toColors} isDark={isDark} accent />
          </View>
          <View style={{ width: 1, height: 28, backgroundColor: border }} />
          <ToolbarButton icon="close" label="Limpiar" onPress={onClear} isDark={isDark} />
        </Animated.View>
      )}

      {/* Phase 2 — Color picker */}
      {phase === 'colors' && (
        <Animated.View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', opacity: colorsOpacity, transform: [{ translateX: colorsTranslate }] }}>
          <Pressable onPress={toActions} style={{ marginRight: 16 }}>
            <MaterialCommunityIcons name="chevron-left" size={22} color={isDark ? 'rgba(236,231,219,0.55)' : 'rgba(61,54,41,0.55)'} />
          </Pressable>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            {COLOR_KEYS.map((color) => {
              const palette = MARK_PALETTE[color];
              return (
                <Pressable key={color} onPress={() => { onMark(color); toActions(); }} style={{ alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: palette.dot,
                      shadowColor: palette.dot,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.55,
                      shadowRadius: 6,
                      elevation: 4,
                    }}
                  />
                  <Text style={{ fontFamily: 'Inter-Medium', fontSize: 8, letterSpacing: 1.4, textTransform: 'uppercase', color: isDark ? 'rgba(236,231,219,0.60)' : 'rgba(61,54,41,0.60)' }}>
                    {colorNames[color]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      )}
    </View>
  );
};
