import { View, Pressable, Text } from 'react-native';

interface ActionLinksProps {
  isDark: boolean;
  mutedColor: string;
  hasProgress?: boolean;
  progressLabel?: string;
  onStartReading?: () => void;
  onExploreBooks?: () => void;
}

export const ActionLinks: React.FC<ActionLinksProps> = ({
  isDark,
  mutedColor,
  hasProgress,
  progressLabel,
  onStartReading,
  onExploreBooks,
}) => {
  return (
    <View className="items-center z-10 gap-8">
      <Pressable className="group py-2" onPress={onStartReading}>
        <Text
          className={`text-[12px] uppercase tracking-[0.4em] ${isDark ? 'text-cream-bright' : 'text-ink'}`}
          style={{ fontFamily: 'PlayfairDisplay' }}
        >
          {hasProgress ? 'Continuar leyendo' : 'Comenzar a leer'}
        </Text>
        <View className="h-[1px] w-8 bg-gold self-center mt-1" />
        {hasProgress && progressLabel ? (
          <Text className={`mt-3 text-[11px] tracking-[0.18em] text-center ${mutedColor}`} style={{ fontFamily: 'Inter' }}>
            {progressLabel}
          </Text>
        ) : null}
      </Pressable>

      <Pressable className="group py-2" onPress={onExploreBooks}>
        <Text
          className={`text-[12px] uppercase tracking-[0.4em] ${mutedColor}`}
          style={{ fontFamily: 'PlayfairDisplay' }}
        >
          Explorar libros
        </Text>
      </Pressable>
    </View>
  );
};
