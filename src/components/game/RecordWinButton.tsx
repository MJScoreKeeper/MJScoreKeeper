interface RecordWinButtonProps {
  onClick: () => void;
}

export default function RecordWinButton({ onClick }: RecordWinButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#1B5E20] hover:bg-[#145216] text-white font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
      style={{ minHeight: '60px' }}
    >
      Record Win
    </button>
  );
}
