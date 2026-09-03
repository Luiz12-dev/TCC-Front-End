import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  
  // Skip guard on server-side rendering — let the browser handle it
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  authService.clearSession();
  router.navigate(['/auth/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    // Descarta o token vencido aqui: o guard corta a navegacao antes de
    // qualquer requisicao, entao o interceptor nao chega a limpar.
    authService.clearSession();
    router.navigate(['/auth/login']);
    return false;
  }

  const role = authService.getUserRole();
  if (role === 'OWNER' || role === 'ROLE_OWNER') {
    return true;
  }

  router.navigate(['/client/booking']);
  return false;
};

export const clientGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    // Descarta o token vencido aqui: o guard corta a navegacao antes de
    // qualquer requisicao, entao o interceptor nao chega a limpar.
    authService.clearSession();
    router.navigate(['/auth/login']);
    return false;
  }

  // Simetrico ao adminGuard: um OWNER logado nao deve cair na area de
  // cliente, onde as telas assumem que o usuario e o dono do agendamento.
  const role = authService.getUserRole();
  if (role === 'OWNER' || role === 'ROLE_OWNER') {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  return true;
};
