import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Shell } from './layout/shell';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'colaboradores' },
      {
        path: 'colaboradores',
        loadComponent: () => import('./features/users/users-list').then((m) => m.UsersList),
      },
      {
        path: 'colaboradores/novo',
        loadComponent: () => import('./features/users/user-form').then((m) => m.UserForm),
      },
      {
        path: 'colaboradores/:id',
        loadComponent: () => import('./features/users/user-detail').then((m) => m.UserDetail),
      },
      {
        path: 'colaboradores/:id/editar',
        loadComponent: () => import('./features/users/user-form').then((m) => m.UserForm),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
