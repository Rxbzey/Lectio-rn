import { BOOKS_META, slugifyBookName, type BookMeta } from '../../../data/biblia/books-meta';

export interface BookSection {
  title: string;
  ornament: string;
  columns: BookMeta[][];
}

const splitIntoColumns = (books: BookMeta[]): BookMeta[][] => {
  const midpoint = Math.ceil(books.length / 2);
  return [books.slice(0, midpoint), books.slice(midpoint)];
};

export const bookSections: BookSection[] = [
  {
    title: 'A N T I G U O   T E S T A M E N T O',
    ornament: '♦',
    columns: splitIntoColumns(BOOKS_META.filter((book) => book.testament === 'AT')),
  },
  {
    title: 'N U E V O   T E S T A M E N T O',
    ornament: '†',
    columns: splitIntoColumns(BOOKS_META.filter((book) => book.testament === 'NT')),
  },
];

export { BOOKS_META, slugifyBookName, type BookMeta };
