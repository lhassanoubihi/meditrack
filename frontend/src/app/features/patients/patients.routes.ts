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
    path: ':id/edit',
    loadComponent: () =>
      import('./patient-edit/patient-edit.component').then(
        (m) => m.PatientEditComponent
      )
  },
  {
    path: '',
    redirectTo: 'new',
    pathMatch: 'full'
  }
];
