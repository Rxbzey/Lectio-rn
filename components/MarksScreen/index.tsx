import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  readVerseMarks,
  deleteVerseMark,
  updateMarkReflection,
  readColorConfig,
  saveColorConfig,
  MARK_PALETTE,
  DEFAULT_COLOR_NAMES,
  type VerseMark,
  type MarkColor,
  type VerseMarksStore,
} from '../../lib/verseMarks';

const COLOR_KEYS: MarkColor[] = ['amber', 'rose', 'sage', 'sky'];

const MarkCardSkeleton: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const bg = isDark ? 'rgba(18,17,15,0.95)' : 'rgba(248,243,234,0.95)';
  const shimmerColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={{ backgroundColor: bg, borderRadius: 14, borderWidth: 1, borderColor: isDark ? 'rgba(197,160,89,0.08)' : 'rgba(119,90,25,0.08)', overflow: 'hidden', marginBottom: 12, padding: 16, gap: 12 }}>
      {/* Header skeleton */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isDark ? 'rgba(197,160,89,0.2)' : 'rgba(119,90,25,0.2)' }} />
          <View style={{ width: 60, height: 10, borderRadius: 5, backgroundColor: isDark ? 'rgba(197,160,89,0.1)' : 'rgba(119,90,25,0.1)', overflow: 'hidden' }}>
            <Animated.View style={{ width: 100, height: '100%', backgroundColor: shimmerColor, transform: [{ translateX }] }} />
          </View>
        </View>
        <View style={{ width: 120, height: 10, borderRadius: 5, backgroundColor: isDark ? 'rgba(197,160,89,0.1)' : 'rgba(119,90,25,0.1)', overflow: 'hidden' }}>
          <Animated.View style={{ width: 100, height: '100%', backgroundColor: shimmerColor, transform: [{ translateX }] }} />
        </View>
      </View>
      {/* Text skeleton */}
      <View style={{ gap: 8 }}>
        <View style={{ width: '100%', height: 14, borderRadius: 7, backgroundColor: isDark ? 'rgba(197,160,89,0.08)' : 'rgba(119,90,25,0.08)', overflow: 'hidden' }}>
          <Animated.View style={{ width: 100, height: '100%', backgroundColor: shimmerColor, transform: [{ translateX }] }} />
        </View>
        <View style={{ width: '85%', height: 14, borderRadius: 7, backgroundColor: isDark ? 'rgba(197,160,89,0.08)' : 'rgba(119,90,25,0.08)', overflow: 'hidden' }}>
          <Animated.View style={{ width: 100, height: '100%', backgroundColor: shimmerColor, transform: [{ translateX }] }} />
        </View>
      </View>
    </View>
  );
};

interface MarksScreenProps {
  isDark: boolean;
  active?: boolean;
  appBarHeight?: number;
  onClose?: () => void;
  onOpenMark?: (bookSlug: string, chapter: number, verse: number) => void;
  onMarkDeleted?: () => void;
}

