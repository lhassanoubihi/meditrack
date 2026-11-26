import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string, duration = 4000): void {
    this.open(message, 'snackbar-success', duration);
  }

  error(message: string, duration = 6000): void {
    this.open(message, 'snackbar-error', duration);
  }

  warning(message: string, duration = 5000): void {
    this.open(message, 'snackbar-warning', duration);
  }

  info(message: string, duration = 4000): void {
    this.open(message, 'snackbar-info', duration);
  }

  private open(message: string, panelClass: string, duration: number): void {
    this.snackBar.open(message, 'Fermer', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}
