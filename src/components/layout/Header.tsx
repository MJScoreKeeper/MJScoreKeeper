interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export default function Header({ title, onBack }: HeaderProps) {
  return (
    <div className="bg-[#1B5E20] text-white py-4 px-4 shadow-lg">
      <div className="max-w-2xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded mb-2 transition"
          >
            ← Back
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </div>
  );
}
