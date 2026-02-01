import { getContrastColor } from '../../utils/colors';

interface TeamMemberBadgeProps {
  name: string;
  color: string;
  size?: 'sm' | 'md';
}

export function TeamMemberBadge({ name, color, size = 'sm' }: TeamMemberBadgeProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-medium`}
      style={{ backgroundColor: color, color: getContrastColor(color) }}
      title={name}
    >
      {initials}
    </div>
  );
}
