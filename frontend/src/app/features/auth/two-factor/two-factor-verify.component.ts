import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';
import { getDefaultRouteForRole } from '../../../core/guards/role.guard';

@Component({
  selector: 'app-two-factor-verify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
          <mat-icon mat-card-avatar color="primary">verified_user</mat-icon>
          <mat-card-title>Double Authentification (2FA)</mat-card-title>
          <mat-card-subtitle>
            Saisissez le code TOTP à 6 chiffres généré par votre application d'authentification
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <p class="user-hint" *ngIf="pendingUser && !sessionExpired">
            Compte : <strong>{{ pendingUser.email }}</strong>
          </p>

          <div class="warning-banner" *ngIf="sessionExpired">
            <mat-icon>schedule</mat-icon>
            <div>
              <strong>Session 2FA expirée ou introuvable.</strong>
              <p>{{ errorMessage || 'Veuillez vous reconnecter pour générer un nouveau défi 2FA.' }}</p>
            </div>
          </div>

          <form
            *ngIf="!sessionExpired"
            [formGroup]="verifyForm"
            (ngSubmit)="onSubmit()"
            class="auth-form"
          >
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Code de vérification (6 chiffres)</mat-label>
              <input
                matInput
                type="text"
                inputmode="numeric"
                maxlength="6"
                autocomplete="one-time-code"
                formControlName="code"
                placeholder="123456"
                class="otp-input"
                required
              />
              <mat-hint>Code renouvelé toutes les 30 secondes (Google Authenticator / Authy)</mat-hint>
              <mat-error *ngIf="verifyForm.get('code')?.hasError('required')">
                Le code à 6 chiffres est obligatoire
              </mat-error>
              <mat-error *ngIf="verifyForm.get('code')?.hasError('pattern')">
                Le code doit contenir exactement 6 chiffres numériques
              </mat-error>
            </mat-form-field>

            <div class="error-banner" *ngIf="errorMessage">
              <mat-icon>error_outline</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width submit-btn"
              [disabled]="verifyForm.invalid || isLoading"
            >
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading">Vérifier et accéder à mon espace</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button color="accent" type="button" (click)="backToLogin()">
            <mat-icon>arrow_back</mat-icon>
            Retour à la connexion
          </button>
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
      max-width: 460px;
      padding: 1rem;
    }
    .user-hint {
      margin: 1rem 0 0.5rem;
      color: #334e68;
      font-size: 0.92rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      margin-top: 1rem;
    }
    .full-width {
      width: 100%;
    }
    .otp-input {
      font-family: monospace;
      font-size: 1.4rem;
      letter-spacing: 0.4rem;
      text-align: center;
    }
    .submit-btn {
      height: 44px;
    }
    .error-banner,
    .warning-banner {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: 6px;
      font-size: 0.9rem;
    }
    .error-banner {
      color: #c62828;
      background: #ffebee;
    }
    .warning-banner {
      color: #8d4e00;
      background: #fff8e1;
      margin-top: 1rem;
    }
    .warning-banner p {
      margin: 0.25rem 0 0;
    }
  `]
})
export class TwoFactorVerifyComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  pendingUser: User | null = null;
  isLoading = false;
  sessionExpired = false;
  errorMessage = '';

  readonly verifyForm = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  ngOnInit(): void {
    this.pendingUser = this.authService.getPendingTwoFactorUser();
    if (!this.authService.hasPendingTwoFactor()) {
      this.sessionExpired = true;
      this.errorMessage =
        'Aucun défi 2FA actif. Veuillez saisir vos identifiants sur la page de connexion.';
    }
  }

  onSubmit(): void {
    if (this.verifyForm.invalid || this.isLoading || this.sessionExpired) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const code = (this.verifyForm.get('code')?.value || '').trim();

    this.authService.verifyTwoFactor(code).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.snackBar.open(res.message || 'Vérification 2FA réussie', 'OK', { duration: 3000 });
        this.router.navigate([getDefaultRouteForRole(res?.data?.user?.role)]);
      },
      error: (err) => {
        this.isLoading = false;
        const apiMessage: string = err?.error?.message || '';

        if (apiMessage.toLowerCase().includes('session 2fa expirée') || apiMessage.toLowerCase().includes('token temporaire')) {
          this.sessionExpired = true;
          this.authService.clearPendingTwoFactor();
          this.errorMessage = apiMessage || 'Session 2FA expirée : veuillez vous reconnecter.';
          return;
        }

        if (err?.status === 401) {
          this.errorMessage =
            apiMessage ||
            'Code 2FA invalide ou expiré. Vérifiez le code actuel de votre application et réessayez.';
          this.verifyForm.get('code')?.reset('');
          return;
        }

        this.errorMessage =
          apiMessage || 'Erreur lors de la vérification 2FA. Veuillez réessayer.';
      }
    });
  }

  backToLogin(): void {
    this.authService.clearPendingTwoFactor();
    this.router.navigate(['/login']);
  }
}
