import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let notifications: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    notifications = TestBed.inject(NotificationService);
  });

  afterEach(() => httpTesting.verify());

  it('deve notificar o usuário em erro de requisição comum', () => {
    const spy = vi.spyOn(notifications, 'error');

    http.get('https://dummyjson.com/users').subscribe({ error: () => undefined });
    httpTesting
      .expectOne('https://dummyjson.com/users')
      .flush({ message: 'falhou' }, { status: 500, statusText: 'Server Error' });

    expect(spy).toHaveBeenCalled();
  });

  it('não deve notificar em erro de autenticação (tratado na tela)', () => {
    const spy = vi.spyOn(notifications, 'error');

    http.post('https://dummyjson.com/auth/login', {}).subscribe({ error: () => undefined });
    httpTesting
      .expectOne('https://dummyjson.com/auth/login')
      .flush({}, { status: 400, statusText: 'Bad Request' });

    expect(spy).not.toHaveBeenCalled();
  });
});
