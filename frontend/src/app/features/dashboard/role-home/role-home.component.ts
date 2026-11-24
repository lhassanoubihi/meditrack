import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-role-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card style="padding: 1.5rem;">
      <mat-card-header>
        <mat-icon mat-card-avatar color="primary">{{ icon }}</mat-icon>
        <mat-card-title>{{ title }}</mat-card-title>
        <mat-card-subtitle>
          Connecté en tant que {{ user?.firstName }} {{ user?.lastName }} ({{ user?.role }})
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content style="margin-top: 1rem;">
        <p>{{ description }}</p>
      </mat-card-content>
    </mat-card>
  `
})
export class RoleHomeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly user = this.authService.getCurrentUser();
  readonly title = (this.route.snapshot.data['title'] as string) || 'Espace MediTrack';
  readonly description =
    (this.route.snapshot.data['description'] as string) ||
    'Bienvenue dans votre espace sécurisé MediTrack.';
  readonly icon = (this.route.snapshot.data['icon'] as string) || 'dashboard';
}
