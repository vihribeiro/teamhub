import { Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'app-badge',
  template: `<span class="badge" [class]="'badge--' + tone()"><ng-content /></span>`,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.22rem 0.62rem;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 700;
    }
    .badge::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
    .badge--neutral {
      background: var(--surface-2);
      color: var(--text-muted);
    }
    .badge--success {
      background: var(--success-soft);
      color: var(--success);
    }
    .badge--info {
      background: var(--primary-soft);
      color: var(--primary-dark);
    }
    .badge--warning {
      background: var(--warning-soft);
      color: var(--warning);
    }
    .badge--danger {
      background: var(--danger-soft);
      color: var(--danger);
    }
  `,
})
export class Badge {
  readonly tone = input<BadgeTone>('neutral');
}
