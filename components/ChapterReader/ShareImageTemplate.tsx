import { Text, View } from 'react-native';

interface ShareImageTemplateProps {
  isDark: boolean;
  bookName: string;
  chapter: number;
  verses: { number: number; text: string }[];
  rangeStart: number;
  rangeEnd: number;
}

export const ShareImageTemplate: React.FC<ShareImageTemplateProps> = ({
  isDark,
  bookName,
  chapter,
  verses,
  rangeStart,
  rangeEnd,
}) => {
  const isSingle = rangeStart === rangeEnd;
  const rangeLabel = isSingle ? `Versículo ${rangeStart}` : `Versículos ${rangeStart}–${rangeEnd}`;

  const bg = isDark ? '#0a0908' : '#efe6d4';
  const text = isDark ? '#ece7db' : '#3d3629';
  const gold = isDark ? 'rgba(201,168,76,0.75)' : 'rgba(100,72,18,0.80)';
  const goldMuted = isDark ? 'rgba(201,168,76,0.30)' : 'rgba(100,72,18,0.25)';
  const goldBorder = isDark ? 'rgba(201,168,76,0.18)' : 'rgba(100,72,18,0.18)';
  const goldAccent = isDark ? 'rgba(201,168,76,0.85)' : 'rgba(100,72,18,0.85)';
  const goldSubtle = isDark ? 'rgba(201,168,76,0.65)' : 'rgba(100,72,18,0.60)';
  const goldLine = isDark ? 'rgba(201,168,76,0.40)' : 'rgba(100,72,18,0.30)';
  const goldWatermark = isDark ? 'rgba(201,168,76,0.04)' : 'rgba(100,72,18,0.05)';
  const footerMuted = isDark ? 'rgba(212,207,197,0.40)' : 'rgba(61,54,41,0.35)';
  const footerUrl = isDark ? 'rgba(201,168,76,0.60)' : 'rgba(100,72,18,0.55)';

  return (
    <View
      style={{
        width: 1080,
        minHeight: 1080,
        paddingHorizontal: 88,
        paddingVertical: 96,
        backgroundColor: bg,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Watermark chapter number */}
      <Text
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          fontFamily: 'PlayfairDisplay',
          fontSize: 480,
          color: goldWatermark,
          lineHeight: 480,
        }}
        numberOfLines={1}
      >
        {chapter}
      </Text>

      {/* Top section */}
      <View style={{ zIndex: 1 }}>
        {/* Brand row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 48 }}>
          <View style={{ width: 52, height: 1, backgroundColor: goldLine }} />
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 13,
              letterSpacing: 10,
              textTransform: 'uppercase',
              color: gold,
            }}
          >
            Lectio Veritatis
          </Text>
        </View>

        {/* Book name */}
        <Text
          style={{
            fontFamily: 'PlayfairDisplay',
            fontSize: 76,
            lineHeight: 82,
            letterSpacing: -1,
            color: text,
            marginBottom: 16,
          }}
        >
          {bookName}
        </Text>

        {/* Chapter + range */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 20, marginBottom: 64 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay', fontSize: 28, color: goldAccent, fontStyle: 'italic' }}>
            Capítulo {chapter}
          </Text>
          <Text style={{ color: goldMuted, fontSize: 20 }}>·</Text>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 14,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: goldSubtle,
            }}
          >
            {rangeLabel}
          </Text>
        </View>

        {/* Verse text */}
        <Text
          style={{
            fontFamily: 'PlayfairDisplay',
            fontSize: 34,
            lineHeight: 54,
            color: text,
            letterSpacing: 0.2,
          }}
        >
          {verses.map((v, i) => (
            <Text key={v.number}>
              <Text
                style={{
                  fontFamily: 'Inter-Medium',
                  fontSize: 15,
                  color: gold,
                }}
              >
                {v.number}{' '}
              </Text>
              <Text>{v.text}{i < verses.length - 1 ? ' ' : ''}</Text>
            </Text>
          ))}
        </Text>
      </View>

      {/* Footer */}
      <View
        style={{
          zIndex: 1,
          marginTop: 72,
          paddingTop: 32,
          borderTopWidth: 1,
          borderTopColor: goldBorder,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter-Medium',
            fontSize: 12,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: footerMuted,
          }}
        >
          Biblia Latinoamericana
        </Text>
        <Text
          style={{
            fontFamily: 'Inter',
            fontSize: 13,
            color: footerUrl,
            letterSpacing: 0.5,
          }}
        >
          lectioveritatis.app
        </Text>
      </View>
    </View>
  );
};
