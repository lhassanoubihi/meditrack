import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PatientService } from '../../../core/services/patient.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  BloodGroup,
  CreatePatientPayload,
  Patient,
  PatientGender
} from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="patient-form-wrapper">
      <mat-card class="patient-card">
        <mat-card-header>
          <mat-icon mat-card-avatar color="primary">folder_shared</mat-icon>
          <mat-card-title>Nouveau Dossier Patient</mat-card-title>
          <mat-card-subtitle>
            Enregistrez l'identité, les coordonnées et le profil médical du patient (US-08)
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="success-banner" *ngIf="createdPatient">
            <mat-icon>check_circle</mat-icon>
            <div>
              <strong>Dossier créé avec succès :</strong>
              {{ createdPatient.firstName }} {{ createdPatient.lastName }} (CIN :
              <code>{{ createdPatient.cin }}</code>)
            </div>
          </div>

          <div class="error-banner" *ngIf="errorMessage">
            <mat-icon>error_outline</mat-icon>
            <div>
              <strong>{{ errorMessage }}</strong>
              <ul *ngIf="errorDetails.length > 0" class="error-list">
                <li *ngFor="let detail of errorDetails">{{ detail }}</li>
              </ul>
            </div>
          </div>

          <form [formGroup]="patientForm" (ngSubmit)="onSubmit()" class="patient-form">
            <h3 class="section-title">
              <mat-icon>badge</mat-icon>
              1. Identité du patient
            </h3>

            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="firstName" placeholder="Ex: Youssef" required />
                <mat-error *ngIf="patientForm.get('firstName')?.hasError('required')">
                  Le prénom est obligatoire
                </mat-error>
                <mat-error *ngIf="patientForm.get('firstName')?.hasError('minlength')">
                  Minimum 2 caractères
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="lastName" placeholder="Ex: Benali" required />
                <mat-error *ngIf="patientForm.get('lastName')?.hasError('required')">
                  Le nom est obligatoire
                </mat-error>
                <mat-error *ngIf="patientForm.get('lastName')?.hasError('minlength')">
                  Minimum 2 caractères
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Numéro CIN</mat-label>
                <input
                  matInput
                  formControlName="cin"
                  placeholder="Ex: CD123456"
                  style="text-transform: uppercase"
                  required
                />
                <mat-error *ngIf="patientForm.get('cin')?.hasError('required')">
                  Le CIN est obligatoire
                </mat-error>
                <mat-error *ngIf="patientForm.get('cin')?.hasError('pattern')">
                  4 à 20 caractères alphanumériques
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Date de naissance</mat-label>
                <input
                  matInput
                  type="date"
                  formControlName="dateOfBirth"
                  [max]="todayIso"
                  required
                />
                <mat-error *ngIf="patientForm.get('dateOfBirth')?.hasError('required')">
                  La date de naissance est obligatoire
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Genre</mat-label>
                <mat-select formControlName="gender" required>
                  <mat-option *ngFor="let g of genders" [value]="g.value">
                    {{ g.label }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Groupe sanguin</mat-label>
                <mat-select formControlName="bloodGroup">
                  <mat-option *ngFor="let bg of bloodGroups" [value]="bg">{{ bg }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-divider></mat-divider>

            <h3 class="section-title">
              <mat-icon>contact_phone</mat-icon>
              2. Coordonnées & Contact d'urgence
            </h3>

            <div class="form-grid" formGroupName="contact">
              <mat-form-field appearance="outline">
                <mat-label>Téléphone</mat-label>
                <input
                  matInput
                  formControlName="phone"
                  placeholder="+212 6 00 00 00 00"
                  required
                />
                <mat-error *ngIf="patientForm.get('contact.phone')?.hasError('required')">
                  Le téléphone est obligatoire
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Adresse email (optionnel)</mat-label>
                <input matInput type="email" formControlName="email" placeholder="patient@meditrack.ma" />
                <mat-error *ngIf="patientForm.get('contact.email')?.hasError('email')">
                  Format d'email invalide
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="span-2">
                <mat-label>Adresse postale</mat-label>
                <input matInput formControlName="address" placeholder="Rue, quartier, ville" />
              </mat-form-field>

              <ng-container formGroupName="emergencyContact">
                <mat-form-field appearance="outline">
                  <mat-label>Contact d'urgence (Nom)</mat-label>
                  <input matInput formControlName="name" placeholder="Ex: Fatima Benali" />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Contact d'urgence (Téléphone)</mat-label>
                  <input matInput formControlName="phone" placeholder="+212 6 ..." />
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Lien de parenté</mat-label>
                  <input matInput formControlName="relation" placeholder="Ex: Conjoint, Parent" />
                </mat-form-field>
              </ng-container>
            </div>

            <mat-divider></mat-divider>

            <h3 class="section-title">
              <mat-icon>medical_information</mat-icon>
              3. Informations médicales
            </h3>

            <div class="medical-fields">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Antécédents médicaux (séparés par des virgules)</mat-label>
                <textarea
                  matInput
                  rows="2"
                  formControlName="antecedentsText"
                  placeholder="Ex: Hypertension artérielle, Diabète type 2, Asthme"
                ></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Allergies connues (séparées par des virgules)</mat-label>
                <textarea
                  matInput
                  rows="2"
                  formControlName="allergiesText"
                  placeholder="Ex: Pénicilline, Arachides, Pollen"
                ></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Traitements en cours (séparés par des virgules)</mat-label>
                <textarea
                  matInput
                  rows="2"
                  formControlName="traitementsText"
                  placeholder="Ex: Metformine 500mg, Ventoline 100µg"
                ></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Notes cliniques complémentaires</mat-label>
                <textarea
                  matInput
                  rows="2"
                  formControlName="notes"
                  placeholder="Observations particulières du médecin..."
                ></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" (click)="onReset()" [disabled]="isLoading">
                <mat-icon>restart_alt</mat-icon>
                Réinitialiser
              </button>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="patientForm.invalid || isLoading"
              >
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
                <ng-container *ngIf="!isLoading">
                  <mat-icon>save</mat-icon>
                  Créer le dossier patient
                </ng-container>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .patient-form-wrapper {
      max-width: 960px;
      margin: 0 auto;
    }
    .patient-card {
      padding: 1rem;
    }
    .patient-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-top: 1rem;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.25rem 0 0;
      color: #1e3a5f;
      font-size: 1.05rem;
      font-weight: 600;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 0.75rem 1rem;
    }
    .span-2 {
      grid-column: 1 / -1;
    }
    .medical-fields {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .full-width {
      width: 100%;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .success-banner,
    .error-banner {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      padding: 0.85rem 1rem;
      border-radius: 6px;
      margin-top: 1rem;
      font-size: 0.92rem;
    }
    .success-banner {
      background: #e8f5e9;
      color: #1b5e20;
    }
    .error-banner {
      background: #ffebee;
      color: #b71c1c;
    }
    .error-list {
      margin: 0.35rem 0 0 1rem;
      padding: 0;
    }
  `]
})
export class PatientCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly patientService = inject(PatientService);
  private readonly notification = inject(NotificationService);

  readonly todayIso = new Date().toISOString().split('T')[0];

  readonly genders: { value: PatientGender; label: string }[] = [
    { value: 'M', label: 'Masculin (M)' },
    { value: 'F', label: 'Féminin (F)' },
    { value: 'Autre', label: 'Autre' }
  ];

  readonly bloodGroups: BloodGroup[] = [
    'Inconnu',
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-'
  ];

  isLoading = false;
  errorMessage = '';
  errorDetails: string[] = [];
  createdPatient: Patient | null = null;

  readonly patientForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    cin: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{4,20}$/)]],
    dateOfBirth: ['', [Validators.required]],
    gender: ['M' as PatientGender, [Validators.required]],
    bloodGroup: ['Inconnu' as BloodGroup],
    contact: this.fb.group({
      phone: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      email: ['', [Validators.email]],
      address: [''],
      emergencyContact: this.fb.group({
        name: [''],
        phone: [''],
        relation: ['']
      })
    }),
    antecedentsText: [''],
    allergiesText: [''],
    traitementsText: [''],
    notes: ['']
  });

  private parseCommaList(raw?: string | null): string[] {
    if (!raw) {
      return [];
    }
    return raw
      .split(/[\n,;]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  onSubmit(): void {
    if (this.patientForm.invalid || this.isLoading) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.errorDetails = [];
    this.createdPatient = null;

    const raw = this.patientForm.getRawValue();
    const payload: CreatePatientPayload = {
      firstName: (raw.firstName || '').trim(),
      lastName: (raw.lastName || '').trim(),
      cin: (raw.cin || '').trim().toUpperCase(),
      dateOfBirth: raw.dateOfBirth || '',
      gender: (raw.gender || 'M') as PatientGender,
      bloodGroup: (raw.bloodGroup || 'Inconnu') as BloodGroup,
      contact: {
        phone: (raw.contact?.phone || '').trim(),
        email: (raw.contact?.email || '').trim().toLowerCase(),
        address: (raw.contact?.address || '').trim(),
        emergencyContact: {
          name: (raw.contact?.emergencyContact?.name || '').trim(),
          phone: (raw.contact?.emergencyContact?.phone || '').trim(),
          relation: (raw.contact?.emergencyContact?.relation || '').trim()
        }
      },
      antecedents: this.parseCommaList(raw.antecedentsText),
      allergies: this.parseCommaList(raw.allergiesText),
      traitements: this.parseCommaList(raw.traitementsText),
      notes: (raw.notes || '').trim()
    };

    this.patientService.createPatient(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.createdPatient = res.data.patient;
        this.notification.success(res.message || 'Dossier patient créé avec succès');
        this.patientForm.reset({
          gender: 'M',
          bloodGroup: 'Inconnu'
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Erreur lors de la création du dossier patient.';
        this.errorDetails = Array.isArray(err?.error?.details) ? err.error.details : [];
      }
    });
  }

  onReset(): void {
    this.errorMessage = '';
    this.errorDetails = [];
    this.createdPatient = null;
    this.patientForm.reset({
      gender: 'M',
      bloodGroup: 'Inconnu'
    });
  }
}
