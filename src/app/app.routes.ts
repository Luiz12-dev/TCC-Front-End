import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { ClientLayout } from './layout/client-layout/client-layout';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { Dashboard } from './features/dashboard/dashboard';
import { Appointments } from './features/appointments/appointments';
import { Services } from './features/services/services';
import { BusinessHours } from './features/business-hours/business-hours';
import { BlockedPeriods } from './features/blocked-periods/blocked-periods';
import { FinancialReport } from './features/financial-report/financial-report';

import { Booking } from './features/client/booking/booking';
import { History } from './features/client/history/history';

import { adminGuard, clientGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth Routes
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login, title: 'Login | Cortês' },
      { path: 'register', component: Register, title: 'Cadastro | Cortês' },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  
  // Admin Routes
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: Dashboard, title: 'Painel Geral | Cortês' },
      { path: 'agendamentos', component: Appointments, title: 'Agendamentos | Cortês' },
      { path: 'servicos', component: Services, title: 'Serviços | Cortês' },
      { path: 'horarios', component: BusinessHours, title: 'Horários | Cortês' },
      { path: 'bloqueios', component: BlockedPeriods, title: 'Bloqueios | Cortês' },
      { path: 'financeiro', component: FinancialReport, title: 'Financeiro | Cortês' },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Client Routes
  {
    path: 'client',
    component: ClientLayout,
    canActivate: [clientGuard],
    children: [
      { path: 'booking', component: Booking, title: 'Novo Agendamento | Cortês' },
      { path: 'history', component: History, title: 'Meu Histórico | Cortês' },
      { path: '', redirectTo: 'booking', pathMatch: 'full' }
    ]
  },

  // Fallback
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];
