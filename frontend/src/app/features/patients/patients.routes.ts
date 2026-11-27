import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./patient-list/patient-list.component').then(
        (m) => m.PatientListComponent
      )
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./patient-create/patient-create.component').then(
        (m) => m.PatientCreateComponent
      )
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./patient-detail/patient-detail.component').then(
        (m) => m.PatientDetailComponent
      )
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./patient-edit/patient-edit.component').then(
        (m) => m.PatientEditComponent
      )
  }
];
