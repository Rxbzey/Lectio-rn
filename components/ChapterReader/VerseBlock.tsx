import { Text, View } from 'react-native';

interface Verse {
  number: number;
  text: string;
}

interface VerseBlockProps {
  verses: Verse[];
  isDark: boolean;
  bookName: string;
  chapter: number;
  testamentLabel: string;
}

const OrnamentDivider: React.FC<{ gold: string }> = ({ gold }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 28 }}>
    <View style={{ flex: 1, height: 1, backgroundColor: `${gold}40` }} />
    <Text style={{ color: gold, opacity: 0.55, fontSize: 13, fontFamily: 'PlayfairDisplay' }}>✢</Text>
    <View style={{ width: 56, height: 1, backgroundColor: `${gold}38` }} />
  </View>
);

export const VerseBlock: React.FC<VerseBlockProps> = ({ verses, isDark, bookName, chapter, testamentLabel }) => {
  const textColor = isDark ? 'rgba(226,226,226,0.86)' : 'rgba(23,18,11,0.84)';
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

      {/* Verse text with inline superscript numbers */}
      <Text
        style={{
          color: textColor,
          fontFamily: 'PlayfairDisplay',
          fontSize: 22,
          lineHeight: 30,
          letterSpacing: 0.06,
          textAlign: 'left',
        }}
      >
        {verses.map((verse, index) => (
          <Text key={verse.number}>
            {index > 0 ? ' ' : ''}
            <Text
              style={{
                color: gold,
                fontFamily: 'Inter-Medium',
                fontSize: 10,
                opacity: 0.72,
              }}
            >
              {verse.number}
            </Text>
            <Text
              style={{
                color: textColor,
                fontFamily: 'PlayfairDisplay',
                fontSize: 22,
              }}
            >
              {'\u00A0'}{verse.text}
            </Text>
          </Text>
        ))}
      </Text>

      {/* Bottom ornament divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 36 }}>
        <View style={{ width: 56, height: 1, backgroundColor: `${gold}2a` }} />
        <Text style={{ color: gold, opacity: 0.38, fontSize: 13, fontFamily: 'PlayfairDisplay' }}>†</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: `${gold}2a` }} />
      </View>
    </View>
  );
};
