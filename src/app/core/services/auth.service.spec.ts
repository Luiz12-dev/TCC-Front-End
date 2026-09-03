import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

/** Monta um JWT sem assinatura valida — o front so le o payload, nunca verifica. */
function tokenCom(payload: Record<string, unknown>): string {
  const base64url = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${base64url({ alg: 'HS512' })}.${base64url(payload)}.assinatura`;
}

const DAQUI_UMA_HORA = () => Math.floor(Date.now() / 1000) + 3600;
const UMA_HORA_ATRAS = () => Math.floor(Date.now() / 1000) - 3600;

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => localStorage.clear());

  describe('isAuthenticated', () => {
    it('aceita um token dentro da validade', () => {
      localStorage.setItem('token', tokenCom({ sub: 'a@b.com', exp: DAQUI_UMA_HORA() }));
      service = TestBed.inject(AuthService);

      expect(service.isAuthenticated()).toBe(true);
    });

    it('recusa um token vencido', () => {
      localStorage.setItem('token', tokenCom({ sub: 'a@b.com', exp: UMA_HORA_ATRAS() }));
      service = TestBed.inject(AuthService);

      expect(service.isAuthenticated()).toBe(false);
    });

    it('recusa um token sem claim exp', () => {
      // Na duvida tratamos como expirado: e mais seguro mandar ao login
      // do que deixar a tela quebrar depois.
      localStorage.setItem('token', tokenCom({ sub: 'a@b.com' }));
      service = TestBed.inject(AuthService);

      expect(service.isAuthenticated()).toBe(false);
    });

    it('recusa um token ilegivel', () => {
      localStorage.setItem('token', 'isso-nao-e-um-jwt');
      service = TestBed.inject(AuthService);

      expect(service.isAuthenticated()).toBe(false);
    });

    it('recusa quando nao ha token', () => {
      service = TestBed.inject(AuthService);

      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('limpeza no bootstrap', () => {
    it('descarta token vencido assim que o servico e criado', () => {
      // Cobre a carga completa da pagina: o SSR resolve a rota no servidor,
      // onde localStorage nao existe, entao o token vencido sobrevivia.
      localStorage.setItem('token', tokenCom({ sub: 'a@b.com', exp: UMA_HORA_ATRAS() }));

      TestBed.inject(AuthService);

      expect(localStorage.getItem('token')).toBeNull();
    });

    it('preserva token valido', () => {
      const valido = tokenCom({ sub: 'a@b.com', exp: DAQUI_UMA_HORA() });
      localStorage.setItem('token', valido);

      TestBed.inject(AuthService);

      expect(localStorage.getItem('token')).toBe(valido);
    });
  });

  describe('getUserRole', () => {
    it('le o formato roles[] emitido pelo servico de autenticacao', () => {
      localStorage.setItem('token', tokenCom({ roles: ['ROLE_OWNER'], exp: DAQUI_UMA_HORA() }));
      service = TestBed.inject(AuthService);

      expect(service.getUserRole()).toBe('ROLE_OWNER');
    });

    it('devolve string vazia quando o token e ilegivel', () => {
      localStorage.setItem('token', 'quebrado');
      service = TestBed.inject(AuthService);

      expect(service.getUserRole()).toBe('');
    });
  });

  describe('login', () => {
    it('guarda o accessToken devolvido pela API', () => {
      service = TestBed.inject(AuthService);
      const token = tokenCom({ sub: 'a@b.com', exp: DAQUI_UMA_HORA() });

      service.login({ email: 'a@b.com', password: '123456' }).subscribe();

      const req = http.expectOne(`${environment.authUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush({ accessToken: token, type: 'Bearer' });

      expect(localStorage.getItem('token')).toBe(token);
    });
  });

  describe('clearSession', () => {
    it('remove o token sem navegar', () => {
      localStorage.setItem('token', tokenCom({ sub: 'a@b.com', exp: DAQUI_UMA_HORA() }));
      service = TestBed.inject(AuthService);

      service.clearSession();

      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
