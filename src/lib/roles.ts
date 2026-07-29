export type Role = 'visitor' | 'traveler' | 'guide' | 'admin';

const ROLE_HIERARCHY: Record<Role, number> = {
  visitor: 0,
  traveler: 1,
  guide: 2,
  admin: 3,
};

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canAccess(userRole: Role, resource: string): boolean {
  const permissions: Record<string, Role> = {
    'explore': 'visitor',
    'detail': 'visitor',
    'book': 'traveler',
    'create-experience': 'guide',
    'manage-bookings': 'guide',
    'admin': 'admin',
  };
  const required = permissions[resource] as Role | undefined;
  if (!required) return false;
  return hasPermission(userRole, required);
}

export function getRoleName(role: Role): string {
  const names: Record<Role, string> = {
    visitor: 'Visitante',
    traveler: 'Viajero',
    guide: 'Guía Local',
    admin: 'Administrador',
  };
  return names[role];
}
