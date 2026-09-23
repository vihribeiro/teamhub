import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '../models/user.model';
import { UsersService } from './users.service';

function buildUser(id: number, firstName: string, lastName: string): User {
  return { id, firstName, lastName, email: `${firstName}@x.com`, phone: '1', image: '' };
}

describe('UsersService', () => {
  let service: UsersService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UsersService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('deve carregar colaboradores da API', () => {
    service.load();
    const req = httpTesting.expectOne('https://dummyjson.com/users?limit=0');
    req.flush({ users: [buildUser(1, 'Ana', 'Souza'), buildUser(2, 'Bruno', 'Lima')], total: 2, skip: 0, limit: 0 });

    expect(service.users().length).toBe(2);
    expect(service.loading()).toBe(false);
    expect(service.loaded()).toBe(true);
  });

  it('deve adicionar um colaborador criado', () => {
    service.load();
    httpTesting
      .expectOne('https://dummyjson.com/users?limit=0')
      .flush({ users: [buildUser(1, 'Ana', 'Souza')], total: 1, skip: 0, limit: 0 });

    service.create({ firstName: 'Novo', lastName: 'Membro', email: 'novo@x.com', phone: '9' }).subscribe();
    const req = httpTesting.expectOne('https://dummyjson.com/users/add');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 209 });

    expect(service.users().length).toBe(2);
    expect(service.users()[0].firstName).toBe('Novo');
  });

  it('deve remover um colaborador', () => {
    service.load();
    httpTesting
      .expectOne('https://dummyjson.com/users?limit=0')
      .flush({ users: [buildUser(1, 'Ana', 'Souza'), buildUser(2, 'Bruno', 'Lima')], total: 2, skip: 0, limit: 0 });

    service.remove(1).subscribe();
    const req = httpTesting.expectOne('https://dummyjson.com/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ id: 1 });

    expect(service.users().map((user) => user.id)).toEqual([2]);
  });

  it('deve remover um colaborador local sem chamar a API', () => {
    service.load();
    httpTesting
      .expectOne('https://dummyjson.com/users?limit=0')
      .flush({ users: [], total: 0, skip: 0, limit: 0 });

    let createdId = 0;
    service
      .create({ firstName: 'Local', lastName: 'User', email: 'local@x.com', phone: '1' })
      .subscribe((user) => (createdId = user.id));
    httpTesting.expectOne('https://dummyjson.com/users/add').flush({ id: 209 });

    service.remove(createdId).subscribe();

    expect(service.users().length).toBe(0);
  });
});
