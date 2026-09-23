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
          <span class="brand__mark">T</span>
          <div>
            <strong>TeamHub</strong>
            <span>Colaboradores</span>
          </div>
        </div>

        <nav class="nav">
          <a
            class="nav__link"
            routerLink="/colaboradores"
            routerLinkActive="is-active"
            [routerLinkActiveOptions]="{ exact: false }"
            (click)="close()"
          >
            Colaboradores
          </a>
          <a class="nav__link" routerLink="/colaboradores/novo" routerLinkActive="is-active" (click)="close()">
            Novo colaborador
          </a>
        </nav>

        <div class="sidebar__footer">
          @if (user(); as currentUser) {
            <div class="user">
              <app-avatar
                [name]="currentUser.firstName + ' ' + currentUser.lastName"
                [src]="currentUser.image"
                [size]="34"
              />
              <div class="user__info">
                <strong>{{ currentUser.firstName }} {{ currentUser.lastName }}</strong>
                <span>{{ currentUser.email }}</span>
              </div>
            </div>
          }
          <button type="button" class="nav__link nav__link--button" (click)="logout()">Sair</button>
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
          <span class="topbar__title">Gestão de colaboradores</span>
          <span class="topbar__badge">API DummyJSON</span>
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
      grid-template-columns: 250px 1fr;
      min-height: 100vh;
    }
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.25rem 1rem;
      background: #101a2b;
      color: #fff;
      position: sticky;
      top: 0;
      height: 100vh;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0 0.5rem;
    }
    .brand__mark {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: var(--primary);
      font-weight: 800;
    }
    .brand div {
      display: flex;
      flex-direction: column;
      line-height: 1.25;
    }
    .brand strong {
      font-size: 0.95rem;
    }
    .brand span {
      font-size: 0.72rem;
      color: #93a1b8;
    }
    .nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }
    .nav__link {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      color: #93a1b8;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .nav__link:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
    }
    .nav__link.is-active {
      background: var(--primary);
      color: #fff;
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
      gap: 0.6rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
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
      font-size: 0.83rem;
    }
    .user__info span {
      font-size: 0.7rem;
      color: #93a1b8;
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
      padding: 0.9rem 1.5rem;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 20;
    }
    .topbar__title {
      font-weight: 600;
      font-size: 0.9rem;
    }
    .topbar__badge {
      margin-left: auto;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-dark);
      background: var(--primary-soft);
      padding: 0.25rem 0.6rem;
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
        width: 250px;
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
