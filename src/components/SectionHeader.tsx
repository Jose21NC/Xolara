interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-baseline">
      <h2 className="figma-heading-lg text-[#412c21]">{title}</h2>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="figma-body-sm text-[#412c21] hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}