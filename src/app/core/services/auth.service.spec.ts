import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('deve autenticar na API e persistir a sessão', async () => {
    const promise = firstValueFrom(service.login('emilys', 'emilyspass'));

    const req = httpTesting.expectOne('https://dummyjson.com/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toMatchObject({ username: 'emilys', password: 'emilyspass' });

    req.flush({
      id: 1,
      username: 'emilys',
      email: 'emily@x.dummyjson.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      image: 'img.png',
      accessToken: 'token-123',
      refreshToken: 'refresh-123',
    });

    const session = await promise;
    expect(session.accessToken).toBe('token-123');
    expect(service.isAuthenticated()).toBe(true);
    expect(service.token).toBe('token-123');
    expect(localStorage.getItem('teamhub.session')).toContain('token-123');
  });

  it('deve limpar a sessão ao sair', () => {
    localStorage.setItem('teamhub.session', JSON.stringify({ accessToken: 't', user: {} }));
    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.token).toBeNull();
    expect(localStorage.getItem('teamhub.session')).toBeNull();
  });
});
