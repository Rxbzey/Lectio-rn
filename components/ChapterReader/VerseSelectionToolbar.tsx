import { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface VerseSelectionToolbarProps {
  isDark: boolean;
  selectedCount: number;
  onCopy: () => void;
  onShare: () => void;
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
      onPressIn={() => Animated.timing(scale, { toValue: 0.93, duration: 120, useNativeDriver: true }).start()}
      onPressOut={() => Animated.timing(scale, { toValue: 1, duration: 180, useNativeDriver: true }).start()}
      onPress={onPress}
      style={{ alignItems: 'center', gap: 6 }}
    >
      <Animated.View style={{ transform: [{ scale }], alignItems: 'center', gap: 5 }}>
        <MaterialCommunityIcons name={icon} size={22} color={accent ? gold : textColor} />
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: 9,
            letterSpacing: 1.8,
            textTransform: 'uppercase',
            color: accent ? gold : textColor,
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export const VerseSelectionToolbar: React.FC<VerseSelectionToolbarProps> = ({
  isDark,
  selectedCount,
  onCopy,
  onShare,
  onClear,
}) => {
  const insets = useSafeAreaInsets();
  const gold = isDark ? '#c5a059' : '#775a19';
  const bg = isDark ? 'rgba(10,9,8,0.97)' : 'rgba(239,230,212,0.97)';
  const border = isDark ? 'rgba(197,160,89,0.22)' : 'rgba(119,90,25,0.18)';

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 12,
      }}
    >
      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 28, alignItems: 'center' }}>
        <ToolbarButton icon="content-copy" label="Copiar" onPress={onCopy} isDark={isDark} />
        <ToolbarButton icon="share-variant-outline" label="Compartir" onPress={onShare} isDark={isDark} accent />
      </View>

      {/* Divider */}
      <View style={{ width: 1, height: 28, backgroundColor: border }} />

      {/* Clear */}
      <ToolbarButton icon="close" label="Limpiar" onPress={onClear} isDark={isDark} />
    </View>
  );
};
