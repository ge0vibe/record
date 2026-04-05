"use client";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export default function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          className={`text-2xl transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } ${star <= value ? "text-yellow-400" : "text-gray-600"}`}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
