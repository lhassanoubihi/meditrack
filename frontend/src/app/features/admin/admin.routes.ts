import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    data: {
      roles: ['admin'],
      title: 'Espace Administrateur',
      description:
        'Gestion des comptes du personnel, rôles, archivage et journal d’audit RGPD.',
      icon: 'admin_panel_settings'
    },
    loadComponent: () =>
      import('../dashboard/role-home/role-home.component').then(
        (m) => m.RoleHomeComponent
      )
  },
  {
    path: 'users',
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./staff-management/staff-management.component').then(
        (m) => m.StaffManagementComponent
      )
  }
];
