import { useRef, useEffect } from "react";

export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(val);
    }, 300);
  };

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" />
      </svg>
      <input
        type="text"
        placeholder="Search tasks..."
        defaultValue={value}
        onChange={handleChange}
        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-cream text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300 transition-all"
      />
    </div>
  );
}
