import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

import { Patient } from '../../../core/models/patient.model';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule
  ],
  template: `
    <mat-card class="patient-list-card">
      <div class="header-row">
        <div>
          <h2 class="page-title">
            <mat-icon color="primary">folder_shared</mat-icon>
            Dossiers Patients
          </h2>
          <p class="page-subtitle">
            Recherchez un patient par nom, prénom ou CIN et consultez son dossier médical complet.
          </p>
        </div>

        <a mat-raised-button color="primary" routerLink="/patients/new">
          <mat-icon>person_add</mat-icon>
          Nouveau dossier
        </a>
      </div>

      <form class="search-bar" (ngSubmit)="onSearch()">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Rechercher (Nom, Prénom ou CIN)</mat-label>
          <input
            matInput
            name="search"
            [(ngModel)]="searchTerm"
            placeholder="Ex. El Amrani, AB123456..."
          />
          <button
            *ngIf="searchTerm"
            matSuffix
            mat-icon-button
            type="button"
            aria-label="Effacer la recherche"
            (click)="clearSearch()"
          >
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="loading">
          <mat-icon>search</mat-icon>
          Rechercher
        </button>

        <mat-slide-toggle
          name="includeArchived"
          [(ngModel)]="includeArchived"
          (change)="onSearch()"
          color="primary"
        >
          Afficher les archivés
        </mat-slide-toggle>
      </form>

      <div *ngIf="loading" class="loading-box">
        <mat-spinner diameter="36"></mat-spinner>
        <span>Chargement des dossiers patients...</span>
      </div>

      <div *ngIf="!loading && patients.length === 0" class="empty-state">
        <mat-icon>person_search</mat-icon>
        <p>Aucun dossier patient trouvé.</p>
      </div>

      <div *ngIf="!loading && patients.length > 0" class="table-wrapper">
        <table mat-table [dataSource]="patients" class="patients-table">
          <ng-container matColumnDef="cin">
            <th mat-header-cell *matHeaderCellDef>CIN</th>
            <td mat-cell *matCellDef="let p">
              <span class="cin-badge">{{ p.cin }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="fullName">
            <th mat-header-cell *matHeaderCellDef>Patient</th>
            <td mat-cell *matCellDef="let p">
              <strong>{{ p.lastName }} {{ p.firstName }}</strong>
            </td>
          </ng-container>

          <ng-container matColumnDef="dateOfBirth">
            <th mat-header-cell *matHeaderCellDef>Date de naissance</th>
            <td mat-cell *matCellDef="let p">
              {{ p.dateOfBirth | date: 'dd/MM/yyyy' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="bloodGroup">
            <th mat-header-cell *matHeaderCellDef>Groupe</th>
            <td mat-cell *matCellDef="let p">
              <span class="blood-badge">{{ p.bloodGroup || 'Inconnu' }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Téléphone</th>
            <td mat-cell *matCellDef="let p">{{ p.contact?.phone || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let p">
              <span [class]="p.isArchived ? 'status-archived' : 'status-active'">
                {{ p.isArchived ? 'Archivé' : 'Actif' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let p" class="actions-cell">
              <a
                mat-stroked-button
                color="primary"
                [routerLink]="['/patients', getPatientId(p)]"
              >
                <mat-icon>visibility</mat-icon>
                Consulter
              </a>
              <a
                *ngIf="!p.isArchived"
                mat-button
                color="accent"
                [routerLink]="['/patients', getPatientId(p), 'edit']"
              >
                <mat-icon>edit</mat-icon>
                Modifier
              </a>
              <button
                *ngIf="canArchive && !p.isArchived"
                mat-button
                color="warn"
                type="button"
                (click)="onArchive(p)"
              >
                <mat-icon>archive</mat-icon>
                Archiver
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>

      <mat-paginator
        [length]="total"
        [pageIndex]="page - 1"
        [pageSize]="limit"
        [pageSizeOptions]="[5, 10, 25]"
        (page)="onPageChange($event)"
        showFirstLastButtons
      ></mat-paginator>
    </mat-card>
  `,
  styles: [`
    .patient-list-card {
      padding: 1.5rem;
    }
    .header-row {
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
    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .search-field {
      flex: 1 1 320px;
    }
    .loading-box,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2.5rem 1rem;
      color: #627d98;
    }
    .empty-state mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }
    .table-wrapper {
      overflow-x: auto;
    }
    .patients-table {
      width: 100%;
    }
    .cin-badge {
      font-family: monospace;
      font-weight: 600;
      background: #e8eaf6;
      color: #303f9f;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .blood-badge {
      font-weight: 600;
      background: #ffebee;
      color: #c62828;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 0.82rem;
    }
    .status-active {
      font-weight: 600;
      background: #e8f5e9;
      color: #2e7d32;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.8rem;
    }
    .status-archived {
      font-weight: 600;
      background: #eceff1;
      color: #455a64;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.8rem;
    }
    .actions-cell {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      white-space: nowrap;
    }
  `]
})
export class PatientListComponent implements OnInit {
  private readonly patientService = inject(PatientService);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);

  readonly displayedColumns = [
    'cin',
    'fullName',
    'dateOfBirth',
    'bloodGroup',
    'phone',
    'status',
    'actions'
  ];

  patients: Patient[] = [];
  searchTerm = '';
  includeArchived = false;
  page = 1;
  limit = 10;
  total = 0;
  loading = false;

  get canArchive(): boolean {
    const role = this.authService.getCurrentUser()?.role;
    return role === 'admin' || role === 'medecin';
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService
      .listPatients({
        search: this.searchTerm,
        page: this.page,
        limit: this.limit,
        includeArchived: this.includeArchived
      })
      .subscribe({
        next: (response) => {
          this.patients = response.data.patients;
          this.total = response.data.pagination.total;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  onArchive(patient: Patient): void {
    const id = this.getPatientId(patient);
    if (!id) {
      return;
    }
    if (!confirm(`Archiver le dossier de ${patient.firstName} ${patient.lastName} (${patient.cin}) ?`)) {
      return;
    }
    this.patientService.archivePatient(id).subscribe({
      next: () => {
        this.notification.success(`Dossier ${patient.cin} archivé avec succès.`);
        this.loadPatients();
      }
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadPatients();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.page = 1;
    this.loadPatients();
  }

  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadPatients();
  }

  getPatientId(patient: Patient): string {
    return patient._id || patient.id || '';
  }
}
