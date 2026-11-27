import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PatientService } from '../../../core/services/patient.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  BloodGroup,
  Patient,
  PatientGender,
  PatientModificationEntry,
  UpdatePatientPayload
} from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="patient-edit-wrapper">
      <div class="loading-box" *ngIf="isFetching">
        <mat-spinner diameter="36"></mat-spinner>
        <span>Chargement du dossier patient...</span>
      </div>

      <mat-card class="patient-card" *ngIf="!isFetching && loadError">
        <mat-card-content>
          <div class="error-banner">
            <mat-icon>error_outline</mat-icon>
            <div>
              <strong>Impossible de charger le dossier patient</strong>
              <p>{{ loadError }}</p>
            </div>
          </div>
          <div class="form-actions">
            <a mat-stroked-button routerLink="/patients/new">
              <mat-icon>arrow_back</mat-icon>
              Retour aux dossiers patients
            </a>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="patient-card" *ngIf="!isFetching && patient">
        <mat-card-header>
          <mat-icon mat-card-avatar color="primary">edit_note</mat-icon>
          <mat-card-title>
            Mise à jour du dossier — {{ patient.firstName }} {{ patient.lastName }}
          </mat-card-title>
          <mat-card-subtitle>
            CIN : {{ patient.cin }} · Toute modification est tracée (date, auteur et détail) — US-10
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="warning-banner" *ngIf="patient.isArchived">
            <mat-icon>archive</mat-icon>
            <span>Ce dossier est archivé et ne peut plus être modifié.</span>
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

          <form [formGroup]="editForm" (ngSubmit)="onSubmit()" class="patient-form">
            <h3 class="section-title">
              <mat-icon>badge</mat-icon>
              1. Identité & Coordonnées
            </h3>

            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="firstName" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="lastName" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Numéro CIN</mat-label>
                <input matInput formControlName="cin" style="text-transform: uppercase" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Date de naissance</mat-label>
                <input matInput type="date" formControlName="dateOfBirth" [max]="todayIso" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Genre</mat-label>
                <mat-select formControlName="gender" required>
                  <mat-option *ngFor="let g of genders" [value]="g.value">{{ g.label }}</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Groupe sanguin</mat-label>
                <mat-select formControlName="bloodGroup">
                  <mat-option *ngFor="let bg of bloodGroups" [value]="bg">{{ bg }}</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-grid" formGroupName="contact">
              <mat-form-field appearance="outline">
                <mat-label>Téléphone</mat-label>
                <input matInput formControlName="phone" required />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="span-2">
                <mat-label>Adresse</mat-label>
                <input matInput formControlName="address" />
              </mat-form-field>
            </div>

            <mat-divider></mat-divider>

            <h3 class="section-title">
              <mat-icon>medical_information</mat-icon>
              2. Antécédents, Allergies & Traitements
            </h3>

            <div class="medical-fields">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Antécédents médicaux (séparés par des virgules)</mat-label>
                <textarea matInput rows="2" formControlName="antecedentsText"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Allergies (séparées par des virgules)</mat-label>
                <textarea matInput rows="2" formControlName="allergiesText"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Traitements en cours (séparés par des virgules)</mat-label>
                <textarea matInput rows="2" formControlName="traitementsText"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Notes cliniques</mat-label>
                <textarea matInput rows="2" formControlName="notes"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Motif / Résumé de la modification (traçabilité médicale)</mat-label>
                <input
                  matInput
                  formControlName="modificationSummary"
                  placeholder="Ex: Ajout allergie pénicilline et mise à jour posologie"
                />
              </mat-form-field>
            </div>

            <div class="form-actions">
              <a mat-stroked-button routerLink="/patients/new">
                <mat-icon>arrow_back</mat-icon>
                Retour
              </a>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="editForm.invalid || isSaving || Boolean(patient.isArchived)"
              >
                <mat-spinner *ngIf="isSaving" diameter="20"></mat-spinner>
                <ng-container *ngIf="!isSaving">
                  <mat-icon>save</mat-icon>
                  Enregistrer les modifications
                </ng-container>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="history-card" *ngIf="!isFetching && patient">
        <mat-card-header>
          <mat-icon mat-card-avatar color="accent">history</mat-icon>
          <mat-card-title>Historique des modifications tracées</mat-card-title>
          <mat-card-subtitle>
            {{ historyEntries.length }} modification(s) enregistrée(s)
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <p class="empty-history" *ngIf="historyEntries.length === 0">
            Aucune modification enregistrée depuis la création du dossier.
          </p>

          <div class="history-list" *ngIf="historyEntries.length > 0">
            <div class="history-item" *ngFor="let entry of historyEntries">
              <div class="history-meta">
                <strong>{{ entry.summary || 'Mise à jour du dossier' }}</strong>
                <span class="history-date">{{ entry.modifiedAt | date: 'dd/MM/yyyy HH:mm' }}</span>
              </div>
              <div class="history-author">Auteur (ID) : <code>{{ entry.modifiedBy }}</code></div>
              <div class="history-fields" *ngIf="getChangedFieldNames(entry).length > 0">
                Champs modifiés :
                <span class="field-badge" *ngFor="let f of getChangedFieldNames(entry)">{{ f }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .patient-edit-wrapper {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .loading-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 3rem 1rem;
      color: #334e68;
    }
    .patient-card,
    .history-card {
      padding: 1rem;
    }
    .patient-form {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
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
    .warning-banner,
    .error-banner {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
      padding: 0.85rem 1rem;
      border-radius: 6px;
      margin-top: 1rem;
      font-size: 0.92rem;
    }
    .warning-banner {
      background: #fff8e1;
      color: #8d4e00;
    }
    .error-banner {
      background: #ffebee;
      color: #b71c1c;
    }
    .error-list {
      margin: 0.35rem 0 0 1rem;
      padding: 0;
    }
    .empty-history {
      color: #627d98;
      margin: 0.75rem 0 0;
    }
    .history-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }
    .history-item {
      border-left: 3px solid #1976d2;
      background: #f8fafc;
      padding: 0.75rem 1rem;
      border-radius: 4px;
    }
    .history-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .history-date {
      font-size: 0.85rem;
      color: #486581;
    }
    .history-author {
      font-size: 0.85rem;
      color: #486581;
      margin-top: 0.25rem;
    }
    .history-fields {
      margin-top: 0.45rem;
      font-size: 0.85rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem;
    }
    .field-badge {
      background: #e3f2fd;
      color: #0d47a1;
      padding: 0.1rem 0.5rem;
      border-radius: 12px;
      font-family: monospace;
      font-size: 0.8rem;
    }
  `]
})
export class PatientEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly patientService = inject(PatientService);
  private readonly notification = inject(NotificationService);

  readonly Boolean = Boolean;
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

  patientId = '';
  patient: Patient | null = null;
  isFetching = true;
  isSaving = false;
  loadError = '';
  errorMessage = '';
  errorDetails: string[] = [];

  readonly editForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    cin: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{4,20}$/)]],
    dateOfBirth: ['', [Validators.required]],
    gender: ['M' as PatientGender, [Validators.required]],
    bloodGroup: ['Inconnu' as BloodGroup],
    contact: this.fb.group({
      phone: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      email: ['', [Validators.email]],
      address: ['']
    }),
    antecedentsText: [''],
    allergiesText: [''],
    traitementsText: [''],
    notes: [''],
    modificationSummary: ['']
  });

  get historyEntries(): PatientModificationEntry[] {
    return [...(this.patient?.modificationHistory || [])].reverse();
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.patientId) {
      this.isFetching = false;
      this.loadError = 'Identifiant du dossier patient manquant.';
      return;
    }
    this.loadPatient();
  }

  getChangedFieldNames(entry: PatientModificationEntry): string[] {
    return entry.changes ? Object.keys(entry.changes) : [];
  }

  private loadPatient(): void {
    this.isFetching = true;
    this.loadError = '';

    this.patientService.getPatientById(this.patientId).subscribe({
      next: (res) => {
        this.isFetching = false;
        this.patient = res.data.patient;
        this.patchFormFromPatient(this.patient);
      },
      error: (err) => {
        this.isFetching = false;
        this.loadError = err?.error?.message || 'Dossier patient introuvable.';
      }
    });
  }

  private patchFormFromPatient(p: Patient): void {
    const dobIso = p.dateOfBirth ? String(p.dateOfBirth).split('T')[0] : '';
    this.editForm.patchValue({
      firstName: p.firstName,
      lastName: p.lastName,
      cin: p.cin,
      dateOfBirth: dobIso,
      gender: p.gender,
      bloodGroup: p.bloodGroup || 'Inconnu',
      contact: {
        phone: p.contact?.phone || '',
        email: p.contact?.email || '',
        address: p.contact?.address || ''
      },
      antecedentsText: (p.antecedents || []).join(', '),
      allergiesText: (p.allergies || []).join(', '),
      traitementsText: (p.traitements || []).join(', '),
      notes: p.notes || '',
      modificationSummary: ''
    });

    if (p.isArchived) {
      this.editForm.disable();
    }
  }

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
    if (this.editForm.invalid || this.isSaving || !this.patient || this.patient.isArchived) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.errorDetails = [];

    const raw = this.editForm.getRawValue();
    const payload: UpdatePatientPayload = {
      firstName: (raw.firstName || '').trim(),
      lastName: (raw.lastName || '').trim(),
      cin: (raw.cin || '').trim().toUpperCase(),
      dateOfBirth: raw.dateOfBirth || '',
      gender: (raw.gender || 'M') as PatientGender,
      bloodGroup: (raw.bloodGroup || 'Inconnu') as BloodGroup,
      contact: {
        phone: (raw.contact?.phone || '').trim(),
        email: (raw.contact?.email || '').trim().toLowerCase(),
        address: (raw.contact?.address || '').trim()
      },
      antecedents: this.parseCommaList(raw.antecedentsText),
      allergies: this.parseCommaList(raw.allergiesText),
      traitements: this.parseCommaList(raw.traitementsText),
      notes: (raw.notes || '').trim(),
      modificationSummary: (raw.modificationSummary || '').trim()
    };

    this.patientService.updatePatient(this.patientId, payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.patient = res.data.patient;
        this.patchFormFromPatient(this.patient);
        this.notification.success(res.message || 'Dossier patient mis à jour avec succès');
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage =
          err?.error?.message || 'Erreur lors de la mise à jour du dossier patient.';
        this.errorDetails = Array.isArray(err?.error?.details) ? err.error.details : [];
      }
    });
  }
}
