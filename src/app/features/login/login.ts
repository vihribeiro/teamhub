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
          <strong>TeamHub</strong>
          <span>Gestão de colaboradores</span>
        </div>

        <div class="pitch">
          <h1>Todas as pessoas da sua equipe em um só lugar.</h1>
          <p>
            Autenticação real, busca, paginação e CRUD consumindo a API pública
            <strong>DummyJSON</strong>.
          </p>
          <ul>
            <li>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Autenticação JWT com interceptor
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Consumo de API REST
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Testes e deploy automatizado (CI/CD)
            </li>
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
      grid-template-columns: 1.05fr 1fr;
      min-height: 100vh;
    }
    .login__aside {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 2rem;
      padding: 2.75rem;
      overflow: hidden;
      color: #fff;
      background: linear-gradient(155deg, #312e81 0%, #4f46e5 55%, #6366f1 100%);
    }
    .login__aside::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.16) 0, transparent 45%),
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size:
        auto,
        46px 46px,
        46px 46px;
      mask-image: radial-gradient(90% 70% at 30% 20%, #000 0%, transparent 80%);
      pointer-events: none;
    }
    .brand {
      position: relative;
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    .brand strong {
      font-size: 1.3rem;
      letter-spacing: -0.03em;
    }
    .brand span {
      font-size: 0.78rem;
      color: rgba(255, 255, 255, 0.75);
    }
    .pitch {
      position: relative;
    }
    .pitch h1 {
      font-size: 2.15rem;
      line-height: 1.12;
      letter-spacing: -0.03em;
      max-width: 20ch;
      margin: 0;
    }
    .pitch p {
      color: rgba(255, 255, 255, 0.82);
      max-width: 42ch;
      margin: 1rem 0 1.6rem;
    }
    .pitch ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .pitch li {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.92rem;
      color: rgba(255, 255, 255, 0.95);
    }
    .pitch li svg {
      flex-shrink: 0;
    }
    .foot {
      position: relative;
      font-size: 0.78rem;
      color: rgba(255, 255, 255, 0.7);
    }
    .login__panel {
      display: grid;
      place-items: center;
      padding: 2.5rem 1.5rem;
      background: var(--bg);
    }
    .form {
      width: 100%;
      max-width: 390px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      padding: 2.25rem;
      animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .form header {
      margin-bottom: 1.6rem;
    }
    .form h2 {
      margin: 0;
      font-size: 1.4rem;
    }
    .form header p {
      margin: 0.35rem 0 0;
      color: var(--text-muted);
      font-size: 0.88rem;
    }
    .form__error {
      background: var(--danger-soft);
      color: var(--danger);
      border-radius: var(--radius-sm);
      padding: 0.65rem 0.8rem;
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
      border-radius: 5px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    @media (max-width: 860px) {
      .login {
        grid-template-columns: 1fr;
      }
      .login__aside {
        display: none;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .form {
        animation: none;
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
