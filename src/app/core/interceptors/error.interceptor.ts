import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRequest = req.url.includes('/auth/');

      if (!isAuthRequest) {
        const message =
          error.status === 0
            ? 'Falha de conexão. Verifique sua internet.'
            : ((error.error as { message?: string } | null)?.message ??
              `Erro ${error.status} ao acessar a API.`);
        notifications.error(message, 'Falha na requisição');
      }

      return throwError(() => error);
    }),
  );
};
