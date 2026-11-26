import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: '2fa/verify',
    loadComponent: () =>
      import('./two-factor/two-factor-verify.component').then(
        (m) => m.TwoFactorVerifyComponent
      )
  }
];
