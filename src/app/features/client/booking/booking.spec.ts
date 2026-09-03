import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { Booking } from './booking';

/** Formata no fuso local, igual ao componente — sem passar por UTC. */
function isoLocal(d: Date): string {
  const mes = `${d.getMonth() + 1}`.padStart(2, '0');
  const dia = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

describe('Booking', () => {
  let component: Booking;
  let fixture: ComponentFixture<Booking>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Booking],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Booking);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    // detectChanges dispara o ngOnInit, que calcula minDate e busca o catalogo.
    fixture.detectChanges();
    await fixture.whenStable();
    http.match(() => true).forEach(r => r.flush([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('minDate', () => {
    it('usa a data local, nao a UTC', () => {
      // toISOString() converte para UTC: no fuso do Brasil isso empurrava a
      // data minima para amanha a partir das 21h, travando o agendamento
      // para hoje no fim da tarde.
      expect(component.minDate).toBe(isoLocal(new Date()));
    });
  });

  describe('onDateSelected', () => {
    beforeEach(() => {
      component.bookingForm.patchValue({ serviceId: 'algum-servico' });
      component.currentStep = 2;
    });

    it('nao avanca com o ano parcial digitado no input', () => {
      // Um <input type="date"> emite change a cada digito do ano: ao digitar
      // 2026 o valor passa por 0002, 0020 e 0202, e cada um deles e uma data
      // completa para o navegador. Avancar ali jogava o usuario para a tela
      // de horarios com o ano 0002, onde nunca ha slot disponivel.
      for (const anoParcial of ['0002-08-28', '0020-08-28', '0202-08-28']) {
        component.bookingForm.patchValue({ date: anoParcial });
        component.onDateSelected();
        expect(component.currentStep).toBe(2);
      }
    });

    it('nao avanca com data anterior a hoje', () => {
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);

      component.bookingForm.patchValue({ date: isoLocal(ontem) });
      component.onDateSelected();

      expect(component.currentStep).toBe(2);
    });

    it('avanca quando a data esta completa e no futuro', () => {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);

      component.bookingForm.patchValue({ date: isoLocal(amanha) });
      component.onDateSelected();

      expect(component.currentStep).toBe(3);
    });

    it('aceita hoje', () => {
      component.bookingForm.patchValue({ date: isoLocal(new Date()) });
      component.onDateSelected();

      expect(component.currentStep).toBe(3);
    });
  });

  describe('getFormattedTime', () => {
    it('devolve o horario como veio da API, ja em HH:mm', () => {
      component.bookingForm.patchValue({ time: '14:30' });
      expect(component.getFormattedTime()).toBe('14:30');
    });

    it('devolve vazio quando nenhum horario foi escolhido', () => {
      expect(component.getFormattedTime()).toBe('');
    });
  });
});
