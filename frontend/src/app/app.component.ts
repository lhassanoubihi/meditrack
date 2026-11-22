import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>local_hospital</mat-icon>
      <span style="margin-left: 8px; font-weight: 600;">MediTrack — Gestion Médicale en Ligne</span>
      <span style="flex: 1 1 auto;"></span>
      <button mat-button>Connexion</button>
      <button mat-raised-button color="accent">Inscription Patient</button>
    </mat-toolbar>

    <main class="meditrack-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Bienvenue sur MediTrack (Angular 17 + Angular Material)</mat-card-title>
          <mat-card-subtitle>Plateforme centralisée et sécurisée — Dossiers Patients, Rendez-vous, Consultations & Pharmacie</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content style="margin-top: 1rem;">
          <p>Socle Frontend Angular 17 initialisé (US-01-T2 — MED-46).</p>
        </mat-card-content>
      </mat-card>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  title = 'meditrack-frontend';
}
