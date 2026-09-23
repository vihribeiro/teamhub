import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    @if (open()) {
      <div class="backdrop" (click)="closed.emit()">
        <div
          class="modal"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="title()"
          (click)="$event.stopPropagation()"
        >
          <header class="modal__header">
            <h3>{{ title() }}</h3>
            <button type="button" class="icon-btn" aria-label="Fechar" (click)="closed.emit()">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </header>
          <div class="modal__body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 60;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: var(--overlay);
      animation: fade 0.15s ease;
    }
    .modal {
      width: 100%;
      max-width: 440px;
      max-height: 90vh;
      overflow: auto;
      background: var(--surface);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      animation: pop 0.18s ease;
    }
    .modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.1rem 1.25rem;
      border-bottom: 1px solid var(--border);
    }
    .modal__header h3 {
      margin: 0;
      font-size: 1.05rem;
    }
    .modal__body {
      padding: 1.25rem;
    }
    .icon-btn {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
    }
    .icon-btn:hover {
      background: var(--surface-2);
      color: var(--text);
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
    }
    @keyframes pop {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
      }
    }
  `,
})
export class Modal {
  readonly title = input('');
  readonly open = input(false);
  readonly closed = output<void>();
}
