import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserRole } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

export function getDefaultRouteForRole(role?: UserRole | null): string {
  switch (role) {
    case 'admin':
      return '/admin/users';
    case 'medecin':
      return '/medecin';
    case 'infirmier':
      return '/infirmier';
    case 'pharmacien':
      return '/pharmacien';
    case 'patient':
      return '/patient';
    default:
      return '/login';
  }
}

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  if (!authService.isAuthenticated() || !user) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = (route.data?.['roles'] as UserRole[] | undefined) || [];
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
