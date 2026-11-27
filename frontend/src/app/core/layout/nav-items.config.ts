import { UserRole } from '../models/auth.model';

export interface NavMenuItem {
  label: string;
  route: string;
  icon: string;
  roles: UserRole[];
  section: 'principal' | 'securite';
  exact?: boolean;
}

export const ROLE_DISPLAY_LABELS: Record<UserRole, string> = {
  admin: 'Administrateur',
  medecin: 'Médecin',
  infirmier: 'Infirmier',
  pharmacien: 'Pharmacien',
  patient: 'Patient'
};

export const ROLE_NAV_ITEMS: NavMenuItem[] = [
  {
    label: 'Tableau de bord',
    route: '/admin',
    icon: 'admin_panel_settings',
    roles: ['admin'],
    section: 'principal',
    exact: true
  },
  {
    label: 'Personnel médical',
    route: '/admin/users',
    icon: 'manage_accounts',
    roles: ['admin'],
    section: 'principal'
  },
  {
    label: 'Dossiers patients',
    route: '/patients',
    icon: 'folder_shared',
    roles: ['admin', 'medecin', 'infirmier'],
    section: 'principal',
    exact: true
  },
  {
    label: 'Nouveau dossier patient',
    route: '/patients/new',
    icon: 'person_add',
    roles: ['admin', 'medecin', 'infirmier'],
    section: 'principal'
  },
  {
    label: 'Espace Médecin',
    route: '/medecin',
    icon: 'medical_services',
    roles: ['medecin'],
    section: 'principal',
    exact: true
  },
  {
    label: 'Espace Infirmier',
    route: '/infirmier',
    icon: 'vaccines',
    roles: ['infirmier'],
    section: 'principal',
    exact: true
  },
  {
    label: 'Espace Pharmacie',
    route: '/pharmacien',
    icon: 'local_pharmacy',
    roles: ['pharmacien'],
    section: 'principal',
    exact: true
  },
  {
    label: 'Mon Espace Patient',
    route: '/patient',
    icon: 'personal_injury',
    roles: ['patient'],
    section: 'principal',
    exact: true
  },
  {
    label: 'Sécurité 2FA',
    route: '/security/2fa',
    icon: 'security',
    roles: ['admin', 'medecin', 'infirmier', 'pharmacien', 'patient'],
    section: 'securite'
  }
];

export function getNavItemsForRole(role: UserRole): NavMenuItem[] {
  return ROLE_NAV_ITEMS.filter((item) => item.roles.includes(role));
}
