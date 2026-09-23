import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginResponse, Session } from '../models/auth.model';

const STORAGE_KEY = 'teamhub.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sessionSignal = signal<Session | null>(this.restore());

  readonly session = this.sessionSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.sessionSignal() !== null);
  readonly currentUser = computed(() => this.sessionSignal()?.user ?? null);

  get token(): string | null {
    return this.sessionSignal()?.accessToken ?? null;
  }

  login(username: string, password: string): Observable<Session> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        username,
        password,
        expiresInMins: 60,
      })
      .pipe(
        map((response) => {
          const user: AuthUser = {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            image: response.image,
          };
          return { accessToken: response.accessToken, user };
        }),
        tap((session) => this.persist(session)),
      );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sessionSignal.set(null);
  }

  private persist(session: Session): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.sessionSignal.set(session);
  }

  private restore(): Session | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }
}
