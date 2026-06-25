import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  // 1. Preparamos os cabeçalhos. O Ngrok SEMPRE vai.
  let customHeaders = req.headers.set('ngrok-skip-browser-warning', 'true');

  // 2. Se o token existir, adicionamos ele também.
  if (token) {
    customHeaders = customHeaders.set('Authorization', `Bearer ${token}`);
  }

  // 3. Clonamos a requisição UMA ÚNICA VEZ com os cabeçalhos finais.
  const clonedReq = req.clone({
    headers: customHeaders,
  });

  // 4. Enviamos para o servidor.
  return next(clonedReq);
};