const ReflectionEditor: React.FC<{
  mark: VerseMark;
  isDark: boolean;
  onSave: (reflection: string) => void;
  onClose: () => void;
}> = ({ mark, isDark, onSave, onClose }) => {
  const [text, setText] = useState(mark.reflection ?? '');
  const bg = isDark ? 'rgba(14,13,12,0.98)' : 'rgba(239,230,212,0.98)';
  const border = isDark ? 'rgba(197,160,89,0.22)' : 'rgba(119,90,25,0.18)';
  const textColor = isDark ? '#ece7db' : '#3d3629';
  const placeholderColor = isDark ? 'rgba(236,231,219,0.30)' : 'rgba(61,54,41,0.30)';
  const gold = isDark ? '#c5a059' : '#775a19';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ position: 'absolute', inset: 0, zIndex: 100, justifyContent: 'flex-end' }}
    >
      <Pressable style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)' }} onPress={onClose} />
      <View style={{ backgroundColor: bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderColor: border, padding: 24, gap: 16 }}>
        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 10, letterSpacing: 2.4, textTransform: 'uppercase', color: gold }}>Reflexión</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          placeholder="Escribe tu reflexión..."
          placeholderTextColor={placeholderColor}
          style={{ fontFamily: 'PlayfairDisplay', fontSize: 18, lineHeight: 28, color: textColor, minHeight: 100, textAlignVertical: 'top' }}
          autoFocus
        />
        <Pressable
          onPress={() => { onSave(text); onClose(); }}
          style={{ alignSelf: 'flex-end', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: border, backgroundColor: isDark ? 'rgba(197,160,89,0.10)' : 'rgba(119,90,25,0.08)' }}
        >
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: gold }}>Guardar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const MarkCard: React.FC<{
  mark: VerseMark;
  colorName: string;
  isDark: boolean;
  onOpenMark?: () => void;
  onEditReflection: () => void;
  onDelete: () => void;
}> = ({ mark, colorName, isDark, onOpenMark, onEditReflection, onDelete }) => {
  const palette = MARK_PALETTE[mark.color];
  const textColor = isDark ? 'rgba(236,231,219,0.85)' : 'rgba(61,54,41,0.85)';
  const mutedColor = isDark ? 'rgba(236,231,219,0.42)' : 'rgba(61,54,41,0.42)';
  const bg = isDark ? 'rgba(18,17,15,0.95)' : 'rgba(248,243,234,0.95)';
  const border = isDark ? 'rgba(197,160,89,0.10)' : 'rgba(119,90,25,0.10)';
  const gold = isDark ? '#c5a059' : '#775a19';

  const verseLabel = mark.verseStart === mark.verseEnd
    ? `v. ${mark.verseStart}`
    : `vv. ${mark.verseStart}–${mark.verseEnd}`;

  return (
    <View style={{ backgroundColor: bg, borderRadius: 14, borderWidth: 1, borderColor: border, borderLeftWidth: 3, borderLeftColor: isDark ? palette.borderDark : palette.border, overflow: 'hidden', marginBottom: 12 }}>
      {/* Header */}
      <Pressable onPress={onOpenMark} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: palette.dot }} />
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: palette.dot }}>{colorName}</Text>
        </View>
        <Text style={{ fontFamily: 'Inter', fontSize: 11, color: mutedColor, letterSpacing: 0.5 }}>
          {mark.bookName} {mark.chapter} · {verseLabel}
        </Text>
      </Pressable>

      {/* Verse text */}
      <Pressable onPress={onOpenMark} style={{ paddingHorizontal: 16, paddingBottom: mark.reflection ? 8 : 14 }}>
        <Text style={{ fontFamily: 'PlayfairDisplay', fontSize: 16, lineHeight: 26, color: textColor }} numberOfLines={3}>
          {mark.verseTexts.map((v) => (
            <Text key={v.number}>
              <Text style={{ fontFamily: 'Inter-Medium', fontSize: 10, color: palette.dot }}>{v.number} </Text>
              <Text>{v.text} </Text>
            </Text>
          ))}
        </Text>
      </Pressable>

      {/* Reflection */}
      {mark.reflection ? (
        <Pressable onPress={onEditReflection} style={{ marginHorizontal: 16, marginBottom: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderRadius: 8 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Italic', fontSize: 14, lineHeight: 22, color: mutedColor }} numberOfLines={2}>{mark.reflection}</Text>
        </Pressable>
      ) : null}

      {/* Actions */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 16 }}>
        <Pressable onPress={onEditReflection} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <MaterialCommunityIcons name={mark.reflection ? 'pencil-outline' : 'plus'} size={14} color={gold} />
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: gold }}>
            {mark.reflection ? 'Editar' : 'Añadir reflexión'}
          </Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={onDelete}>
          <MaterialCommunityIcons name="trash-can-outline" size={16} color={isDark ? 'rgba(236,231,219,0.28)' : 'rgba(61,54,41,0.28)'} />
        </Pressable>
      </View>
    </View>
  );
};

