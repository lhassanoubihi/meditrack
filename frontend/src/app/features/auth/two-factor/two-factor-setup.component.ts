import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';

@Component({
  selector: 'app-two-factor-setup',
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
    <div class="setup-wrapper">
      <mat-card class="setup-card">
        <mat-card-header>
          <mat-icon mat-card-avatar color="primary">security</mat-icon>
          <mat-card-title>Sécurité du compte — Double Authentification (2FA)</mat-card-title>
          <mat-card-subtitle>
            Protégez l'accès aux données médicales sensibles par code TOTP (Google Authenticator / Authy)
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="status-row">
            <span>Statut actuel :</span>
            <span class="status-pill" [class.enabled]="isTwoFactorEnabled">
              <mat-icon>{{ isTwoFactorEnabled ? 'verified_user' : 'gpp_maybe' }}</mat-icon>
              {{ isTwoFactorEnabled ? '2FA Activée' : '2FA Désactivée' }}
            </span>
          </div>

          <div class="error-banner" *ngIf="errorMessage">
            <mat-icon>error_outline</mat-icon>
            <span>{{ errorMessage }}</span>
          </div>

          <ng-container *ngIf="!isTwoFactorEnabled">
            <div class="setup-action" *ngIf="!qrCodeDataUrl">
              <p>
                Cliquez ci-dessous pour générer votre clé secrète TOTP et votre QR code personnel.
              </p>
              <button
                mat-raised-button
                color="primary"
                type="button"
                (click)="onGenerateSecret()"
                [disabled]="isLoading"
              >
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <span *ngIf="!isLoading">Générer le QR Code 2FA</span>
              </button>
            </div>

            <div class="qr-section" *ngIf="qrCodeDataUrl">
              <p><strong>Étape 1 :</strong> Scannez ce QR code avec Google Authenticator ou Authy :</p>
              <img [src]="qrCodeDataUrl" alt="QR Code 2FA MediTrack" class="qr-image" />

              <div class="secret-box">
                <span>Clé manuelle (Base32) :</span>
                <code>{{ manualSecret }}</code>
              </div>

              <p><strong>Étape 2 :</strong> Saisissez le code à 6 chiffres affiché pour activer la 2FA :</p>
              <form [formGroup]="codeForm" (ngSubmit)="onEnableTwoFactor()" class="code-form">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Code TOTP à 6 chiffres</mat-label>
                  <input
                    matInput
                    type="text"
                    inputmode="numeric"
                    maxlength="6"
                    formControlName="code"
                    placeholder="123456"
                    class="otp-input"
                    required
                  />
                  <mat-error *ngIf="codeForm.get('code')?.hasError('required')">
                    Le code à 6 chiffres est obligatoire
                  </mat-error>
                  <mat-error *ngIf="codeForm.get('code')?.hasError('pattern')">
                    Saisissez exactement 6 chiffres numériques
                  </mat-error>
                </mat-form-field>

                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  [disabled]="codeForm.invalid || isLoading"
                >
                  Activer la 2FA
                </button>
              </form>
            </div>
          </ng-container>

          <ng-container *ngIf="isTwoFactorEnabled">
            <div class="disable-section">
              <p>
                Votre compte est protégé par la double authentification. Pour la désactiver, saisissez
                un code TOTP valide à 6 chiffres :
              </p>
              <form [formGroup]="codeForm" (ngSubmit)="onDisableTwoFactor()" class="code-form">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Code TOTP actuel (6 chiffres)</mat-label>
                  <input
                    matInput
                    type="text"
                    inputmode="numeric"
                    maxlength="6"
                    formControlName="code"
                    placeholder="123456"
                    class="otp-input"
                    required
                  />
                  <mat-error *ngIf="codeForm.get('code')?.hasError('required')">
                    Le code à 6 chiffres est obligatoire
                  </mat-error>
                  <mat-error *ngIf="codeForm.get('code')?.hasError('pattern')">
                    Saisissez exactement 6 chiffres numériques
                  </mat-error>
                </mat-form-field>

                <button
                  mat-stroked-button
                  color="warn"
                  type="submit"
                  [disabled]="codeForm.invalid || isLoading"
                >
                  Désactiver la 2FA
                </button>
              </form>
            </div>
          </ng-container>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .setup-wrapper {
      display: flex;
      justify-content: center;
      padding: 1.5rem 1rem;
    }
    .setup-card {
      width: 100%;
      max-width: 560px;
      padding: 1rem;
    }
    .status-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 1rem 0;
      font-weight: 500;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: #fff3e0;
      color: #e65100;
      font-size: 0.88rem;
    }
    .status-pill.enabled {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .qr-image {
      width: 210px;
      height: 210px;
      border: 1px solid #d9e2ec;
      border-radius: 8px;
      padding: 0.5rem;
      background: #ffffff;
    }
    .secret-box {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      background: #f0f4f8;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      width: 100%;
      box-sizing: border-box;
    }
    .secret-box code {
      font-family: monospace;
      font-size: 1rem;
      letter-spacing: 0.12rem;
      word-break: break-all;
    }
    .code-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
      max-width: 340px;
      margin: 0.5rem auto 0;
    }
    .full-width {
      width: 100%;
    }
    .otp-input {
      font-family: monospace;
      font-size: 1.3rem;
      letter-spacing: 0.35rem;
      text-align: center;
    }
    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #c62828;
      background: #ffebee;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
  `]
})
export class TwoFactorSetupComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  currentUser: User | null = null;
  qrCodeDataUrl = '';
  manualSecret = '';
  isLoading = false;
  errorMessage = '';

  readonly codeForm = this.fb.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  get isTwoFactorEnabled(): boolean {
    return Boolean(this.currentUser?.twoFactorEnabled);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  onGenerateSecret(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.setupTwoFactor().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.qrCodeDataUrl = res.data.qrCodeDataUrl;
        this.manualSecret = res.data.secret;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Impossible de générer le QR code 2FA.';
      }
    });
  }

  onEnableTwoFactor(): void {
    if (this.codeForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const code = (this.codeForm.get('code')?.value || '').trim();

    this.authService.enableTwoFactor(code).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.currentUser = res.data.user;
        this.qrCodeDataUrl = '';
        this.manualSecret = '';
        this.codeForm.reset();
        this.snackBar.open(res.message || '2FA activée avec succès', 'OK', { duration: 3500 });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Code 2FA invalide ou expiré. Veuillez réessayer.';
        this.codeForm.get('code')?.reset('');
      }
    });
  }

  onDisableTwoFactor(): void {
    if (this.codeForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const code = (this.codeForm.get('code')?.value || '').trim();

    this.authService.disableTwoFactor(code).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.currentUser = res.data.user;
        this.codeForm.reset();
        this.snackBar.open(res.message || '2FA désactivée avec succès', 'OK', { duration: 3500 });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Code 2FA invalide ou expiré. Impossible de désactiver la 2FA.';
        this.codeForm.get('code')?.reset('');
      }
    });
  }
}
