import { Pressable, Text, View } from 'react-native';
import { getMarkForVerse, MARK_PALETTE, type VerseMarksStore } from '../../lib/verseMarks';

interface Verse {
  number: number;
  text: string;
}

interface VerseBlockProps {
  verses: Verse[];
  isDark: boolean;
  bookName: string;
  bookSlug: string;
  chapter: number;
  testamentLabel: string;
  highlightVerse?: number;
  selectedVerses?: Set<number>;
  verseMarks?: VerseMarksStore;
  onVerseRef?: (verseNumber: number, ref: View | null) => void;
  onVerseLongPress?: (verseNumber: number) => void;
  onVersePress?: (verseNumber: number) => void;
}

const OrnamentDivider: React.FC<{ gold: string }> = ({ gold }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 28 }}>
    <View style={{ flex: 1, height: 1, backgroundColor: `${gold}40` }} />
    <Text style={{ color: gold, opacity: 0.55, fontSize: 13, fontFamily: 'PlayfairDisplay' }}>✢</Text>
    <View style={{ width: 56, height: 1, backgroundColor: `${gold}38` }} />
  </View>
);

export const VerseBlock: React.FC<VerseBlockProps> = ({ verses, isDark, bookName, bookSlug, chapter, testamentLabel, highlightVerse, selectedVerses, verseMarks, onVerseRef, onVerseLongPress, onVersePress }) => {
  const textColor = isDark ? 'rgba(201,196,184,0.78)' : 'rgba(61,54,41,0.82)';
  const gold = isDark ? '#c5a059' : '#775a19';
  const mutedGold = isDark ? 'rgba(197,160,89,0.55)' : 'rgba(119,90,25,0.55)';
  const rangeStart = verses[0].number;
  const rangeEnd = verses[verses.length - 1].number;

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingBottom: 0,
        marginBottom: 64,
      }}
    >
      {/* Header: bookName / chapter / testament */}
      <View style={{ paddingTop: 48, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Text
            style={{
              color: gold,
              fontFamily: 'PlayfairDisplay',
              fontSize: 22,
              lineHeight: 30,
              opacity: 0.88,
            }}
          >
            {bookName}
          </Text>
          <Text style={{ color: mutedGold, fontFamily: 'Inter-Light', fontSize: 16 }}>/</Text>
          <Text
            style={{
              color: gold,
              fontFamily: 'Inter-Medium',
              fontSize: 11,
              lineHeight: 18,
              letterSpacing: 3.8,
              textTransform: 'uppercase',
              opacity: 0.72,
            }}
          >
            {'Capítulo '}
            <Text style={{ fontFamily: 'PlayfairDisplay', fontSize: 16, letterSpacing: 0, lineHeight: 18 }}>
              {chapter}
            </Text>
          </Text>
          <Text style={{ color: mutedGold, fontFamily: 'Inter-Light', fontSize: 16 }}>/</Text>
          <Text
            style={{
              color: gold,
              fontFamily: 'Inter-Medium',
              fontSize: 9,
              lineHeight: 16,
              letterSpacing: 3.2,
              textTransform: 'uppercase',
              opacity: 0.65,
            }}
          >
            {testamentLabel}
          </Text>
        </View>

        {/* Verse range */}
        <Text
          style={{
            color: gold,
            opacity: 0.48,
            fontFamily: 'PlayfairDisplay',
            fontSize: 16,
            lineHeight: 24,
          }}
        >
          {rangeStart === rangeEnd ? `Versículo ${rangeStart}` : `Versículos ${rangeStart}–${rangeEnd}`}
        </Text>
      </View>

      {/* Top ornament divider */}
      <OrnamentDivider gold={gold} />

      {/* Verse text with true editorial superscript numbers */}
      <View style={{ flexDirection: 'column' }}>
        {verses.map((verse) => {
          const isHighlighted = verse.number === highlightVerse;
          const isSelected = selectedVerses?.has(verse.number) ?? false;
          const isActive = isHighlighted || isSelected;
          const mark = verseMarks ? getMarkForVerse(verseMarks, bookSlug, chapter, verse.number) : undefined;
          const palette = mark ? MARK_PALETTE[mark.color] : undefined;
          return (
            <Pressable
              key={verse.number}
              ref={(ref) => onVerseRef?.(verse.number, ref as any)}
              onLongPress={() => onVerseLongPress?.(verse.number)}
              onPress={() => { if (selectedVerses && selectedVerses.size > 0) onVersePress?.(verse.number); }}
              delayLongPress={600}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  backgroundColor: isSelected
                    ? (isDark ? 'rgba(197,160,89,0.15)' : 'rgba(119,90,25,0.10)')
                    : isHighlighted
                      ? (isDark ? 'rgba(197,160,89,0.10)' : 'rgba(119,90,25,0.07)')
                      : palette
                        ? (isDark ? palette.bgDark : palette.bg)
                        : 'transparent',
                  borderLeftWidth: isActive || !!palette ? 2 : 0,
                  borderLeftColor: isActive ? gold : palette ? (isDark ? palette.borderDark : palette.border) : gold,
                  paddingLeft: isActive || !!palette ? 10 : 0,
                  paddingVertical: isActive || !!palette ? 6 : 0,
                  marginLeft: isActive || !!palette ? -12 : 0,
                  borderRadius: isActive || !!palette ? 4 : 0,
                }}
              >
                {/* Superscript verse number */}
                <Text
                  style={{
                    color: gold,
                    fontFamily: 'Inter-Medium',
                    fontSize: 11,
                    lineHeight: 14,
                    marginTop: 2,
                    opacity: isActive ? 1 : 0.82,
                  }}
                >
                  {verse.number}
                </Text>
                {/* Thin space + verse text */}
                <Text
                  style={{
                    color: isActive
                      ? (isDark ? 'rgba(201,196,184,0.96)' : 'rgba(61,54,41,0.96)')
                      : textColor,
                    fontFamily: isSelected ? 'PlayfairDisplay-Bold' : 'PlayfairDisplay',
                    fontSize: 22,
                    lineHeight: 30,
                    letterSpacing: 0.06,
                    flexShrink: 1,
                  }}
                >
                  {'\u2009'}{verse.text}{' '}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Bottom ornament divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 36 }}>
        <View style={{ width: 56, height: 1, backgroundColor: `${gold}2a` }} />
        <Text style={{ color: gold, opacity: 0.38, fontSize: 13, fontFamily: 'PlayfairDisplay' }}>†</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: `${gold}2a` }} />
      </View>
    </View>
  );
};
