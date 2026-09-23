import { Component, inject } from '@angular/core';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toasts" aria-live="polite">
      @for (item of notifications(); track item.id) {
        <div class="toast" [class]="'toast--' + item.tone" role="status">
          <div class="toast__content">
            <strong>{{ item.title }}</strong>
            <span>{{ item.message }}</span>
          </div>
          <button type="button" class="toast__close" aria-label="Fechar" (click)="dismiss(item.id)">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toasts {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 80;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      width: min(360px, calc(100vw - 2rem));
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 0.7rem;
      padding: 0.85rem 0.9rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      border-left: 4px solid var(--tone, var(--info));
      background: var(--surface);
      box-shadow: var(--shadow-lg);
      animation: slide 0.2s ease;
    }
    .toast--success {
      --tone: var(--primary);
    }
    .toast--error {
      --tone: var(--danger);
    }
    .toast--warning {
      --tone: var(--warning);
    }
    .toast--info {
      --tone: var(--info);
    }
    .toast__content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .toast__content strong {
      font-size: 0.88rem;
    }
    .toast__content span {
      font-size: 0.83rem;
      color: var(--text-muted);
    }
    .toast__close {
      border: none;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      display: inline-flex;
      padding: 0;
    }
    @keyframes slide {
      from {
        opacity: 0;
        transform: translateX(16px);
      }
    }
  `,
})
export class ToastContainer {
  private readonly service = inject(NotificationService);

  readonly notifications = this.service.notifications;

  dismiss(id: number): void {
    this.service.dismiss(id);
  }
}
