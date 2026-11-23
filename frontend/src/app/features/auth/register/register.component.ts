import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { environment } from '../../../../environments/environment';
import { RegisterPayload, RegisterResponse } from '../../../core/models/auth.model';

export const STRONG_PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (!password || !confirmPassword) {
    return null;
  }
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
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
          <mat-icon mat-card-avatar color="primary">person_add</mat-icon>
          <mat-card-title>Inscription Patient</mat-card-title>
          <mat-card-subtitle>Créez votre compte MediTrack sécurisé</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="name-row">
              <mat-form-field appearance="outline">
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="firstName" placeholder="Ex: Youssef" required />
                <mat-error *ngIf="registerForm.get('firstName')?.hasError('required')">
                  Le prénom est obligatoire
                </mat-error>
                <mat-error *ngIf="registerForm.get('firstName')?.hasError('minlength')">
                  Minimum 2 caractères
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="lastName" placeholder="Ex: Alami" required />
                <mat-error *ngIf="registerForm.get('lastName')?.hasError('required')">
                  Le nom est obligatoire
                </mat-error>
                <mat-error *ngIf="registerForm.get('lastName')?.hasError('minlength')">
                  Minimum 2 caractères
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Adresse email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="patient@meditrack.ma" required />
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                L'email est obligatoire
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Format d'email invalide
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Téléphone (optionnel)</mat-label>
              <input matInput type="tel" formControlName="phone" placeholder="+212 6 00 00 00 00" />
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
              <mat-hint>Min. 8 car., 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial</mat-hint>
              <mat-error *ngIf="registerForm.get('password')?.hasError('pattern')">
                Mot de passe trop faible
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmer le mot de passe</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="confirmPassword"
                required
              />
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                Les mots de passe ne correspondent pas
              </mat-error>
            </mat-form-field>

            <p class="error-banner" *ngIf="errorMessage">{{ errorMessage }}</p>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width submit-btn"
              [disabled]="registerForm.invalid || isLoading"
            >
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading">Créer mon compte patient</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <span>Déjà inscrit ?</span>
          <a mat-button color="primary" routerLink="/login">Se connecter</a>
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
      max-width: 520px;
      padding: 1rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .name-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
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
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  readonly registerForm = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.pattern(STRONG_PASSWORD_PATTERN)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordsMatchValidator }
  );

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const raw = this.registerForm.getRawValue();
    const payload: RegisterPayload = {
      firstName: (raw.firstName || '').trim(),
      lastName: (raw.lastName || '').trim(),
      email: (raw.email || '').trim().toLowerCase(),
      password: raw.password || '',
      phone: (raw.phone || '').trim() || undefined
    };

    this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.snackBar.open(res.message || 'Compte patient créé avec succès', 'OK', {
          duration: 4000
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Erreur lors de la création du compte. Veuillez réessayer.';
      }
    });
  }
}
