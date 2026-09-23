import { Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'app-badge',
  template: `<span class="badge" [class]="'badge--' + tone()"><ng-content /></span>`,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
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
      background: var(--primary-soft);
      color: var(--primary-dark);
    }
    .badge--info {
      background: var(--info-soft);
      color: var(--info);
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
