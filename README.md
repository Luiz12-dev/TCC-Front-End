<p align="center">
  <img src="https://img.shields.io/badge/Angular-v21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/SSR-Enabled-6C3483?style=for-the-badge&logo=angular&logoColor=white" alt="SSR"/>
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-FFC107?style=for-the-badge" alt="Status"/>
</p>

<h1 align="center">✂️ Cortês Barbearia — Frontend</h1>

<p align="center">
  <strong>Interface web moderna e responsiva para o sistema de gerenciamento de barbearia Cortês.</strong><br/>
  Desenvolvido com Angular 21, design system próprio em dark mode e arquitetura modular.
</p>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Design System](#-design-system)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Integração com Backend](#-integração-com-backend)
- [Roadmap](#-roadmap)
- [Autores](#-autores)

---

## 📖 Sobre o Projeto

O **Cortês Barbearia** é um sistema web completo de gestão para barbearias, desenvolvido como Trabalho de Conclusão de Curso (TCC). O frontend oferece duas experiências distintas:

- **Painel Administrativo (OWNER):** Dashboard completo com gestão de agendamentos, serviços, horários de funcionamento, bloqueio de períodos e relatórios financeiros.
- **Área do Cliente (CLIENT):** Interface de agendamento com wizard interativo em etapas e histórico completo de agendamentos.

O sistema utiliza autenticação JWT com integração a um microsserviço de autenticação separado, seguindo princípios de arquitetura distribuída.

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **Angular** | 21.2.x | Framework principal SPA |
| **TypeScript** | 5.9.x | Linguagem de programação |
| **Angular SSR** | 21.2.x | Server-Side Rendering com hidratação |
| **RxJS** | 7.8.x | Programação reativa e gerenciamento de streams |
| **Express** | 5.1.x | Servidor SSR |
| **Phosphor Icons** | CDN | Biblioteca de ícones |
| **Google Fonts (Inter)** | CDN | Tipografia moderna |
| **Vitest** | 4.0.x | Framework de testes unitários (configurado; os `.spec.ts` atuais são os esqueletos gerados pelo Angular CLI) |

---

## ✅ Funcionalidades

### Implementadas ✔️

#### 🔐 Autenticação
- [x] Tela de Login com design glassmorphism
- [x] Tela de Cadastro de novos usuários
- [x] Integração JWT com microsserviço de autenticação (porta 8081)
- [x] Interceptor HTTP para injeção automática do token Bearer
- [x] Guards de rota por papel (`OWNER` / `CLIENT`)
- [x] Compatibilidade SSR nos guards (sem erro de `localStorage` no servidor)

#### 👔 Painel Administrativo (Owner)
- [x] **Dashboard** — Visão geral com agendamentos do dia e métricas
- [x] **Agendamentos** — Tabela completa com busca, filtros por status e ações rápidas (Confirmar, Iniciar, Concluir, Cancelar)
- [x] **Serviços** — CRUD completo de serviços da barbearia (nome, descrição, preço, duração)
- [x] **Horários de Funcionamento** — Configuração dos horários de abertura/fechamento por dia da semana
- [x] **Bloqueio de Períodos** — Cadastro de períodos bloqueados para agendamento (férias, feriados, etc.)
- [x] **Relatório Financeiro** — Visualização de receitas e métricas financeiras
- [x] Sidebar navegável com ícones e estado ativo
- [x] Layout responsivo com suporte mobile

#### 👤 Área do Cliente
- [x] **Agendamento (Wizard)** — Fluxo em 3 etapas: selecionar serviço → selecionar data e horário → confirmar
- [x] **Meu Histórico** — Visualização em grid de cards com filtros por status e ação de cancelamento
- [x] Header com navegação, avatar do usuário e dropdown menu
- [x] Layout responsivo com menu mobile (hamburger)

#### 🎨 Design & UX
- [x] Design System completo com CSS custom properties (variáveis)
- [x] Tema dark mode consistente em toda a aplicação
- [x] Efeitos glassmorphism e micro-animações
- [x] Componentes reutilizáveis (Toast, Confirm Modal)
- [x] Skeletons de carregamento
- [x] Cards com efeitos hover e brilho dourado
- [x] Tipografia Inter com hierarquia bem definida
- [x] Paleta de cores dourada (accent) com status colors diferenciadas

### Em Desenvolvimento 🔧

- [ ] **Perfil do Usuário** — Tela para edição de dados pessoais (nome, telefone)
- [ ] **Interceptor 401** — Redirecionamento automático ao login quando o token expirar
- [ ] **Testes Unitários** — Cobertura de testes nos componentes e serviços
- [ ] **Notificações em Tempo Real** — Push notifications para mudanças de status

---

## 🏗 Arquitetura do Projeto

A aplicação segue uma arquitetura modular inspirada em Domain-Driven Design (DDD), separando as responsabilidades em camadas:

```
┌────────────────────────────────────────────────────────┐
│                      ANGULAR APP                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────┐   ┌──────────────┐   ┌───────────────┐  │
│  │  Layout   │   │   Features   │   │    Shared     │  │
│  │          │   │              │   │               │  │
│  │ • Admin  │   │ • Auth       │   │ • Toast       │  │
│  │ • Client │   │ • Dashboard  │   │ • Confirm     │  │
│  │ • Auth   │   │ • Booking    │   │   Modal       │  │
│  │ • Header │   │ • History    │   │               │  │
│  │ • Sidebar│   │ • Services   │   └───────────────┘  │
│  └──────────┘   │ • Hours      │                      │
│                 │ • Blocked    │   ┌───────────────┐  │
│                 │ • Financial  │   │     Core      │  │
│                 │ • Appoints.  │   │               │  │
│                 └──────────────┘   │ • Services    │  │
│                                    │ • Models      │  │
│                                    │ • Guards      │  │
│                                    │ • Interceptor │  │
│                                    └───────────────┘  │
│                                                        │
├────────────────────────────────────────────────────────┤
│         HTTP Requests (JWT Bearer Token)               │
├────────────────────────────────────────────────────────┤
│  Backend Core (8080)     │    Auth Service (8081)      │
└──────────────────────────┴─────────────────────────────┘
```

---

## 📦 Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- **Node.js** >= 18.x
- **npm** >= 10.x
- **Angular CLI** >= 21.x (`npm install -g @angular/cli`)
- **Backend Core** rodando na porta `8080`
- **Microsserviço de Auth** rodando na porta `8081`

---

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/core-barbershop.git
cd core-barbershop/barbershop-FrontEnd
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento
```bash
ng serve
# ou
npm start
```

A aplicação estará disponível em: **http://localhost:4200**

### 4. Build para produção (opcional)
```bash
ng build --configuration production
```

### 5. Executar com SSR (opcional)
```bash
npm run serve:ssr:barbershop-FrontEnd
```

---

## 🔒 Variáveis de Ambiente

As configurações de ambiente estão localizadas em `src/environments/`:

| Arquivo | Descrição |
|---|---|
| `environment.ts` | Configuração de desenvolvimento |
| `environment.prod.ts` | Configuração de produção |

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',      // Backend Core
  authUrl: 'http://localhost:8081/api/auth'  // Microsserviço de Autenticação
};
```

> **Cuidado ao demonstrar remotamente:** este arquivo costuma ser repontado para
> URLs de túnel (ngrok, localtunnel) durante apresentações e acaba commitado
> assim. Se as chamadas à API falharem com erro de DNS ou aviso de túnel, é o
> primeiro lugar a conferir — restaure os valores `localhost` acima.

---

## 📁 Estrutura de Pastas

```
src/
├── app/
│   ├── core/                          # Camada central (singleton)
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Guards: authGuard, adminGuard, clientGuard
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts    # Injeção automática do JWT nos requests
│   │   ├── models/
│   │   │   ├── appointment.model.ts   # Interface Appointment + enum AppointmentStatus
│   │   │   ├── barber-service.model.ts# Interface BarberService
│   │   │   ├── blocked-period.model.ts# Interface BlockedPeriod
│   │   │   └── business-hours.model.ts# Interface BusinessHours
│   │   └── services/
│   │       ├── appointment.service.ts # CRUD agendamentos + histórico + slots
│   │       ├── auth.service.ts        # Login, logout, decode JWT, getToken
│   │       ├── barber.service.ts      # CRUD serviços da barbearia
│   │       ├── blocked-period.service.ts # CRUD períodos bloqueados
│   │       ├── business-hours.service.ts # CRUD horários de funcionamento
│   │       └── toast.service.ts       # Sistema de notificações toast
│   │
│   ├── features/                      # Módulos de funcionalidade
│   │   ├── auth/
│   │   │   ├── login/                 # Tela de login
│   │   │   └── register/             # Tela de cadastro
│   │   ├── dashboard/                 # Dashboard do admin (visão geral)
│   │   ├── appointments/              # Gestão de agendamentos (admin)
│   │   ├── services/                  # CRUD de serviços (admin)
│   │   ├── business-hours/            # Horários de funcionamento (admin)
│   │   ├── blocked-periods/           # Bloqueio de períodos (admin)
│   │   ├── financial-report/          # Relatório financeiro (admin)
│   │   └── client/
│   │       ├── booking/               # Wizard de agendamento (cliente)
│   │       └── history/               # Histórico de agendamentos (cliente)
│   │
│   ├── layout/                        # Layouts estruturais
│   │   ├── admin-layout/              # Layout do painel administrativo
│   │   ├── auth-layout/               # Layout das telas de autenticação
│   │   ├── client-layout/             # Layout da área do cliente
│   │   ├── header/                    # Componente de header
│   │   └── sidebar/                   # Sidebar de navegação admin
│   │
│   ├── shared/                        # Componentes reutilizáveis
│   │   ├── confirm-modal/             # Modal de confirmação genérico
│   │   └── toast/                     # Componente de notificação toast
│   │
│   ├── app.routes.ts                  # Definição central de rotas
│   ├── app.config.ts                  # Configuração do Angular (providers, SSR)
│   └── app.ts                         # Componente raiz
│
├── environments/
│   └── environment.ts                 # Variáveis de ambiente
│
├── styles.css                         # Design System global (variáveis, resets, utilities)
└── index.html                         # HTML raiz
```

---

## 🎨 Design System

O projeto possui um **Design System próprio** implementado inteiramente com CSS Custom Properties, sem dependência de frameworks CSS externos.

### Paleta de Cores

| Token | Valor | Uso |
|---|---|---|
| `--bg-main` | `#09090b` | Background principal da aplicação |
| `--bg-surface` | `#18181b` | Cards, containers, painéis |
| `--bg-surface-hover` | `#27272a` | Hover em superfícies |
| `--accent-primary` | `#e4c590` | Cor de destaque dourada (botões, links, badges) |
| `--text-primary` | `#fafafa` | Texto principal (branco suave) |
| `--text-secondary` | `#a1a1aa` | Texto secundário |
| `--text-muted` | `#71717a` | Texto apagado / labels |

### Status Colors

| Status | Background | Texto |
|---|---|---|
| Pendente | `rgba(245, 158, 11, 0.15)` | `#fcd34d` |
| Confirmado | `rgba(16, 185, 129, 0.15)` | `#6ee7b7` |
| Em Andamento | `rgba(59, 130, 246, 0.15)` | `#93c5fd` |
| Concluído | `rgba(6, 78, 59, 0.2)` | `#6ee7b7` |
| Cancelado | `rgba(239, 68, 68, 0.15)` | `#fca5a5` |

### Tipografia

- **Font Family:** Inter (Google Fonts)
- **Pesos utilizados:** 300, 400, 500, 600, 700, 800

### Componentes Visuais

- **Glassmorphism:** `backdrop-filter: blur()` em headers e cards
- **Glow Effects:** Box-shadows suaves com a cor accent
- **Micro-animações:** Transições em hover, fade-in nos cards, skeleton loading
- **Border Radius:** Sistema padronizado (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`)

---

## 🗺 Rotas da Aplicação

### Autenticação (Públicas)
| Rota | Componente | Título |
|---|---|---|
| `/auth/login` | Login | Login \| Cortês |
| `/auth/register` | Register | Cadastro \| Cortês |

### Painel Administrativo (Guard: `adminGuard`)
| Rota | Componente | Título |
|---|---|---|
| `/admin/dashboard` | Dashboard | Painel Geral \| Cortês |
| `/admin/agendamentos` | Appointments | Agendamentos \| Cortês |
| `/admin/servicos` | Services | Serviços \| Cortês |
| `/admin/horarios` | BusinessHours | Horários \| Cortês |
| `/admin/bloqueios` | BlockedPeriods | Bloqueios \| Cortês |
| `/admin/financeiro` | FinancialReport | Financeiro \| Cortês |

### Área do Cliente (Guard: `clientGuard`)
| Rota | Componente | Título |
|---|---|---|
| `/client/booking` | Booking | Novo Agendamento \| Cortês |
| `/client/history` | History | Meu Histórico \| Cortês |

---

## 🔗 Integração com Backend

O frontend se comunica com **dois microsserviços**:

### 1. Microsserviço de Autenticação (porta 8081)
| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/auth/login` | Autenticação com email e senha |
| `POST` | `/api/auth/register` | Registro de novo usuário |

### 2. Backend Core — Barbershop (porta 8080)
| Método | Endpoint | Descrição | Autorização |
|---|---|---|---|
| `GET` | `/api/appointments` | Listar todos os agendamentos | OWNER |
| `POST` | `/api/appointments` | Criar agendamento | CLIENT |
| `GET` | `/api/appointments/my-history` | Histórico do cliente logado | CLIENT |
| `GET` | `/api/appointments/available-slots` | Horários disponíveis | Público |
| `PATCH` | `/api/appointments/{id}/status` | Atualizar status | OWNER |
| `PATCH` | `/api/appointments/{id}/cancel` | Cancelar agendamento (apenas o próprio, ou qualquer um se OWNER) | CLIENT + OWNER |
| `GET` | `/api/services` | Listar serviços | Público |
| `POST` | `/api/services` | Criar serviço | OWNER |
| `PUT` | `/api/services/{id}` | Atualizar serviço | OWNER |
| `DELETE` | `/api/services/{id}` | Remover serviço | OWNER |
| `GET` | `/api/business-hours` | Listar horários de funcionamento | Público |
| `POST` | `/api/business-hours` | Definir horários | OWNER |
| `GET` | `/api/blocked-periods` | Listar períodos bloqueados | Público |
| `POST` | `/api/blocked-periods` | Bloquear período | OWNER |

---

## 🗓 Roadmap

### v1.0 — MVP (Atual)
- [x] Sistema de autenticação com JWT
- [x] Painel administrativo completo
- [x] Área do cliente com agendamento e histórico
- [x] Design System dark mode

### v1.1 — Melhorias (Próxima)
- [ ] Tela de perfil do usuário (editar nome e telefone)
- [ ] Interceptor para renovação / expiração de token (401 handler)
- [ ] Melhorias de acessibilidade (ARIA labels)
- [ ] Testes unitários com Vitest

### v2.0 — Futuro
- [ ] Notificações push em tempo real (WebSocket)
- [ ] Dashboard com gráficos interativos (Chart.js)
- [ ] Modo claro (light theme)
- [ ] PWA (Progressive Web App) para uso mobile offline
- [ ] Containerização com Docker

---

## 👥 Autores

| Papel | Nome |
|---|---|
| **Desenvolvedor** | Luiz Otávio |
| **Orientador** | — |
| **Instituição** | — |

---

## 📄 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) e é de uso acadêmico.

---

<p align="center">
  <strong>Cortês Barbearia</strong> — Onde tradição encontra tecnologia ✂️
</p>
