import { useThemeStore } from '../../stores/themeStore';

interface RecordWinButtonProps {
  onClick: () => void;
}

export default function RecordWinButton({ onClick }: RecordWinButtonProps) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <button
      onClick={onClick}
      className="w-full text-white font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
      style={{
        minHeight: '60px',
        backgroundColor: theme.primary,
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.primary}
    >
      Record Win
    </button>
  );
}
