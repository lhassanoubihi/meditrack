import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'security/2fa',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/two-factor/two-factor-setup.component').then(
        (m) => m.TwoFactorSetupComponent
      )
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./features/errors/forbidden/forbidden.component').then(
        (m) => m.ForbiddenComponent
      )
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: 'patients',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'medecin', 'infirmier'] },
    loadChildren: () =>
      import('./features/patients/patients.routes').then((m) => m.PATIENT_ROUTES)
  },
  {
    path: 'medecin',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['medecin'],
      title: 'Espace Médecin',
      description:
        'Dossiers patients, disponibilités, calendrier des RDV, consultations et ordonnances PDF.',
      icon: 'medical_services'
    },
    loadComponent: () =>
      import('./features/dashboard/role-home/role-home.component').then(
        (m) => m.RoleHomeComponent
      )
  },
  {
    path: 'infirmier',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['infirmier'],
      title: 'Espace Infirmier',
      description:
        'Consultation et suivi des dossiers médicaux patients et soins quotidiens.',
      icon: 'vaccines'
    },
    loadComponent: () =>
      import('./features/dashboard/role-home/role-home.component').then(
        (m) => m.RoleHomeComponent
      )
  },
  {
    path: 'pharmacien',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['pharmacien'],
      title: 'Espace Pharmacien',
      description:
        'Validation des ordonnances numériques et gestion du stock de médicaments.',
      icon: 'local_pharmacy'
    },
    loadComponent: () =>
      import('./features/dashboard/role-home/role-home.component').then(
        (m) => m.RoleHomeComponent
      )
  },
  {
    path: 'patient/dossier',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['patient'] },
    loadComponent: () =>
      import('./features/patients/my-dossier/my-dossier.component').then(
        (m) => m.MyDossierComponent
      )
  },
  {
    path: 'patient',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['patient'],
      title: 'Espace Patient',
      description:
        'Mon dossier médical en lecture seule, prise de rendez-vous en ligne et ordonnances.',
      icon: 'personal_injury'
    },
    loadComponent: () =>
      import('./features/dashboard/role-home/role-home.component').then(
        (m) => m.RoleHomeComponent
      )
  },
  { path: '**', redirectTo: 'login' }
];
