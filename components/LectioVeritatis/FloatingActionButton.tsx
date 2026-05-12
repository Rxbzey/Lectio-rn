import { useState } from 'react';
import { FAB } from 'react-native-paper';

interface FloatingActionButtonProps {
  isDark: boolean;
  isReader?: boolean;
  onHome?: () => void;
  onBooks?: () => void;
  onSearch?: () => void;
  onChapters?: () => void;
  onVerses?: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  isDark,
  isReader,
  onHome,
  onBooks,
  onSearch,
  onChapters,
  onVerses,
}) => {
  const [open, setOpen] = useState(false);
  const closeThen = (action?: () => void) => {
    setOpen(false);
    action?.();
  };
  const actionStyle = { backgroundColor: isDark ? '#080808' : '#f5f0e8' };
  const labelStyle = { color: isDark ? '#ece7db' : '#3d3629' };

  return (
    <FAB.Group
      open={open}
      visible
      icon={open ? 'close' : 'plus'}
      color="#c9a84c"
      backdropColor={isDark ? 'rgba(5,5,5,0.92)' : 'rgba(239,230,212,0.92)'}
      fabStyle={{
        backgroundColor: isDark ? '#000000' : '#d4cfc5',
        borderRadius: 999,
        right: 8,
        bottom: 8,
        shadowColor: '#c9a84c',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 28,
        elevation: 24,
      }}
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 50,
        shadowColor: '#c9a84c',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.75,
        shadowRadius: 34,
        elevation: 24,
      }}
      actions={[
        ...(isReader
          ? [
              {
                icon: 'view-grid-outline',
                label: 'Capítulos',
                color: '#c9a84c',
                style: actionStyle,
                labelStyle,
                onPress: () => closeThen(onChapters),
              },
              {
                icon: 'format-list-bulleted',
                label: 'Versículo',
                color: '#c9a84c',
                style: actionStyle,
                labelStyle,
                onPress: () => closeThen(onVerses),
              },
            ]
          : []),
        {
          icon: 'home-outline',
          label: 'Inicio',
          color: '#c9a84c',
          style: actionStyle,
          labelStyle,
          onPress: () => closeThen(onHome),
        },
        {
          icon: 'book-open-page-variant',
          label: 'Libros',
          color: '#c9a84c',
          style: actionStyle,
          labelStyle,
          onPress: () => closeThen(onBooks),
        },
        {
          icon: 'magnify',
          label: 'Buscar',
          color: '#c9a84c',
          style: actionStyle,
          labelStyle,
          onPress: () => closeThen(onSearch),
        },
      ]}
      onStateChange={({ open }) => setOpen(open)}
    />
  );
};
