import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { Avatar } from '../../shared/avatar';
import { Spinner } from '../../shared/spinner';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, Avatar, Spinner],
  template: `
    <div class="page">
      <a class="back" routerLink="/colaboradores">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Voltar
      </a>

      @if (loading()) {
        <div class="state card">
          <app-spinner [size]="20" />
          Carregando colaborador...
        </div>
      } @else if (user(); as person) {
        <article class="profile card">
          <header class="profile__hero">
            <app-avatar [name]="person.firstName + ' ' + person.lastName" [src]="person.image" [size]="92" />
            <div class="profile__id">
              <h1>{{ person.firstName }} {{ person.lastName }}</h1>
              <p>{{ person.email }}</p>
              @if (person.company; as company) {
                <span class="profile__role">{{ company.title }}</span>
              }
            </div>
            <a class="btn profile__edit" [routerLink]="['/colaboradores', person.id, 'editar']">Editar</a>
          </header>

          <div class="profile__body">
            <dl class="profile__grid">
              <div>
                <dt>Telefone</dt>
                <dd>{{ person.phone }}</dd>
              </div>
              @if (person.age) {
                <div>
                  <dt>Idade</dt>
                  <dd>{{ person.age }} anos</dd>
                </div>
              }
              @if (person.gender) {
                <div>
                  <dt>Gênero</dt>
                  <dd>{{ person.gender }}</dd>
                </div>
              }
              @if (person.company; as company) {
                <div>
                  <dt>Empresa</dt>
                  <dd>{{ company.name }}</dd>
                </div>
                <div>
                  <dt>Departamento</dt>
                  <dd>{{ company.department }}</dd>
                </div>
                <div>
                  <dt>Cargo</dt>
                  <dd>{{ company.title }}</dd>
                </div>
              }
            </dl>
          </div>
        </article>
      } @else {
        <div class="card state">Colaborador não encontrado.</div>
      }
    </div>
  `,
  styles: `
    .back {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      align-self: flex-start;
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .back:hover {
      color: var(--primary);
    }
    .state {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 2.5rem 1.25rem;
      color: var(--text-muted);
    }
    .profile {
      overflow: hidden;
      padding: 0;
    }
    .profile__hero {
      display: flex;
      align-items: center;
      gap: 1.35rem;
      flex-wrap: wrap;
      padding: 2.25rem 2rem;
      color: #fff;
      background: linear-gradient(135deg, #312e81 0%, #4f46e5 58%, #6366f1 100%);
    }
    .profile__hero app-avatar {
      border-radius: 50%;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }
    .profile__id {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
      min-width: 0;
    }
    .profile__id h1 {
      color: #fff;
      font-size: 1.7rem;
      letter-spacing: -0.03em;
    }
    .profile__id p {
      margin: 0;
      color: rgba(255, 255, 255, 0.82);
      font-size: 0.92rem;
    }
    .profile__role {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      background: rgba(255, 255, 255, 0.16);
      padding: 0.24rem 0.62rem;
      border-radius: 999px;
    }
    .profile__edit {
      margin-left: auto;
      background: rgba(255, 255, 255, 0.16);
      color: #fff;
    }
    .profile__edit:hover {
      background: rgba(255, 255, 255, 0.26);
    }
    .profile__body {
      padding: 1.75rem 2rem 2rem;
    }
    .profile__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.85rem;
      margin: 0;
    }
    .profile__grid > div {
      background: var(--surface-2);
      border-radius: var(--radius-sm);
      padding: 0.9rem 1rem;
    }
    .profile__grid dt {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--text-muted);
      font-weight: 800;
    }
    .profile__grid dd {
      margin: 0.35rem 0 0;
      font-weight: 700;
      text-transform: capitalize;
    }
  `,
})
export class UserDetail {
  private readonly usersService = inject(UsersService);

  readonly id = input<string>('');
  readonly user = computed(() => this.usersService.byId(Number(this.id())));
  readonly loading = this.usersService.loading;

  constructor() {
    this.usersService.load();
  }
}
