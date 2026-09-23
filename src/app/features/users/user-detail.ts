import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { Avatar } from '../../shared/avatar';
import { Badge } from '../../shared/badge';
import { Spinner } from '../../shared/spinner';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink, Avatar, Badge, Spinner],
  template: `
    <div class="page">
      <a class="back" routerLink="/colaboradores">&larr; Voltar</a>

      @if (loading()) {
        <div class="state card">
          <app-spinner [size]="20" />
          Carregando colaborador...
        </div>
      } @else if (user(); as person) {
        <article class="card profile">
          <header class="profile__header">
            <app-avatar [name]="person.firstName + ' ' + person.lastName" [src]="person.image" [size]="80" />
            <div>
              <h1>{{ person.firstName }} {{ person.lastName }}</h1>
              <p>{{ person.email }}</p>
              @if (person.company; as company) {
                <app-badge tone="info">{{ company.title }}</app-badge>
              }
            </div>
            <a class="btn btn-primary" [routerLink]="['/colaboradores', person.id, 'editar']">Editar</a>
          </header>

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
        </article>
      } @else {
        <div class="card state">Colaborador não encontrado.</div>
      }
    </div>
  `,
  styles: `
    .back {
      display: inline-block;
      margin-bottom: 1rem;
      font-size: 0.88rem;
      color: var(--text-muted);
      text-decoration: none;
    }
    .back:hover {
      color: var(--text);
    }
    .state {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 2.5rem 1.25rem;
      color: var(--text-muted);
    }
    .profile {
      padding: 1.75rem;
    }
    .profile__header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .profile__header h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .profile__header p {
      margin: 0.25rem 0 0.6rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .profile__header .btn {
      margin-left: auto;
    }
    .profile__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem;
      margin: 1.5rem 0 0;
    }
    .profile__grid dt {
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      font-weight: 600;
    }
    .profile__grid dd {
      margin: 0.3rem 0 0;
      font-weight: 600;
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
