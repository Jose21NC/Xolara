import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  onClick: () => void;
}

interface ActionListProps {
  items: ActionItem[];
}

export default function ActionList({ items }: ActionListProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow-[0_4px_12px_rgba(65,44,33,0.05)] overflow-hidden">
      {items.map((item, idx) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className={`w-full flex items-center justify-between px-5 py-4 transition-apple hover:bg-[rgba(250,242,240,0.5)] active:scale-[0.99] ${
            idx < items.length - 1 ? 'border-b border-[#d3c3bd]/30' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span className={item.color || 'text-[#412c21]'}>{item.icon}</span>
            )}
            <span
              className="figma-body-lg text-left"
              style={{ color: item.color || '#412c21' }}
            >
              {item.label}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#81746f]" />
        </button>
      ))}
    </div>
  );
}