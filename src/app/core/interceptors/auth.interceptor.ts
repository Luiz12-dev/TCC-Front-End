import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/** O login e o cadastro respondem 401/403 por credencial errada, nao por sessao expirada. */
const ROTAS_PUBLICAS_DE_AUTH = ['/login', '/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  const token = authService.getToken();

  // Cabeçalhos que desarmam as telas de aviso do ngrok e do localtunnel,
  // usados nas demonstrações remotas.
  let headers = req.headers
    .set('ngrok-skip-browser-warning', 'true')
    .set('Bypass-Tunnel-Reminder', 'true');

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  return next(req.clone({ headers })).pipe(
    catchError((erro: HttpErrorResponse) => {
      const ehRotaDeAuth = ROTAS_PUBLICAS_DE_AUTH.some(r => req.url.includes(r));

      // Sem este bloco, um token expirado deixava a tela renderizar o estado
      // vazio ("Você ainda não possui agendamentos") como se os dados tivessem
      // sumido, enquanto a UI continuava se achando logada.
      if (erro.status === 401 && !ehRotaDeAuth) {
        authService.clearSession();
        toast.warning('Sua sessão expirou. Faça login novamente.');
        router.navigate(['/auth/login']);
      }

      return throwError(() => erro);
    })
  );
};
