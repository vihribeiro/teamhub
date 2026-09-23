# TeamHub — Gestão de Colaboradores

Aplicação **Angular** que consome a API REST pública [DummyJSON](https://dummyjson.com):
autenticação JWT, listagem de colaboradores com busca e paginação, detalhe e CRUD completo.
Inclui **testes unitários** e **CI/CD com deploy automático no GitHub Pages**.

Projeto de portfólio focado em integração com APIs REST, qualidade e automação.

## Funcionalidades

- **Login** com autenticação real (`POST /auth/login`), guarda de rota e retorno à URL de origem.
- **Interceptor de autenticação**: injeta o `Bearer token` nas requisições à API.
- **Interceptor de erro**: captura falhas HTTP e exibe notificações globais (toasts).
- **Colaboradores**: busca com _debounce_, paginação e estados de carregando/vazio/erro.
- **Detalhe** por rota (`/colaboradores/:id`) com dados de contato e empresa.
- **CRUD**: criar, editar e excluir (com confirmação), refletindo na lista.
- **Camada de estado** com signals e sobreposição local persistida em `localStorage`
  (a API de demonstração não persiste escritas — o app mantém as alterações localmente).
- **Layout responsivo** com sidebar retrátil.

> Credenciais de demonstração: `emilys` / `emilyspass`

## Stack

- **Angular 22** (standalone, signals, `@if`/`@for`, `input()`/`output()`)
- **TypeScript** · **RxJS** · **Reactive Forms**
- **HttpClient** com interceptors funcionais
- **Vitest** para testes
- **GitHub Actions** para CI e deploy no GitHub Pages

## Arquitetura

```
src/app
├── core
│   ├── guards/          # authGuard
│   ├── interceptors/    # authInterceptor, errorInterceptor
│   ├── models/          # User, Session...
│   └── services/        # AuthService, UsersService, NotificationService
├── features
│   ├── login/
│   └── users/           # users-list, user-detail, user-form
├── layout/              # shell (sidebar + topbar)
└── shared/              # avatar, badge, modal, spinner, empty-state, toast
```

A URL da API é configurável via `src/environments/environment.ts` e
`environment.production.ts` (troca automática no build de produção).

## Como rodar

```bash
npm install
npm start          # http://localhost:4200
npm run build      # build de produção
npx ng test --watch=false
```

## CI/CD

- `.github/workflows/ci.yml`: roda testes e build em pull requests.
- `.github/workflows/deploy.yml`: em push para `main`, roda testes, faz o build com o
  `base-href` do repositório e publica no **GitHub Pages** (com `404.html` para rotas SPA).

Para habilitar: em **Settings → Pages**, selecione a origem **GitHub Actions**.

## Autor

**Vinícius Santos Ribeiro** — Desenvolvedor Frontend
[Portfólio](https://viniciusribeiro.dev.br) · [GitHub](https://github.com/vihribeiro)
