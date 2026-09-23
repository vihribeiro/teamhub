import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { UsersService } from '../../core/services/users.service';
import { Spinner } from '../../shared/spinner';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, RouterLink, Spinner],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>{{ isEdit() ? 'Editar colaborador' : 'Novo colaborador' }}</h1>
          <p>{{ isEdit() ? 'Atualize os dados do colaborador.' : 'Preencha os dados do novo colaborador.' }}</p>
        </div>
      </header>

      <form class="card form" [formGroup]="form" (ngSubmit)="submit()">
        <div class="row">
          <div class="field">
            <label for="firstName">Nome</label>
            <input
              id="firstName"
              class="input"
              formControlName="firstName"
              [class.is-invalid]="invalid('firstName')"
            />
            @if (invalid('firstName')) {
              <span class="error-text">Informe o nome (mín. 2 caracteres).</span>
            }
          </div>

          <div class="field">
            <label for="lastName">Sobrenome</label>
            <input
              id="lastName"
              class="input"
              formControlName="lastName"
              [class.is-invalid]="invalid('lastName')"
            />
            @if (invalid('lastName')) {
              <span class="error-text">Informe o sobrenome.</span>
            }
          </div>
        </div>

        <div class="field">
          <label for="email">E-mail</label>
          <input
            id="email"
            type="email"
            class="input"
            formControlName="email"
            [class.is-invalid]="invalid('email')"
          />
          @if (invalid('email')) {
            <span class="error-text">Informe um e-mail válido.</span>
          }
        </div>

        <div class="field">
          <label for="phone">Telefone</label>
          <input
            id="phone"
            class="input"
            formControlName="phone"
            [class.is-invalid]="invalid('phone')"
          />
          @if (invalid('phone')) {
            <span class="error-text">Informe o telefone.</span>
          }
        </div>

        <div class="form__actions">
          <a class="btn btn-ghost" routerLink="/colaboradores">Cancelar</a>
          <button type="submit" class="btn btn-primary" [disabled]="saving()">
            @if (saving()) {
              <app-spinner [size]="16" />
            }
            {{ isEdit() ? 'Salvar alterações' : 'Cadastrar' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
    .form {
      padding: 1.5rem;
      max-width: 620px;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .form__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.6rem;
      margin-top: 0.5rem;
    }
    @media (max-width: 560px) {
      .row {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class UserForm {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  readonly id = input<string | undefined>(undefined);
  readonly isEdit = computed(() => this.id() !== undefined);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
  });

  private patched = false;

  constructor() {
    this.usersService.load();

    effect(() => {
      const id = this.id();
      if (!id || this.patched) {
        return;
      }
      const user = this.usersService.byId(Number(id));
      if (user) {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        });
        this.patched = true;
      }
    });
  }

  invalid(controlName: 'firstName' | 'lastName' | 'email' | 'phone'): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.invalid;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();
    const id = this.id();
    const request = id
      ? this.usersService.update(Number(id), payload)
      : this.usersService.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.notifications.success(
          id ? 'Colaborador atualizado com sucesso.' : 'Colaborador cadastrado com sucesso.',
        );
        this.router.navigateByUrl('/colaboradores');
      },
      error: () => this.saving.set(false),
    });
  }
}
