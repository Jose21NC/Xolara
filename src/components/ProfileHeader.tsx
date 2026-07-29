import { User } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  title: string;
  badge?: string;
  avatarUrl?: string;
  onEdit?: () => void;
}

export default function ProfileHeader({
  name,
  title,
  badge,
  avatarUrl,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#d3c3bd] shadow-md">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#faf2f0] flex items-center justify-center">
            <User className="w-10 h-10 text-[#81746f]" />
          </div>
        )}
        {badge && (
          <div className="absolute -bottom-1 -right-1 bg-[#47654f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide leading-none shadow-md">
            {badge}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-1">
        <h1 className="figma-heading-xl text-[#412c21] text-center leading-[56px]">{name}</h1>
        <p className="figma-body-lg text-[#4f4540]">{title}</p>
        {onEdit && (
          <button
            onClick={onEdit}
            className="figma-body-sm text-[#d7b061] mt-2 hover:underline"
          >
            Editar perfil
          </button>
        )}
      </div>
    </div>
  );
}