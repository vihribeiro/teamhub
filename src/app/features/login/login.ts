import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Spinner } from '../../shared/spinner';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Spinner],
  template: `
    <div class="login">
      <section class="login__aside">
        <div class="brand">
          <span class="brand__mark">T</span>
          <strong>TeamHub</strong>
        </div>
        <div class="pitch">
          <h1>Gestão de colaboradores, simples e centralizada.</h1>
          <p>
            Consome a API pública <strong>DummyJSON</strong> para autenticação e dados de
            colaboradores, com CRUD, busca e paginação.
          </p>
          <ul>
            <li>Autenticação JWT com interceptor</li>
            <li>Consumo de API REST</li>
            <li>Deploy automatizado (GitHub Actions)</li>
          </ul>
        </div>
        <span class="foot">Projeto de portfólio · Angular + TypeScript</span>
      </section>

      <section class="login__panel">
        <form class="form" [formGroup]="form" (ngSubmit)="submit()">
          <header>
            <h2>Acessar painel</h2>
            <p>Credenciais de demonstração já preenchidas.</p>
          </header>

          <div class="field">
            <label for="username">Usuário</label>
            <input
              id="username"
              class="input"
              formControlName="username"
              autocomplete="username"
              [class.is-invalid]="form.controls.username.touched && form.controls.username.invalid"
            />
            @if (form.controls.username.touched && form.controls.username.invalid) {
              <span class="error-text">Informe o usuário.</span>
            }
          </div>

          <div class="field">
            <label for="password">Senha</label>
            <input
              id="password"
              type="password"
              class="input"
              formControlName="password"
              autocomplete="current-password"
              [class.is-invalid]="form.controls.password.touched && form.controls.password.invalid"
            />
            @if (form.controls.password.touched && form.controls.password.invalid) {
              <span class="error-text">Informe a senha.</span>
            }
          </div>

          @if (errorMessage()) {
            <p class="form__error">{{ errorMessage() }}</p>
          }

          <button type="submit" class="btn btn-primary form__submit" [disabled]="loading()">
            @if (loading()) {
              <app-spinner [size]="16" />
              Entrando...
            } @else {
              Entrar
            }
          </button>

          <p class="hint">Demo: <code>emilys</code> / <code>emilyspass</code></p>
        </form>
      </section>
    </div>
  `,
  styles: `
    .login {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      min-height: 100vh;
    }
    .login__aside {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 2rem;
      padding: 2.5rem;
      background: linear-gradient(160deg, #0f1b2d 0%, #17253c 100%);
      color: #fff;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.7rem;
    }
    .brand__mark {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--primary);
      font-weight: 800;
    }
    .pitch h1 {
      font-size: 2rem;
      line-height: 1.15;
      max-width: 22ch;
      margin: 0;
    }
    .pitch p {
      color: #93a1b8;
      max-width: 42ch;
      margin: 1rem 0 1.5rem;
    }
    .pitch ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }
    .pitch li {
      font-size: 0.92rem;
      color: #d7deea;
    }
    .foot {
      font-size: 0.78rem;
      color: #93a1b8;
    }
    .login__panel {
      display: grid;
      place-items: center;
      padding: 2.5rem 1.5rem;
      background: var(--bg);
    }
    .form {
      width: 100%;
      max-width: 380px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 2rem;
    }
    .form header {
      margin-bottom: 1.5rem;
    }
    .form h2 {
      margin: 0;
      font-size: 1.35rem;
    }
    .form header p {
      margin: 0.35rem 0 0;
      color: var(--text-muted);
      font-size: 0.88rem;
    }
    .form__error {
      background: var(--danger-soft);
      color: var(--danger);
      border-radius: 8px;
      padding: 0.6rem 0.75rem;
      font-size: 0.85rem;
      margin: 0 0 1rem;
    }
    .form__submit {
      width: 100%;
      margin-top: 0.5rem;
    }
    .hint {
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin: 1rem 0 0;
    }
    code {
      background: var(--surface-2);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
    }
    @media (max-width: 860px) {
      .login {
        grid-template-columns: 1fr;
      }
      .login__aside {
        display: none;
      }
    }
  `,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    username: ['emilys', [Validators.required]],
    password: ['emilyspass', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    const { username, password } = this.form.getRawValue();

    this.auth.login(username, password).subscribe({
      next: () => {
        const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/colaboradores';
        this.router.navigateByUrl(redirectTo);
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(error?.error?.message ?? 'Usuário ou senha inválidos.');
        this.loading.set(false);
      },
    });
  }
}
