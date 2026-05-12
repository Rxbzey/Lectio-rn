import { Pressable, Text, View } from 'react-native';
import { BookMeta } from './data/books';

interface BookButtonProps {
  book: BookMeta;
  active?: boolean;
  bodyColor: string;
  onPress?: () => void;
}

export const BookButton: React.FC<BookButtonProps> = ({ book, active, bodyColor, onPress }) => {
  return (
    <Pressable className="w-full min-h-8 flex-row items-center justify-between" onPress={onPress}>
      <Text
        className={`text-lg ${active ? 'text-gold' : bodyColor}`}
        style={{
          fontFamily: active ? 'PlayfairDisplay-Italic' : 'PlayfairDisplay',
          lineHeight: 32,
          textShadowColor: active ? 'rgba(201,168,76,0.35)' : 'transparent',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: active ? 10 : 0,
        }}
      >
        {book.name}
      </Text>
      {active ? (
        <View
          className="w-1.5 h-1.5 rounded-full bg-gold"
          style={{
            shadowColor: '#c9a84c',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 8,
            elevation: 8,
          }}
        />
      ) : null}
    </Pressable>
  );
};
