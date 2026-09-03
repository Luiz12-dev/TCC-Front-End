import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLayout } from './client-layout';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ClientLayout', () => {
  let component: ClientLayout;
  let fixture: ComponentFixture<ClientLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientLayout],
      // Componentes standalone que usam RouterLink precisam do contexto de rotas;
      // os que falam com a API precisam do HttpClient de teste.
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
