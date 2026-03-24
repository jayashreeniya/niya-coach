'use client';

interface ReflectionInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
}

export function ReflectionInput({
  value,
  onChange,
  maxLength = 200,
  placeholder = 'What did you notice during this practice?',
}: ReflectionInputProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-niya-400 focus:ring-2 focus:ring-niya-100 outline-none resize-none"
      />
      <p className="text-right text-xs text-gray-400 mt-1">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
