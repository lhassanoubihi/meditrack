import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

function extractErrorMessage(error: HttpErrorResponse): string {
  const apiMessage =
    typeof error.error === 'object' && error.error !== null && 'message' in error.error
      ? String((error.error as { message?: unknown }).message ?? '').trim()
      : '';

  if (apiMessage) {
    return apiMessage;
  }

  switch (error.status) {
    case 0:
      return 'Impossible de joindre le serveur MediTrack. Vérifiez votre connexion réseau.';
    case 400:
    case 422:
      return 'Requête invalide. Veuillez vérifier les informations saisies.';
    case 401:
      return 'Session expirée ou authentification requise. Veuillez vous reconnecter.';
    case 403:
      return 'Accès refusé : vous ne disposez pas des droits nécessaires pour cette action.';
    case 404:
      return 'La ressource demandée est introuvable.';
    case 409:
      return 'Conflit détecté : cette ressource existe déjà ou a été modifiée.';
    default:
      return error.status >= 500
        ? 'Erreur interne du serveur MediTrack. Veuillez réessayer ultérieurement.'
        : 'Une erreur inattendue est survenue.';
  }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && !req.context.get(SKIP_ERROR_TOAST)) {
        const message = extractErrorMessage(error);
        if (error.status === 403 || error.status === 409) {
          notification.warning(message);
        } else {
          notification.error(message);
        }
      }

      return throwError(() => error);
    })
  );
};
