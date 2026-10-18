import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Dashboard } from './dashboard';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment, AppointmentStatus } from '../../core/models/appointment.model';

/** Data local no formato que a API devolve (LocalDateTime, sem fuso). */
function emDias(dias: number, hora: string): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${hora}:00`;
}

/** O que a API realmente devolve: serviceName e clientName achatados, sem objeto service. */
function agendamento(dateTime: string, status: AppointmentStatus, price = 30): Appointment {
  return { dateTime, status, price, serviceName: 'Corte Social', clientName: 'Carlos Mendes' } as Appointment;
}

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  async function montar(dados: Appointment[]) {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [{ provide: AppointmentService, useValue: { getAll: () => of(dados) } }],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', async () => {
    await montar([]);
    expect(component).toBeTruthy();
  });

  it('a agenda do dia mostra so os agendamentos de hoje, em ordem de horario', async () => {
    await montar([
      agendamento(emDias(0, '16:00'), 'PENDING'),
      agendamento(emDias(1, '09:00'), 'CONFIRMED'),
      agendamento(emDias(0, '10:00'), 'CONFIRMED'),
    ]);

    expect(component.todayAppointments.map(a => a.dateTime)).toEqual([
      emDias(0, '10:00'),
      emDias(0, '16:00'),
    ]);
  });

  it('mostra o nome do servico e do cliente que a API devolve', async () => {
    await montar([agendamento(emDias(0, '10:00'), 'CONFIRMED')]);

    const texto = fixture.nativeElement.querySelector('.agenda-card').textContent;
    expect(texto).toContain('Corte Social');
    expect(texto).toContain('Carlos Mendes');
    expect(texto).toContain('CONFIRMADO');
  });

  it('a receita mensal soma so os concluidos do mes corrente', async () => {
    const mesPassado = new Date();
    mesPassado.setDate(1);
    mesPassado.setMonth(mesPassado.getMonth() - 1);
    const p = (n: number) => String(n).padStart(2, '0');
    const doMesPassado = `${mesPassado.getFullYear()}-${p(mesPassado.getMonth() + 1)}-10T10:00:00`;

    await montar([
      agendamento(emDias(0, '10:00'), 'COMPLETED', 35),
      agendamento(doMesPassado, 'COMPLETED', 100),
      agendamento(emDias(0, '11:00'), 'CANCELLED', 50),
    ]);

    expect(component.monthlyRevenue).toBe(35);
    expect(component.averageTicket).toBe(35);
    expect(component.monthlyCompletedCount).toBe(1);

    // A distribuicao por status, ao contrario, conta todos os meses. Sem o
    // aviso na tela, o leitor ve "1 concluido no mes" ao lado de "2
    // concluidos" e acha que e erro.
    expect(component.statusDistribution.COMPLETED).toBe(2);
    expect(fixture.nativeElement.querySelector('.status-scope').textContent).toContain('Todos os agendamentos');
  });
});
