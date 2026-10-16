import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment } from '../../core/models/appointment.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private appointmentService = inject(AppointmentService);
  
  appointments: Appointment[] = [];
  /** So os de hoje, em ordem de horario: e o que o card "Agenda do Dia" exibe. */
  todayAppointments: Appointment[] = [];
  monthlyRevenue = 0;
  todayAppointmentsCount = 0;
  activeAppointmentsCount = 0;
  averageTicket = 0;
  /** Concluidos do mes corrente: a mesma base da receita e do ticket medio. */
  monthlyCompletedCount = 0;

  statusDistribution = {
    PENDING: 0,
    CONFIRMED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0
  };

  loading = true;

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.appointmentService.getAll().subscribe({
      next: (data) => {
        this.appointments = data || [];
        this.calculateMetrics();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        // Fallback for UI demo when no backend is running
        this.appointments = [];
        this.loading = false;
      }
    });
  }

  calculateMetrics() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const now = new Date();

    let totalRevenue = 0;
    let completedCount = 0;

    this.appointments.forEach(app => {
      // Calculate status distribution
      if (this.statusDistribution[app.status] !== undefined) {
        this.statusDistribution[app.status]++;
      }

      // Check if today
      const appDate = new Date(app.dateTime);
      appDate.setHours(0,0,0,0);
      if (appDate.getTime() === today.getTime()) {
        this.todayAppointmentsCount++;
        this.todayAppointments.push(app);
      }

      // Active
      if (app.status === 'IN_PROGRESS') {
        this.activeAppointmentsCount++;
      }

      // A receita e "do mes": concluidos de outros meses ficam de fora.
      const sameMonth = appDate.getFullYear() === now.getFullYear() && appDate.getMonth() === now.getMonth();
      if (app.status === 'COMPLETED' && sameMonth) {
        totalRevenue += app.price;
        completedCount++;
      }
    });

    this.todayAppointments.sort((a, b) => a.dateTime.localeCompare(b.dateTime));
    this.monthlyRevenue = totalRevenue;
    this.monthlyCompletedCount = completedCount;
    this.averageTicket = completedCount > 0 ? totalRevenue / completedCount : 0;
  }

  translateStatus(status: string): string {
    switch(status) {
      case 'PENDING': return 'Pendente';
      case 'CONFIRMED': return 'Confirmado';
      case 'IN_PROGRESS': return 'Em andamento';
      case 'COMPLETED': return 'Concluído';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  }
}
