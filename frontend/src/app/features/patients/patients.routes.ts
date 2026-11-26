import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () =>
      import('./patient-create/patient-create.component').then(
        (m) => m.PatientCreateComponent
      )
  },
  {
    path: '',
    redirectTo: 'new',
    pathMatch: 'full'
  }
];
