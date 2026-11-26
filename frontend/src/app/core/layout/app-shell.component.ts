import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map, shareReplay } from 'rxjs';

import { User, UserRole } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import {
  NavMenuItem,
  ROLE_DISPLAY_LABELS,
  getNavItemsForRole
} from './nav-items.config';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule
  ],
  template: `
    <ng-container *ngIf="currentUser$ | async as user; else guestLayout">
      <mat-sidenav-container class="shell-container">
        <mat-sidenav
          #drawer
          class="shell-sidenav"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="!(isHandset$ | async)"
        >
          <div class="sidenav-brand">
            <mat-icon class="brand-icon">local_hospital</mat-icon>
            <div>
              <div class="brand-title">MediTrack</div>
              <div class="brand-subtitle">Gestion Médicale</div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="user-profile-card">
            <div class="avatar-circle">{{ getInitials(user) }}</div>
            <div class="user-meta">
              <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
              <span class="role-pill">{{ getRoleLabel(user.role) }}</span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <mat-nav-list>
            <div mat-subheader>Navigation</div>
            <a
              mat-list-item
              *ngFor="let item of getSectionItems(user.role, 'principal')"
              [routerLink]="item.route"
              routerLinkActive="sidenav-active-link"
              [routerLinkActiveOptions]="{ exact: !!item.exact }"
              (click)="closeOnHandset()"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>

            <mat-divider class="nav-divider"></mat-divider>
            <div mat-subheader>Compte & Sécurité</div>

            <a
              mat-list-item
              *ngFor="let item of getSectionItems(user.role, 'securite')"
              [routerLink]="item.route"
              routerLinkActive="sidenav-active-link"
              (click)="closeOnHandset()"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="shell-content">
          <mat-toolbar color="primary" class="shell-toolbar">
            <button
              mat-icon-button
              type="button"
              aria-label="Ouvrir le menu de navigation"
              (click)="drawer.toggle()"
            >
              <mat-icon>menu</mat-icon>
            </button>

            <span class="toolbar-title">MediTrack · {{ getRoleLabel(user.role) }}</span>
            <span class="spacer"></span>

            <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
              <mat-icon>account_circle</mat-icon>
              <span class="hide-xs">{{ user.firstName }} {{ user.lastName }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>

            <mat-menu #userMenu="matMenu">
              <a mat-menu-item routerLink="/security/2fa">
                <mat-icon>security</mat-icon>
                <span>Sécurité 2FA</span>
              </a>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Déconnexion</span>
              </button>
            </mat-menu>
          </mat-toolbar>

          <main class="meditrack-container">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </ng-container>

    <ng-template #guestLayout>
      <mat-toolbar color="primary" class="shell-toolbar">
        <a routerLink="/login" class="guest-brand">
          <mat-icon>local_hospital</mat-icon>
          <span>MediTrack</span>
        </a>
        <span class="spacer"></span>
        <button mat-button routerLink="/login" routerLinkActive="toolbar-active-link">
          Connexion
        </button>
        <button mat-raised-button color="accent" routerLink="/register">
          Inscription Patient
        </button>
      </mat-toolbar>

      <main class="meditrack-container">
        <router-outlet></router-outlet>
      </main>
    </ng-template>
  `,
  styles: [`
    .shell-container {
      min-height: 100vh;
    }
    .shell-sidenav {
      width: 260px;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
    }
    .sidenav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
    }
    .brand-icon {
      color: #3f51b5;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .brand-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #102a43;
      line-height: 1.2;
    }
    .brand-subtitle {
      font-size: 0.78rem;
      color: #627d98;
    }
    .user-profile-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: #f8fafc;
    }
    .avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3f51b5;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.95rem;
      flex-shrink: 0;
    }
    .user-meta {
      min-width: 0;
    }
    .user-name {
      font-weight: 600;
      font-size: 0.92rem;
      color: #102a43;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .role-pill {
      display: inline-block;
      margin-top: 2px;
      padding: 2px 8px;
      font-size: 0.72rem;
      font-weight: 600;
      border-radius: 999px;
      background: #e8eaf6;
      color: #303f9f;
    }
    .sidenav-active-link {
      background: #e8eaf6 !important;
      color: #303f9f !important;
      font-weight: 600;
    }
    .nav-divider {
      margin: 0.5rem 0;
    }
    .shell-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .toolbar-title {
      font-weight: 600;
      font-size: 1rem;
    }
    .guest-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .toolbar-active-link {
      background: rgba(255, 255, 255, 0.16);
    }
    .user-menu-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
    @media (max-width: 600px) {
      .hide-xs {
        display: none;
      }
    }
  `]
})
export class AppShellComponent {
  @ViewChild('drawer') drawer?: MatSidenav;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly currentUser$ = this.authService.currentUser$;
  readonly isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
    map((result) => result.matches),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  getSectionItems(role: UserRole, section: 'principal' | 'securite'): NavMenuItem[] {
    return getNavItemsForRole(role).filter((item) => item.section === section);
  }

  getRoleLabel(role: UserRole): string {
    return ROLE_DISPLAY_LABELS[role] ?? role;
  }

  getInitials(user: User): string {
    const first = user.firstName?.charAt(0) ?? '';
    const last = user.lastName?.charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || 'MT';
  }

  closeOnHandset(): void {
    if (this.drawer && this.drawer.mode === 'over') {
      this.drawer.close();
    }
  }

  logout(): void {
    this.authService.logout();
    this.notification.info('Vous avez été déconnecté.');
    this.router.navigate(['/login']);
  }
}
