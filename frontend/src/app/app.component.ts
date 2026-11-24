import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { AuthService } from './core/services/auth.service';
import { UserRole } from './core/models/auth.model';

interface NavMenuItem {
  label: string;
  route: string;
  icon: string;
  roles: UserRole[];
}

const ROLE_MENU_ITEMS: NavMenuItem[] = [
  { label: 'Tableau Admin', route: '/admin', icon: 'admin_panel_settings', roles: ['admin'] },
  { label: 'Personnel', route: '/admin/users', icon: 'manage_accounts', roles: ['admin'] },
  { label: 'Espace Médecin', route: '/medecin', icon: 'medical_services', roles: ['medecin'] },
  { label: 'Espace Infirmier', route: '/infirmier', icon: 'vaccines', roles: ['infirmier'] },
  { label: 'Pharmacie', route: '/pharmacien', icon: 'local_pharmacy', roles: ['pharmacien'] },
  { label: 'Mon Espace Patient', route: '/patient', icon: 'personal_injury', roles: ['patient'] }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <mat-icon>local_hospital</mat-icon>
      <span style="margin-left: 8px; font-weight: 600;">MediTrack</span>

      <nav class="nav-links" *ngIf="currentUser$ | async as user">
        <a
          mat-button
          *ngFor="let item of getMenuForRole(user.role)"
          [routerLink]="item.route"
          routerLinkActive="active-link"
        >
          <mat-icon>{{ item.icon }}</mat-icon>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <span style="flex: 1 1 auto;"></span>

      <ng-container *ngIf="currentUser$ | async as user; else guestActions">
        <span class="user-badge">{{ user.firstName }} {{ user.lastName }} ({{ user.role }})</span>
        <button mat-stroked-button color="accent" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Déconnexion
        </button>
      </ng-container>

      <ng-template #guestActions>
        <button mat-button routerLink="/login">Connexion</button>
        <button mat-raised-button color="accent" routerLink="/register">Inscription Patient</button>
      </ng-template>
    </mat-toolbar>

    <main class="meditrack-container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-toolbar {
      display: flex;
      gap: 0.5rem;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-left: 1rem;
    }
    .active-link {
      background: rgba(255, 255, 255, 0.16);
    }
    .user-badge {
      font-size: 0.9rem;
      margin-right: 0.75rem;
      opacity: 0.95;
    }
  `]
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser$ = this.authService.currentUser$;

  getMenuForRole(role: UserRole): NavMenuItem[] {
    return ROLE_MENU_ITEMS.filter((item) => item.roles.includes(role));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
