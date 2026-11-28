import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Patient } from '../../../core/models/patient.model';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-my-dossier',
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
    <div class="top-row">
      <div>
        <h2 class="page-title">
          <mat-icon color="primary">assignment_ind</mat-icon>
          Mon dossier médical
        </h2>
        <p class="page-subtitle">
          Consultation en lecture seule de vos informations médicales enregistrées par votre équipe soignante.
        </p>
      </div>
      <span class="readonly-badge">
        <mat-icon>lock</mat-icon>
        Lecture seule
      </span>
    </div>

    <div *ngIf="loading" class="loading-box">
      <mat-spinner diameter="40"></mat-spinner>
      <span>Chargement de votre dossier médical...</span>
    </div>

    <mat-card *ngIf="!loading && !patient" class="empty-card">
      <mat-icon color="primary">folder_off</mat-icon>
      <h3>Aucun dossier médical lié</h3>
      <p>
        Votre dossier médical n'a pas encore été créé ou associé à votre compte par un médecin ou un infirmier.
      </p>
      <a mat-stroked-button color="primary" routerLink="/patient">
        Retour à mon espace
      </a>
    </mat-card>

    <ng-container *ngIf="!loading && patient">
      <mat-card class="section-card">
        <div class="identity-header">
          <div class="avatar-lg">{{ getInitials(patient) }}</div>
          <div>
            <div class="name-line">
              <h3>{{ patient.firstName }} {{ patient.lastName }}</h3>
              <span class="cin-pill">CIN : {{ patient.cin }}</span>
            </div>
            <div class="sub-meta">
              <span><strong>Genre :</strong> {{ patient.gender }}</span>
              <span><strong>Né(e) le :</strong> {{ patient.dateOfBirth | date: 'dd/MM/yyyy' }}</span>
              <span class="blood-pill">Groupe sanguin : {{ patient.bloodGroup || 'Inconnu' }}</span>
            </div>
          </div>
        </div>
      </mat-card>

      <div class="detail-grid">
        <mat-card class="section-card">
          <h3><mat-icon color="primary">contact_phone</mat-icon> Mes coordonnées</h3>
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
          <h3><mat-icon color="primary">medical_information</mat-icon> Mon profil médical</h3>
          <mat-divider></mat-divider>

          <div class="medical-group">
            <h4>Antécédents</h4>
            <mat-chip-set *ngIf="patient.antecedents.length > 0; else noAnt">
              <mat-chip *ngFor="let item of patient.antecedents">{{ item }}</mat-chip>
            </mat-chip-set>
            <ng-template #noAnt><p class="muted">Aucun antécédent renseigné.</p></ng-template>
          </div>

          <div class="medical-group">
            <h4>Allergies</h4>
            <mat-chip-set *ngIf="patient.allergies.length > 0; else noAll">
              <mat-chip *ngFor="let item of patient.allergies" color="warn" highlighted>
                {{ item }}
              </mat-chip>
            </mat-chip-set>
            <ng-template #noAll><p class="muted">Aucune allergie connue.</p></ng-template>
          </div>

          <div class="medical-group">
            <h4>Traitements en cours</h4>
            <mat-chip-set *ngIf="patient.traitements.length > 0; else noTrt">
              <mat-chip *ngFor="let item of patient.traitements">{{ item }}</mat-chip>
            </mat-chip-set>
            <ng-template #noTrt><p class="muted">Aucun traitement enregistré.</p></ng-template>
          </div>

          <div class="medical-group">
            <h4>Notes du médecin</h4>
            <p class="notes-box">{{ patient.notes || 'Aucune note médicale.' }}</p>
          </div>
        </mat-card>
      </div>
    </ng-container>
  `,
  styles: [`
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }
    .page-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
    }
    .page-subtitle {
      margin: 0.25rem 0 0;
      color: #627d98;
      font-size: 0.92rem;
    }
    .readonly-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #e8eaf6;
      color: #303f9f;
      padding: 6px 12px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .readonly-badge mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .loading-box,
    .empty-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 2.5rem;
      text-align: center;
    }
    .empty-card mat-icon {
      font-size: 44px;
      width: 44px;
      height: 44px;
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
    .name-line h3 {
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
  `]
})
export class MyDossierComponent implements OnInit {
  private readonly patientService = inject(PatientService);

  patient: Patient | null = null;
  loading = true;

  ngOnInit(): void {
    this.patientService.getMyDossier().subscribe({
      next: (res) => {
        this.patient = res.data.patient;
        this.loading = false;
      },
      error: () => {
        this.patient = null;
        this.loading = false;
      }
    });
  }

  getInitials(patient: Patient): string {
    return `${patient.firstName?.charAt(0) || ''}${patient.lastName?.charAt(0) || ''}`.toUpperCase() || 'PT';
  }
}
