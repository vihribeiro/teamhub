import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserPayload, UsersResponse } from '../models/user.model';

const OVERLAY_KEY = 'teamhub.users.overlay';

interface Overlay {
  created: User[];
  updated: Record<string, Partial<User>>;
  deleted: number[];
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/users`;

  private readonly usersSignal = signal<User[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly loadedSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  private overlay: Overlay = this.restoreOverlay();

  readonly users = this.usersSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly loaded = this.loadedSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  load(force = false): void {
    if (this.loadedSignal() && !force) {
      return;
    }
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<UsersResponse>(`${this.base}?limit=0`).subscribe({
      next: (response) => {
        this.usersSignal.set(this.applyOverlay(response.users));
        this.loadingSignal.set(false);
        this.loadedSignal.set(true);
      },
      error: () => {
        this.loadingSignal.set(false);
        this.errorSignal.set('Não foi possível carregar os colaboradores.');
      },
    });
  }

  byId(id: number): User | undefined {
    return this.usersSignal().find((user) => user.id === id);
  }

  create(payload: UserPayload): Observable<User> {
    return this.http.post<User>(`${this.base}/add`, payload).pipe(
      map(() => this.buildLocalUser(payload)),
      tap((user) => {
        this.overlay.created = [user, ...this.overlay.created];
        this.persistOverlay();
        this.usersSignal.update((list) => [user, ...list]);
      }),
    );
  }

  update(id: number, payload: UserPayload): Observable<User> {
    const request = this.isLocalUser(id)
      ? of(null)
      : this.http.put<unknown>(`${this.base}/${id}`, payload);

    return request.pipe(
      map(() => ({ ...(this.byId(id) as User), ...payload, id })),
      tap((user) => {
        this.overlay.updated[id] = payload;
        this.persistOverlay();
        this.usersSignal.update((list) => list.map((item) => (item.id === id ? user : item)));
      }),
    );
  }

  remove(id: number): Observable<{ id: number }> {
    const request = this.isLocalUser(id)
      ? of(null)
      : this.http.delete<unknown>(`${this.base}/${id}`);

    return request.pipe(
      map(() => ({ id })),
      tap(() => {
        this.overlay.deleted = [...this.overlay.deleted, id];
        this.overlay.created = this.overlay.created.filter((user) => user.id !== id);
        this.persistOverlay();
        this.usersSignal.update((list) => list.filter((user) => user.id !== id));
      }),
    );
  }

  clearLocalChanges(): void {
    this.overlay = { created: [], updated: {}, deleted: [] };
    this.persistOverlay();
  }

  private isLocalUser(id: number): boolean {
    return this.overlay.created.some((user) => user.id === id);
  }

  private buildLocalUser(payload: UserPayload): User {
    const maxId = Math.max(0, ...this.usersSignal().map((user) => user.id));
    return { id: maxId + 1, image: '', ...payload };
  }

  private applyOverlay(users: User[]): User[] {
    const deleted = new Set(this.overlay.deleted);
    const merged = users
      .filter((user) => !deleted.has(user.id))
      .map((user) =>
        this.overlay.updated[user.id] ? { ...user, ...this.overlay.updated[user.id] } : user,
      );

    return [...this.overlay.created.filter((user) => !deleted.has(user.id)), ...merged];
  }

  private persistOverlay(): void {
    localStorage.setItem(OVERLAY_KEY, JSON.stringify(this.overlay));
  }

  private restoreOverlay(): Overlay {
    try {
      const raw = localStorage.getItem(OVERLAY_KEY);
      if (raw) {
        return JSON.parse(raw) as Overlay;
      }
    } catch {
      // ignore malformed storage
    }
    return { created: [], updated: {}, deleted: [] };
  }
}
