import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Avatar } from '../shared/avatar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Avatar],
  template: `
    <div class="app">
      <header class="topnav">
        <div class="topnav__inner">
          <a class="brand" routerLink="/colaboradores">TeamHub</a>

          <nav class="topnav__links">
            <a
              routerLink="/colaboradores"
              routerLinkActive="is-active"
              [routerLinkActiveOptions]="{ exact: false }"
            >
              Colaboradores
            </a>
            <a routerLink="/colaboradores/novo" routerLinkActive="is-active">Novo colaborador</a>
          </nav>

          <div class="topnav__right">
            @if (user(); as currentUser) {
              <span class="chip">
                <app-avatar
                  [name]="currentUser.firstName + ' ' + currentUser.lastName"
                  [src]="currentUser.image"
                  [size]="30"
                />
                <span class="chip__name">{{ currentUser.firstName }}</span>
              </span>
            }
            <button type="button" class="logout" (click)="logout()">Sair</button>
            <button type="button" class="menu-btn" aria-label="Abrir menu" (click)="toggle()">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>

        @if (menuOpen()) {
          <nav class="topnav__mobile">
            <a routerLink="/colaboradores" routerLinkActive="is-active" (click)="close()">
              Colaboradores
            </a>
            <a routerLink="/colaboradores/novo" routerLinkActive="is-active" (click)="close()">
              Novo colaborador
            </a>
            <button type="button" (click)="logout()">Sair</button>
          </nav>
        }
      </header>

      <main class="container">
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .app {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .topnav {
      position: sticky;
      top: 0;
      z-index: 30;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
    }
    .topnav__inner {
      max-width: 1120px;
      margin: 0 auto;
      padding: 0.8rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .brand {
      font-size: 1.18rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      text-decoration: none;
    }
    .topnav__links {
      display: flex;
      gap: 0.3rem;
    }
    .topnav__links a {
      padding: 0.45rem 0.85rem;
      border-radius: 999px;
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-muted);
      text-decoration: none;
      transition:
        background 0.16s ease,
        color 0.16s ease;
    }
    .topnav__links a:hover {
      background: var(--surface-2);
      color: var(--text);
    }
    .topnav__links a.is-active {
      background: var(--primary-soft);
      color: var(--primary-dark);
    }
    .topnav__right {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .chip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.2rem 0.75rem 0.2rem 0.2rem;
      border-radius: 999px;
      background: var(--surface-2);
      font-size: 0.85rem;
      font-weight: 700;
    }
    .logout {
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 0.35rem 0.4rem;
      transition: color 0.15s ease;
    }
    .logout:hover {
      color: var(--danger);
    }
    .menu-btn {
      display: none;
      border: none;
      background: transparent;
      color: var(--text);
      cursor: pointer;
      padding: 0.25rem;
    }
    .topnav__mobile {
      display: none;
    }
    .container {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      padding: 2rem 1.5rem 3.5rem;
      flex: 1;
    }
    @media (max-width: 720px) {
      .topnav__links,
      .chip__name,
      .logout {
        display: none;
      }
      .menu-btn {
        display: inline-flex;
      }
      .topnav__mobile {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding: 0.6rem 1.5rem 1rem;
        border-top: 1px solid var(--border);
      }
      .topnav__mobile a {
        padding: 0.6rem 0.75rem;
        border-radius: var(--radius-sm);
        font-weight: 700;
        color: var(--text-muted);
        text-decoration: none;
      }
      .topnav__mobile a.is-active {
        background: var(--primary-soft);
        color: var(--primary-dark);
      }
      .topnav__mobile button {
        padding: 0.6rem 0.75rem;
        border: none;
        border-radius: var(--radius-sm);
        background: transparent;
        color: var(--danger);
        font-weight: 700;
        text-align: left;
        cursor: pointer;
      }
      .container {
        padding: 1.5rem 1.25rem 3rem;
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
