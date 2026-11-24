import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { LoginPayload } from '../../../core/models/auth.model';
import { getDefaultRouteForRole } from '../../../core/guards/role.guard';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-wrapper">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-icon mat-card-avatar color="primary">lock</mat-icon>
          <mat-card-title>Connexion MediTrack</mat-card-title>
          <mat-card-subtitle>Accédez à votre espace médical sécurisé</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Adresse email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="exemple@meditrack.ma" required />
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                L'adresse email est obligatoire
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Adresse email invalide
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                required
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hidePassword = !hidePassword"
                [attr.aria-label]="'Afficher le mot de passe'"
              >
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Le mot de passe est obligatoire
              </mat-error>
            </mat-form-field>

            <p class="error-banner" *ngIf="errorMessage">{{ errorMessage }}</p>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width submit-btn"
              [disabled]="loginForm.invalid || isLoading"
            >
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading">Se connecter</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <span>Nouveau patient ?</span>
          <a mat-button color="accent" routerLink="/register">Créer un compte</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 1rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .full-width {
      width: 100%;
    }
    .submit-btn {
      height: 44px;
      margin-top: 0.5rem;
    }
    .error-banner {
      color: #c62828;
      background: #ffebee;
      padding: 0.75rem;
      border-radius: 4px;
      margin: 0;
      font-size: 0.9rem;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const raw = this.loginForm.getRawValue();
    const payload: LoginPayload = {
      email: (raw.email || '').trim().toLowerCase(),
      password: raw.password || ''
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.snackBar.open(res.message || 'Connexion réussie', 'OK', { duration: 3000 });
        this.router.navigate([getDefaultRouteForRole(res?.data?.user?.role)]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Identifiants invalides ou serveur indisponible.';
      }
    });
  }
}
