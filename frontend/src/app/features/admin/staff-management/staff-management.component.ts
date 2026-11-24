import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UserRole } from '../../../core/models/auth.model';
import { CreateStaffPayload, StaffUser, UserService } from '../../../core/services/user.service';
import { STRONG_PASSWORD_PATTERN } from '../../auth/register/register.component';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  template: `
    <div class="staff-grid">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-icon mat-card-avatar color="primary">person_add</mat-icon>
          <mat-card-title>Nouveau compte personnel</mat-card-title>
          <mat-card-subtitle>Créer un médecin, infirmier, pharmacien ou administrateur</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="staffForm" (ngSubmit)="onCreateStaff()" class="staff-form">
            <div class="row-2">
              <mat-form-field appearance="outline">
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="firstName" required />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="lastName" required />
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email professionnel</mat-label>
              <input matInput type="email" formControlName="email" required />
            </mat-form-field>

            <div class="row-2">
              <mat-form-field appearance="outline">
                <mat-label>Rôle</mat-label>
                <mat-select formControlName="role" required>
                  <mat-option value="medecin">Médecin</mat-option>
                  <mat-option value="infirmier">Infirmier</mat-option>
                  <mat-option value="pharmacien">Pharmacien</mat-option>
                  <mat-option value="admin">Administrateur</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Spécialité (optionnel)</mat-label>
                <input matInput formControlName="specialite" placeholder="Ex: Cardiologie" />
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mot de passe temporaire</mat-label>
              <input matInput type="password" formControlName="password" required />
              <mat-hint>Min. 8 car., majuscule, minuscule, chiffre et caractère spécial</mat-hint>
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="staffForm.invalid || isSubmitting"
            >
              Créer le compte
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-header>
          <mat-icon mat-card-avatar color="primary">manage_accounts</mat-icon>
          <mat-card-title>Comptes du personnel ({{ users.length }})</mat-card-title>
          <mat-card-subtitle>Activation / désactivation et suivi des rôles (US-07)</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content style="margin-top: 1rem;">
          <table mat-table [dataSource]="users" class="full-width">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom complet</th>
              <td mat-cell *matCellDef="let u">{{ u.firstName }} {{ u.lastName }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let u">{{ u.email }}</td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Rôle</th>
              <td mat-cell *matCellDef="let u">
                <strong>{{ u.role }}</strong>
                <span *ngIf="u.specialite"> — {{ u.specialite }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let u">
                <mat-slide-toggle
                  color="primary"
                  [checked]="u.isActive !== false"
                  (change)="onToggleStatus(u, $event.checked)"
                >
                  {{ u.isActive !== false ? 'Actif' : 'Désactivé' }}
                </mat-slide-toggle>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .staff-grid {
      display: grid;
      grid-template-columns: 1fr 1.6fr;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 960px) {
      .staff-grid {
        grid-template-columns: 1fr;
      }
    }
    .staff-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class StaffManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  users: StaffUser[] = [];
  displayedColumns = ['name', 'email', 'role', 'status'];
  isSubmitting = false;

  readonly staffForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['medecin' as UserRole, [Validators.required]],
    specialite: [''],
    password: ['', [Validators.required, Validators.pattern(STRONG_PASSWORD_PATTERN)]]
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.listUsers().subscribe({
      next: (res) => {
        this.users = res.data.users || [];
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Erreur lors du chargement des utilisateurs', 'OK', {
          duration: 3500
        });
      }
    });
  }

  onCreateStaff(): void {
    if (this.staffForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const raw = this.staffForm.getRawValue();
    const payload: CreateStaffPayload = {
      firstName: (raw.firstName || '').trim(),
      lastName: (raw.lastName || '').trim(),
      email: (raw.email || '').trim().toLowerCase(),
      role: (raw.role || 'medecin') as UserRole,
      specialite: (raw.specialite || '').trim() || undefined,
      password: raw.password || ''
    };

    this.userService.createUser(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.snackBar.open(res.message || 'Compte créé avec succès', 'OK', { duration: 3000 });
        this.staffForm.reset({ role: 'medecin' });
        this.loadUsers();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.snackBar.open(err?.error?.message || 'Erreur lors de la création du compte', 'OK', {
          duration: 4000
        });
      }
    });
  }

  onToggleStatus(user: StaffUser, isActive: boolean): void {
    const id = user._id || user.id;
    if (!id) return;

    this.userService.setUserStatus(id, isActive).subscribe({
      next: (res) => {
        user.isActive = res.data.user.isActive;
        this.snackBar.open(res.message, 'OK', { duration: 2500 });
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Impossible de modifier le statut', 'OK', {
          duration: 3500
        });
        this.loadUsers();
      }
    });
  }
}