export const MarksScreen: React.FC<MarksScreenProps> = ({
  isDark,
  active,
  appBarHeight,
  onClose,
  onOpenMark,
  onMarkDeleted,
}) => {
  const insets = useSafeAreaInsets();
  const [marks, setMarks] = useState<VerseMarksStore>([]);
  const [loading, setLoading] = useState(true);
  const [colorNames, setColorNames] = useState<Record<MarkColor, string>>(DEFAULT_COLOR_NAMES);
  const [filter, setFilter] = useState<MarkColor | null>(null);
  const [query, setQuery] = useState('');
  const [editingMark, setEditingMark] = useState<VerseMark | null>(null);
  const [editingColor, setEditingColor] = useState<MarkColor | null>(null);
  const [colorEditText, setColorEditText] = useState('');


  const bg = isDark ? '#000000' : '#efe6d4';
  const textColor = isDark ? '#ece7db' : '#3d3629';
  const mutedColor = isDark ? 'rgba(236,231,219,0.42)' : 'rgba(61,54,41,0.42)';
  const gold = isDark ? '#c5a059' : '#775a19';
  const border = isDark ? 'rgba(197,160,89,0.14)' : 'rgba(119,90,25,0.12)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    Promise.all([readVerseMarks(), readColorConfig()]).then(([marksData, colors]) => {
      setMarks(marksData);
      setColorNames(colors);
      setLoading(false);
    });
  }, [active]);

  const filtered = marks.filter((m) => {
    if (filter && m.color !== filter) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const inText = m.verseTexts.some((v) => v.text.toLowerCase().includes(q));
      const inReflection = m.reflection?.toLowerCase().includes(q) ?? false;
      const inBook = m.bookName.toLowerCase().includes(q);
      if (!inText && !inReflection && !inBook) return false;
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    const updated = await deleteVerseMark(id);
    setMarks(updated);
    onMarkDeleted?.();
  };

  const handleSaveReflection = async (id: string, reflection: string) => {
    const updated = await updateMarkReflection(id, reflection);
    setMarks(updated);
  };

  const startEditColor = (color: MarkColor) => {
    setEditingColor(color);
    setColorEditText(colorNames[color]);
  };

  const saveColorName = async () => {
    if (!editingColor) return;
    const updated = { ...colorNames, [editingColor]: colorEditText.trim() || DEFAULT_COLOR_NAMES[editingColor] };
    setColorNames(updated);
    await saveColorConfig(updated);
    setEditingColor(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: bg, paddingTop: appBarHeight ?? insets.top + 60 }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 128 }}
      >
        {/* Title */}
        <View style={{ marginBottom: 28, marginTop: 8 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay', fontSize: 32, color: textColor, letterSpacing: -0.5 }}>Mis Marcas</Text>
        </View>

        {/* Search bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: inputBg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20, gap: 10, borderWidth: 1, borderColor: border }}>
          <MaterialCommunityIcons name="magnify" size={18} color={mutedColor} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar en versículos o reflexiones..."
            placeholderTextColor={mutedColor}
            style={{ flex: 1, fontFamily: 'Inter', fontSize: 15, color: textColor }}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={16} color={mutedColor} />
            </Pressable>
          )}
        </View>

        {/* Color filter chips */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <Pressable
            onPress={() => setFilter(null)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: filter === null ? gold : border, backgroundColor: filter === null ? (isDark ? 'rgba(197,160,89,0.12)' : 'rgba(119,90,25,0.08)') : 'transparent' }}
          >
            <Text style={{ fontFamily: 'Inter-Medium', fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', color: filter === null ? gold : mutedColor }}>Todas</Text>
          </Pressable>
          {COLOR_KEYS.map((color) => {
            const palette = MARK_PALETTE[color];
            const active = filter === color;
            return (
              <Pressable
                key={color}
                onPress={() => setFilter(active ? null : color)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: active ? palette.dot : border, backgroundColor: active ? (isDark ? `${palette.bgDark}` : `${palette.bg}`) : 'transparent' }}
              >
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: palette.dot }} />
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: active ? palette.dot : mutedColor }}>{colorNames[color]}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Marks list */}
        {loading ? (
          // Loading skeletons
          <>
            <MarkCardSkeleton isDark={isDark} />
            <MarkCardSkeleton isDark={isDark} />
            <MarkCardSkeleton isDark={isDark} />
          </>
        ) : filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <MaterialCommunityIcons name="bookmark-outline" size={36} color={mutedColor} />
            <Text style={{ fontFamily: 'PlayfairDisplay-Italic', fontSize: 17, color: mutedColor, marginTop: 14, textAlign: 'center' }}>
              {query ? 'Sin resultados para esa búsqueda' : 'Aún no tienes marcas.\nMantén pulsado un versículo para comenzar.'}
            </Text>
          </View>
        ) : (
          filtered.map((mark) => (
            <MarkCard
              key={mark.id}
              mark={mark}
              colorName={colorNames[mark.color]}
              isDark={isDark}
              onOpenMark={() => onOpenMark?.(mark.bookSlug, mark.chapter, mark.verseStart)}
              onEditReflection={() => setEditingMark(mark)}
              onDelete={() => handleDelete(mark.id)}
            />
          ))
        )}

        {/* Color config section */}
        <View style={{ marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderTopColor: border }}>
          <Text style={{ fontFamily: 'Inter-Medium', fontSize: 10, letterSpacing: 2.4, textTransform: 'uppercase', color: mutedColor, marginBottom: 16 }}>
            Nombres de colores
          </Text>
          {COLOR_KEYS.map((color) => {
            const palette = MARK_PALETTE[color];
            const isEditing = editingColor === color;
            return (
              <View key={color} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: palette.dot }} />
                {isEditing ? (
                  <>
                    <TextInput
                      value={colorEditText}
                      onChangeText={setColorEditText}
                      autoFocus
                      style={{ flex: 1, fontFamily: 'Inter-Medium', fontSize: 14, color: textColor, borderBottomWidth: 1, borderBottomColor: gold, paddingVertical: 2 }}
                      onSubmitEditing={saveColorName}
                    />
                    <Pressable onPress={saveColorName}>
                      <MaterialCommunityIcons name="check" size={18} color={gold} />
                    </Pressable>
                    <Pressable onPress={() => setEditingColor(null)}>
                      <MaterialCommunityIcons name="close" size={18} color={mutedColor} />
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Text style={{ flex: 1, fontFamily: 'Inter-Medium', fontSize: 14, color: textColor }}>{colorNames[color]}</Text>
                    <Pressable onPress={() => startEditColor(color)}>
                      <MaterialCommunityIcons name="pencil-outline" size={16} color={mutedColor} />
                    </Pressable>
                  </>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Reflection editor modal */}
      {editingMark && (
        <ReflectionEditor
          mark={editingMark}
          isDark={isDark}
          onSave={(reflection) => handleSaveReflection(editingMark.id, reflection)}
          onClose={() => setEditingMark(null)}
        />
      )}
    </KeyboardAvoidingView>
  );
};
