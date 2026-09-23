import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty">
      <strong>{{ title() }}</strong>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: `
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      padding: 3rem 1rem;
      text-align: center;
      color: var(--text-muted);
    }
    strong {
      color: var(--text);
      font-size: 1rem;
    }
    p {
      margin: 0;
      font-size: 0.88rem;
    }
  `,
})
export class EmptyState {
  readonly title = input('Nada por aqui');
  readonly message = input('Ajuste os filtros ou tente novamente.');
}
