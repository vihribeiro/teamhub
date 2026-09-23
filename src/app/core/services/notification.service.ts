import { Injectable, signal } from '@angular/core';

export type NotificationTone = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  message: string;
  title: string;
  tone: NotificationTone;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsSignal = signal<Notification[]>([]);
  readonly notifications = this.notificationsSignal.asReadonly();

  private sequence = 0;

  success(message: string, title = 'Sucesso'): void {
    this.push(message, title, 'success');
  }

  error(message: string, title = 'Erro'): void {
    this.push(message, title, 'error');
  }

  info(message: string, title = 'Aviso'): void {
    this.push(message, title, 'info');
  }

  dismiss(id: number): void {
    this.notificationsSignal.update((list) => list.filter((item) => item.id !== id));
  }

  private push(message: string, title: string, tone: NotificationTone): void {
    const id = ++this.sequence;
    this.notificationsSignal.update((list) => [...list, { id, message, title, tone }]);
    setTimeout(() => this.dismiss(id), 4500);
  }
}
