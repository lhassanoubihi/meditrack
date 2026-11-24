import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForbiddenComponent } from './features/errors/forbidden/forbidden.component';
import { RoleHomeComponent } from './features/dashboard/role-home/role-home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['admin'],
      title: 'Espace Administrateur',
      description: 'Gestion des comptes du personnel, rôles, archivage et journal d’audit RGPD.',
      icon: 'admin_panel_settings'
    },
    component: RoleHomeComponent
  },
  {
    path: 'medecin',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['medecin'],
      title: 'Espace Médecin',
      description: 'Dossiers patients, disponibilités, calendrier des RDV, consultations et ordonnances PDF.',
      icon: 'medical_services'
    },
    component: RoleHomeComponent
  },
  {
    path: 'infirmier',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['infirmier'],
      title: 'Espace Infirmier',
      description: 'Consultation et suivi des dossiers médicaux patients et soins quotidiens.',
      icon: 'vaccines'
    },
    component: RoleHomeComponent
  },
  {
    path: 'pharmacien',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['pharmacien'],
      title: 'Espace Pharmacien',
      description: 'Validation des ordonnances numériques et gestion du stock de médicaments.',
      icon: 'local_pharmacy'
    },
    component: RoleHomeComponent
  },
  {
    path: 'patient',
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['patient'],
      title: 'Espace Patient',
      description: 'Mon dossier médical en lecture seule, prise de rendez-vous en ligne et ordonnances.',
      icon: 'personal_injury'
    },
    component: RoleHomeComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
