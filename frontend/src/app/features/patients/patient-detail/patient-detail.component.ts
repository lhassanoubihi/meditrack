import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Patient } from '../../../core/models/patient.model';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="detail-actions-top">
      <a mat-stroked-button routerLink="/patients">
        <mat-icon>arrow_back</mat-icon>
        Retour aux dossiers
      </a>

      <a
        *ngIf="patient && !patient.isArchived"
        mat-raised-button
        color="primary"
        [routerLink]="['/patients', patientId, 'edit']"
      >
        <mat-icon>edit</mat-icon>
        Modifier le dossier
      </a>
    </div>

    <div *ngIf="loading" class="loading-box">
      <mat-spinner diameter="40"></mat-spinner>
      <span>Chargement du dossier patient...</span>
    </div>

    <mat-card *ngIf="!loading && !patient" class="not-found-card">
      <mat-icon color="warn">error_outline</mat-icon>
      <h3>Dossier patient introuvable</h3>
      <p>Le dossier demandé n'existe pas ou n'est pas accessible.</p>
    </mat-card>

    <ng-container *ngIf="!loading && patient">
      <mat-card class="section-card">
        <div class="identity-header">
          <div class="avatar-lg">{{ getInitials(patient) }}</div>
          <div class="identity-meta">
            <div class="name-line">
              <h2>{{ patient.firstName }} {{ patient.lastName }}</h2>
              <span class="cin-pill">CIN : {{ patient.cin }}</span>
              <span *ngIf="patient.isArchived" class="archived-pill">Archivé</span>
            </div>
            <div class="sub-meta">
              <span><strong>Genre :</strong> {{ patient.gender }}</span>
              <span><strong>Né(e) le :</strong> {{ patient.dateOfBirth | date: 'dd/MM/yyyy' }}</span>
              <span class="blood-pill">Groupe : {{ patient.bloodGroup || 'Inconnu' }}</span>
            </div>
          </div>
        </div>
      </mat-card>

      <div class="detail-grid">
        <mat-card class="section-card">
          <h3><mat-icon color="primary">contact_phone</mat-icon> Coordonnées</h3>
          <mat-divider></mat-divider>
          <dl class="info-list">
            <div><dt>Téléphone</dt><dd>{{ patient.contact.phone || '—' }}</dd></div>
            <div><dt>Email</dt><dd>{{ patient.contact.email || '—' }}</dd></div>
            <div><dt>Adresse</dt><dd>{{ patient.contact.address || '—' }}</dd></div>
          </dl>

          <h4 class="sub-heading">Contact d'urgence</h4>
          <dl class="info-list">
            <div><dt>Nom</dt><dd>{{ patient.contact.emergencyContact?.name || '—' }}</dd></div>
            <div><dt>Téléphone</dt><dd>{{ patient.contact.emergencyContact?.phone || '—' }}</dd></div>
            <div><dt>Lien</dt><dd>{{ patient.contact.emergencyContact?.relation || '—' }}</dd></div>
          </dl>
        </mat-card>

        <mat-card class="section-card">
          <h3><mat-icon color="primary">medical_information</mat-icon> Profil Médical</h3>
          <mat-divider></mat-divider>

          <div class="medical-group">
            <h4>Antécédents médicaux</h4>
            <mat-chip-set *ngIf="patient.antecedents.length > 0; else noAntecedents">
              <mat-chip *ngFor="let item of patient.antecedents">{{ item }}</mat-chip>
            </mat-chip-set>
            <ng-template #noAntecedents><p class="muted">Aucun antécédent renseigné.</p></ng-template>
          </div>

          <div class="medical-group">
            <h4>Allergies</h4>
            <mat-chip-set *ngIf="patient.allergies.length > 0; else noAllergies">
              <mat-chip *ngFor="let item of patient.allergies" color="warn" highlighted>
                {{ item }}
              </mat-chip>
            </mat-chip-set>
            <ng-template #noAllergies><p class="muted">Aucune allergie connue.</p></ng-template>
          </div>

          <div class="medical-group">
            <h4>Traitements en cours</h4>
            <mat-chip-set *ngIf="patient.traitements.length > 0; else noTraitements">
              <mat-chip *ngFor="let item of patient.traitements">{{ item }}</mat-chip>
            </mat-chip-set>
            <ng-template #noTraitements><p class="muted">Aucun traitement enregistré.</p></ng-template>
          </div>

          <div class="medical-group">
            <h4>Notes cliniques</h4>
            <p class="notes-box">{{ patient.notes || 'Aucune note clinique.' }}</p>
          </div>
        </mat-card>
      </div>

      <mat-card class="section-card">
        <h3><mat-icon color="primary">history</mat-icon> Historique des modifications</h3>
        <mat-divider></mat-divider>

        <div
          *ngIf="patient.modificationHistory && patient.modificationHistory.length > 0; else noHistory"
          class="history-list"
        >
          <div *ngFor="let entry of patient.modificationHistory" class="history-item">
            <div class="history-date">{{ entry.modifiedAt | date: 'dd/MM/yyyy HH:mm' }}</div>
            <div class="history-summary">{{ entry.summary || 'Modification du dossier' }}</div>
          </div>
        </div>
        <ng-template #noHistory>
          <p class="muted" style="margin-top: 1rem;">Aucune modification enregistrée depuis la création.</p>
        </ng-template>
      </mat-card>
    </ng-container>
  `,
  styles: [`
    .detail-actions-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
    }
    .loading-box,
    .not-found-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 2.5rem;
      text-align: center;
    }
    .section-card {
      padding: 1.5rem;
      margin-bottom: 1.25rem;
    }
    .section-card h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 0.75rem;
    }
    .identity-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }
    .avatar-lg {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #3f51b5;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
    }
    .name-line {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .name-line h2 {
      margin: 0;
    }
    .cin-pill {
      font-family: monospace;
      font-weight: 600;
      background: #e8eaf6;
      color: #303f9f;
      padding: 3px 10px;
      border-radius: 6px;
    }
    .archived-pill {
      background: #eceff1;
      color: #455a64;
      padding: 3px 10px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.82rem;
    }
    .sub-meta {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
      margin-top: 0.4rem;
      color: #486581;
    }
    .blood-pill {
      font-weight: 600;
      color: #c62828;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.25rem;
    }
    .info-list {
      margin: 1rem 0 0;
      display: grid;
      gap: 0.6rem;
    }
    .info-list div {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 0.4rem;
    }
    .info-list dt {
      font-weight: 600;
      color: #486581;
    }
    .info-list dd {
      margin: 0;
      text-align: right;
    }
    .sub-heading {
      margin: 1.25rem 0 0.25rem;
      color: #303f9f;
    }
    .medical-group {
      margin-top: 1rem;
    }
    .medical-group h4 {
      margin: 0 0 0.5rem;
      color: #334e68;
      font-size: 0.95rem;
    }
    .muted {
      color: #829ab1;
      font-style: italic;
      margin: 0;
    }
    .notes-box {
      background: #f8fafc;
      border-left: 3px solid #3f51b5;
      padding: 0.75rem 1rem;
      margin: 0;
      white-space: pre-wrap;
    }
    .history-list {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .history-item {
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 3px solid #3f51b5;
    }
    .history-date {
      font-size: 0.8rem;
      color: #627d98;
      margin-bottom: 0.2rem;
    }
    .history-summary {
      font-weight: 500;
    }
  `]
})
export class PatientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly patientService = inject(PatientService);

  patientId = '';
  patient: Patient | null = null;
  loading = true;

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.patientId) {
      this.loading = false;
      return;
    }

    this.patientService.getPatientById(this.patientId).subscribe({
      next: (res) => {
        this.patient = res.data.patient;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getInitials(patient: Patient): string {
    return `${patient.firstName?.charAt(0) || ''}${patient.lastName?.charAt(0) || ''}`.toUpperCase() || 'PT';
  }
}
