import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BookMeta } from './data/books';
import { BookStatus } from '../../lib/bookProgress';

interface BookButtonProps {
  book: BookMeta;
  active?: boolean;
  status?: BookStatus;
  bodyColor: string;
  onPress?: () => void;
}

export const BookButton: React.FC<BookButtonProps> = ({ book, active, status = 'unread', bodyColor, onPress }) => {
  return (
    <Pressable className="w-full min-h-8 flex-row items-center justify-between" onPress={onPress}>
      <Text
        className={`text-lg ${active ? 'text-gold' : status !== 'unread' ? 'text-gold' : bodyColor}`}
        style={{
          fontFamily: active ? 'PlayfairDisplay-Italic' : 'PlayfairDisplay',
          lineHeight: 32,
          opacity: status === 'completed' ? 0.55 : 1,
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
      ) : status === 'completed' ? (
        <MaterialCommunityIcons name="check" size={14} color="rgba(197,160,89,0.55)" />
      ) : status === 'started' ? (
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: 'rgba(197,160,89,0.50)',
          }}
        />
      ) : null}
    </Pressable>
  );
};
