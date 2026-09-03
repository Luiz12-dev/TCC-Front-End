import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { environment } from '../../../environments/environment';

function tokenCom(payload: Record<string, unknown>): string {
  const base64url = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${base64url({ alg: 'HS512' })}.${base64url(payload)}.assinatura`;
}

const VALIDO = () => tokenCom({ sub: 'a@b.com', exp: Math.floor(Date.now() / 1000) + 3600 });

describe('authInterceptor', () => {
  let http: HttpClient;
  let mock: HttpTestingController;
  let navegouPara: string[];

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    mock = TestBed.inject(HttpTestingController);
    navegouPara = [];
    vi.spyOn(TestBed.inject(Router), 'navigate').mockImplementation((cmd: any) => {
      navegouPara.push(Array.isArray(cmd) ? cmd.join('/') : String(cmd));
      return Promise.resolve(true);
    });
  });

  afterEach(() => {
    mock.verify();
    localStorage.clear();
  });

  it('anexa o Bearer quando ha token', () => {
    const token = VALIDO();
    localStorage.setItem('token', token);

    http.get('/api/qualquer').subscribe();

    const req = mock.expectOne('/api/qualquer');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  it('nao anexa Authorization quando nao ha token', () => {
    http.get('/api/qualquer').subscribe();

    const req = mock.expectOne('/api/qualquer');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('em 401 descarta a sessao e manda para o login', () => {
    // Sem isso, a tela renderizava o estado vazio como se os dados
    // tivessem sumido, com a UI ainda se achando logada.
    localStorage.setItem('token', VALIDO());

    http.get('/api/appointments/my-history').subscribe({ error: () => {} });

    mock.expectOne('/api/appointments/my-history')
      .flush('expirado', { status: 401, statusText: 'Unauthorized' });

    expect(localStorage.getItem('token')).toBeNull();
    expect(navegouPara).toContain('/auth/login');
  });

  it('nao trata 401 do login como sessao expirada', () => {
    // No /login, 401 significa credencial errada. Redirecionar aqui
    // esconderia a mensagem "E-mail ou senha incorretos".
    http.post(`${environment.authUrl}/login`, {}).subscribe({ error: () => {} });

    mock.expectOne(`${environment.authUrl}/login`)
      .flush('credencial invalida', { status: 401, statusText: 'Unauthorized' });

    expect(navegouPara).toHaveLength(0);
  });

  it('repassa erros que nao sao 401', () => {
    localStorage.setItem('token', VALIDO());
    let statusRecebido = 0;

    http.get('/api/appointments').subscribe({ error: (e) => (statusRecebido = e.status) });

    mock.expectOne('/api/appointments')
      .flush('erro interno', { status: 500, statusText: 'Server Error' });

    expect(statusRecebido).toBe(500);
    expect(localStorage.getItem('token')).not.toBeNull();
    expect(navegouPara).toHaveLength(0);
  });
});
