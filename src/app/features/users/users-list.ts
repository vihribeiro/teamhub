import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { User } from '../../core/models/user.model';
import { NotificationService } from '../../core/services/notification.service';
import { UsersService } from '../../core/services/users.service';
import { Avatar } from '../../shared/avatar';
import { Badge } from '../../shared/badge';
import { EmptyState } from '../../shared/empty-state';
import { Modal } from '../../shared/modal';
import { Spinner } from '../../shared/spinner';

@Component({
  selector: 'app-users-list',
  imports: [ReactiveFormsModule, RouterLink, Avatar, Badge, EmptyState, Modal, Spinner],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>Colaboradores</h1>
          <p>{{ total() }} colaboradores encontrados</p>
        </div>
        <a class="btn btn-primary" routerLink="/colaboradores/novo">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Novo colaborador
        </a>
      </header>

      <div class="toolbar">
        <label class="search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            class="input"
            placeholder="Buscar por nome ou e-mail..."
            [formControl]="searchControl"
          />
        </label>
        <button type="button" class="btn btn-ghost" (click)="reload()">Atualizar</button>
      </div>

      @if (loading()) {
        <div class="state card">
          <app-spinner [size]="20" />
          Carregando colaboradores...
        </div>
      } @else if (error(); as message) {
        <div class="state card state--error">
          {{ message }}
          <button type="button" class="btn btn-ghost" (click)="reload()">Tentar novamente</button>
        </div>
      } @else if (pageUsers().length === 0) {
        <div class="card">
          <app-empty-state
            title="Nenhum colaborador encontrado"
            message="Ajuste a busca e tente novamente."
          />
        </div>
      } @else {
        <section class="grid">
          @for (user of pageUsers(); track user.id) {
            <article class="user-card card">
              <div class="user-card__top">
                <app-avatar [name]="fullName(user)" [src]="user.image" [size]="56" />
                @if (user.company; as company) {
                  <app-badge tone="info">{{ company.department }}</app-badge>
                }
              </div>

              <div class="user-card__info">
                <strong>{{ fullName(user) }}</strong>
                <span>{{ user.email }}</span>
              </div>

              <div class="user-card__actions">
                <a class="btn btn-ghost btn-sm" [routerLink]="['/colaboradores', user.id]">Ver</a>
                <a class="btn btn-ghost btn-sm" [routerLink]="['/colaboradores', user.id, 'editar']">
                  Editar
                </a>
                <button type="button" class="btn btn-danger-soft btn-sm" (click)="confirmDelete(user)">
                  Excluir
                </button>
              </div>
            </article>
          }
        </section>

        <nav class="pager">
          <span class="pager__info">Página {{ currentPage() }} de {{ totalPages() }}</span>
          <div class="pager__controls">
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              [disabled]="currentPage() <= 1"
              (click)="page.set(currentPage() - 1)"
            >
              Anterior
            </button>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              [disabled]="currentPage() >= totalPages()"
              (click)="page.set(currentPage() + 1)"
            >
              Próxima
            </button>
          </div>
        </nav>
      }
    </div>

    <app-modal title="Excluir colaborador" [open]="pendingDelete() !== null" (closed)="pendingDelete.set(null)">
      @if (pendingDelete(); as user) {
        <p class="confirm">
          Tem certeza que deseja excluir <strong>{{ fullName(user) }}</strong>? Esta ação não pode
          ser desfeita.
        </p>
        <div class="confirm__actions">
          <button type="button" class="btn btn-ghost" (click)="pendingDelete.set(null)">Cancelar</button>
          <button type="button" class="btn btn-danger" (click)="remove()">Excluir</button>
        </div>
      }
    </app-modal>
  `,
  styles: `
    .toolbar {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .search {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      color: var(--text-soft);
    }
    .search svg {
      position: absolute;
      left: 0.85rem;
      pointer-events: none;
    }
    .search .input {
      padding-left: 2.5rem;
      border-radius: 999px;
      background: var(--surface);
    }
    .state {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 2.5rem 1.25rem;
      color: var(--text-muted);
    }
    .state--error {
      color: var(--danger);
      justify-content: space-between;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .user-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.3rem;
      transition:
        box-shadow 0.2s ease,
        transform 0.2s ease;
    }
    .user-card:hover {
      box-shadow: var(--shadow);
      transform: translateY(-2px);
    }
    .user-card__top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .user-card__info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
    }
    .user-card__info strong {
      font-size: 1.02rem;
      letter-spacing: -0.02em;
    }
    .user-card__info span {
      font-size: 0.83rem;
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .user-card__actions {
      display: flex;
      gap: 0.4rem;
      margin-top: auto;
      flex-wrap: wrap;
      border-top: 1px solid var(--border);
      padding-top: 0.9rem;
    }
    .pager {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .pager__info {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .pager__controls {
      display: flex;
      gap: 0.5rem;
    }
    .confirm {
      margin: 0 0 1.5rem;
      color: var(--text-muted);
      font-size: 0.92rem;
    }
    .confirm strong {
      color: var(--text);
    }
    .confirm__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.6rem;
    }
    @media (prefers-reduced-motion: reduce) {
      .user-card {
        transition: none;
      }
      .user-card:hover {
        transform: none;
      }
    }
  `,
})
export class UsersList {
  private readonly usersService = inject(UsersService);
  private readonly notifications = inject(NotificationService);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly page = signal(1);
  readonly pageSize = 8;
  readonly pendingDelete = signal<User | null>(null);

  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(250)),
    { initialValue: '' },
  );

  readonly loading = this.usersService.loading;
  readonly error = this.usersService.error;

  readonly filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const users = this.usersService.users();
    if (!term) {
      return users;
    }
    return users.filter((user) =>
      `${this.fullName(user)} ${user.email}`.toLowerCase().includes(term),
    );
  });

  readonly total = computed(() => this.filtered().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  readonly currentPage = computed(() => Math.min(this.page(), this.totalPages()));
  readonly pageUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  constructor() {
    this.usersService.load();
    this.searchControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.page.set(1));
  }

  fullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  reload(): void {
    this.usersService.load(true);
  }

  confirmDelete(user: User): void {
    this.pendingDelete.set(user);
  }

  remove(): void {
    const user = this.pendingDelete();
    if (!user) {
      return;
    }
    this.usersService.remove(user.id).subscribe({
      next: () => {
        this.pendingDelete.set(null);
        this.notifications.success(`${this.fullName(user)} foi excluído.`);
      },
    });
  }
}
