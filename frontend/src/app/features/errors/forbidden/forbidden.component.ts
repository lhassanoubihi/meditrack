import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';
import { getDefaultRouteForRole } from '../../../core/guards/role.guard';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div style="display:flex; justify-content:center; padding: 3rem 1rem;">
      <mat-card style="max-width: 480px; width: 100%; text-align: center; padding: 1.5rem;">
        <mat-icon color="warn" style="font-size: 48px; width: 48px; height: 48px; margin: 0 auto 1rem;">
          gpp_bad
        </mat-icon>
        <mat-card-title>Accès refusé (403)</mat-card-title>
        <mat-card-content style="margin-top: 0.75rem;">
          <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
        </mat-card-content>
        <mat-card-actions align="end" style="justify-content: center;">
          <a mat-raised-button color="primary" [routerLink]="homeRoute">Retour à mon espace</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class ForbiddenComponent {
  private readonly authService = inject(AuthService);

  get homeRoute(): string {
    return getDefaultRouteForRole(this.authService.getCurrentUser()?.role);
  }
}
