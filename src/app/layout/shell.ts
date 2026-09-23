import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Avatar } from '../shared/avatar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Avatar],
  template: `
    <div class="shell" [class.shell--open]="menuOpen()">
      <aside class="sidebar">
        <div class="brand">
          <strong>TeamHub</strong>
          <span>Gestão de colaboradores</span>
        </div>

        <nav class="nav">
          <span class="nav__label">Menu</span>
          <a
            class="nav__link"
            routerLink="/colaboradores"
            routerLinkActive="is-active"
            [routerLinkActiveOptions]="{ exact: false }"
            (click)="close()"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Colaboradores
          </a>
          <a class="nav__link" routerLink="/colaboradores/novo" routerLinkActive="is-active" (click)="close()">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
            Novo colaborador
          </a>
        </nav>

        <div class="sidebar__footer">
          @if (user(); as currentUser) {
            <div class="user">
              <app-avatar
                [name]="currentUser.firstName + ' ' + currentUser.lastName"
                [src]="currentUser.image"
                [size]="36"
              />
              <div class="user__info">
                <strong>{{ currentUser.firstName }} {{ currentUser.lastName }}</strong>
                <span>{{ currentUser.email }}</span>
              </div>
            </div>
          }
          <button type="button" class="nav__link nav__link--button" (click)="logout()">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      <div class="backdrop" (click)="close()"></div>

      <div class="main">
        <header class="topbar">
          <button type="button" class="menu-btn" aria-label="Abrir menu" (click)="toggle()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span class="topbar__title">Colaboradores</span>
          <span class="topbar__badge">API REST · DummyJSON</span>
        </header>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .shell {
      display: grid;
      grid-template-columns: 256px 1fr;
      min-height: 100vh;
    }
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.35rem 1rem;
      background: var(--surface);
      border-right: 1px solid var(--border);
      position: sticky;
      top: 0;
      height: 100vh;
    }
    .brand {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      padding: 0.2rem 0.55rem 0;
    }
    .brand strong {
      font-size: 1.2rem;
      letter-spacing: -0.03em;
    }
    .brand span {
      font-size: 0.74rem;
      color: var(--text-muted);
    }
    .nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }
    .nav__label {
      font-size: 0.68rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-soft);
      padding: 0 0.6rem 0.5rem;
    }
    .nav__link {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.6rem 0.7rem;
      border-radius: var(--radius-sm);
      color: var(--text-muted);
      font-size: 0.9rem;
      font-weight: 700;
      text-decoration: none;
      transition:
        background 0.16s ease,
        color 0.16s ease;
    }
    .nav__link:hover {
      background: var(--surface-2);
      color: var(--text);
    }
    .nav__link.is-active {
      background: var(--primary-soft);
      color: var(--primary-dark);
    }
    .nav__link--button {
      border: none;
      background: transparent;
      cursor: pointer;
      width: 100%;
      font-family: inherit;
      text-align: left;
    }
    .sidebar__footer {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      border-top: 1px solid var(--border);
      padding-top: 1rem;
    }
    .user {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0 0.5rem;
      min-width: 0;
    }
    .user__info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .user__info strong {
      font-size: 0.84rem;
    }
    .user__info span {
      font-size: 0.72rem;
      color: var(--text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .main {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .topbar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.75rem;
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 20;
    }
    .topbar__title {
      font-weight: 800;
      font-size: 1rem;
      letter-spacing: -0.02em;
    }
    .topbar__badge {
      margin-left: auto;
      font-size: 0.74rem;
      font-weight: 700;
      color: var(--primary-dark);
      background: var(--primary-soft);
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
    }
    .menu-btn {
      display: none;
      border: none;
      background: transparent;
      color: var(--text);
      cursor: pointer;
      padding: 0.25rem;
    }
    .content {
      padding: 1.75rem;
      flex: 1;
    }
    .backdrop {
      display: none;
    }
    @media (max-width: 900px) {
      .shell {
        grid-template-columns: 1fr;
      }
      .sidebar {
        position: fixed;
        z-index: 40;
        width: 256px;
        transform: translateX(-100%);
        transition: transform 0.2s ease;
      }
      .shell--open .sidebar {
        transform: translateX(0);
      }
      .shell--open .backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: var(--overlay);
        z-index: 30;
      }
      .menu-btn {
        display: inline-flex;
      }
      .content {
        padding: 1.25rem;
      }
    }
  `,
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.currentUser;
  readonly menuOpen = signal(false);

  toggle(): void {
    this.menuOpen.update((open) => !open);
  }

  close(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
