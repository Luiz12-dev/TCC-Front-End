import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { adminGuard, authGuard, clientGuard } from './auth.guard';

function tokenCom(payload: Record<string, unknown>): string {
  const base64url = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${base64url({ alg: 'HS512' })}.${base64url(payload)}.assinatura`;
}

const DAQUI_UMA_HORA = () => Math.floor(Date.now() / 1000) + 3600;
const UMA_HORA_ATRAS = () => Math.floor(Date.now() / 1000) - 3600;

/** Os guards sao funcoes; precisam rodar dentro de um contexto de injecao. */
function rodar(guard: typeof authGuard): boolean {
  return TestBed.runInInjectionContext(() => guard(null as any, null as any)) as boolean;
}

describe('guards de rota', () => {
  let router: Router;
  let navegouPara: string[];

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    router = TestBed.inject(Router);
    navegouPara = [];
    vi.spyOn(router, 'navigate').mockImplementation((cmd: any) => {
      navegouPara.push(Array.isArray(cmd) ? cmd.join('/') : String(cmd));
      return Promise.resolve(true);
    });
  });

  afterEach(() => localStorage.clear());

  describe('sem sessao valida', () => {
    it('authGuard manda para o login', () => {
      expect(rodar(authGuard)).toBe(false);
      expect(navegouPara).toContain('/auth/login');
    });

    it('descarta o token vencido ao barrar', () => {
      // O guard corta a navegacao antes de qualquer requisicao, entao o
      // interceptor nao chega a limpar — quem limpa aqui e o proprio guard.
      localStorage.setItem('token', tokenCom({ sub: 'a@b.com', exp: UMA_HORA_ATRAS() }));

      rodar(clientGuard);

      expect(localStorage.getItem('token')).toBeNull();
      expect(navegouPara).toContain('/auth/login');
    });
  });

  describe('adminGuard', () => {
    it('deixa o OWNER passar', () => {
      localStorage.setItem('token', tokenCom({ roles: ['ROLE_OWNER'], exp: DAQUI_UMA_HORA() }));

      expect(rodar(adminGuard)).toBe(true);
      expect(navegouPara).toHaveLength(0);
    });

    it('desvia o CLIENT para a area de cliente', () => {
      localStorage.setItem('token', tokenCom({ roles: ['ROLE_CLIENT'], exp: DAQUI_UMA_HORA() }));

      expect(rodar(adminGuard)).toBe(false);
      expect(navegouPara).toContain('/client/booking');
    });
  });

  describe('clientGuard', () => {
    it('deixa o CLIENT passar', () => {
      localStorage.setItem('token', tokenCom({ roles: ['ROLE_CLIENT'], exp: DAQUI_UMA_HORA() }));

      expect(rodar(clientGuard)).toBe(true);
      expect(navegouPara).toHaveLength(0);
    });

    it('desvia o OWNER para o painel', () => {
      // As telas de cliente assumem que o usuario e o dono do agendamento.
      localStorage.setItem('token', tokenCom({ roles: ['ROLE_OWNER'], exp: DAQUI_UMA_HORA() }));

      expect(rodar(clientGuard)).toBe(false);
      expect(navegouPara).toContain('/admin/dashboard');
    });
  });
});
