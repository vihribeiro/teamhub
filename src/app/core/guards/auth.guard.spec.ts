import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

function runGuard(isAuthenticated: boolean) {
  TestBed.configureTestingModule({
    providers: [
      { provide: AuthService, useValue: { isAuthenticated: () => isAuthenticated } },
      provideRouter([]),
    ],
  });
  return TestBed.runInInjectionContext(() =>
    authGuard({} as never, { url: '/colaboradores' } as never),
  );
}

describe('authGuard', () => {
  it('deve redirecionar para /login quando não autenticado', () => {
    const result = runGuard(false);
    expect(result).toBeInstanceOf(UrlTree);
    expect(String(result)).toContain('/login');
  });

  it('deve permitir o acesso quando autenticado', () => {
    const result = runGuard(true);
    expect(result).toBe(true);
  });
});
