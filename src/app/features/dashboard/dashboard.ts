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
  monthlyRevenue = 0;
  todayAppointmentsCount = 0;
  activeAppointmentsCount = 0;
  averageTicket = 0;

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
      }

      // Active
      if (app.status === 'IN_PROGRESS') {
        this.activeAppointmentsCount++;
      }

      // Completed / Revenue
      if (app.status === 'COMPLETED') {
        totalRevenue += app.price;
        completedCount++;
      }
    });

    this.monthlyRevenue = totalRevenue;
    this.averageTicket = completedCount > 0 ? totalRevenue / completedCount : 0;
  }
}
