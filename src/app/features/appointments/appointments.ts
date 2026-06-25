import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../core/services/appointment.service';
import { Appointment, AppointmentStatus } from '../../core/models/appointment.model';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnInit {
  private appointmentService = inject(AppointmentService);
  
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  loading = true;
  currentFilter: AppointmentStatus | 'ALL' = 'ALL';

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getAll().subscribe({
      next: (data) => {
        this.appointments = data || [];
        this.applyFilter('ALL');
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading appointments', err);
        this.loading = false;
      }
    });
  }

  applyFilter(filter: AppointmentStatus | 'ALL') {
    this.currentFilter = filter;
    if (filter === 'ALL') {
      this.filteredAppointments = this.appointments;
    } else {
      this.filteredAppointments = this.appointments.filter(app => app.status === filter);
    }
  }

  updateStatus(id: string, newStatus: string) {
    this.appointmentService.updateStatus(id, newStatus).subscribe({
      next: (updated) => {
        const index = this.appointments.findIndex(a => a.id === id);
        if(index !== -1) this.appointments[index] = updated;
        this.applyFilter(this.currentFilter);
      },
      error: (err) => console.error('Error updating status', err)
    });
  }

  cancelAppointment(id: string) {
    if(confirm('Deseja realmente cancelar este agendamento?')) {
      this.appointmentService.cancel(id).subscribe({
        next: (updated) => {
          const index = this.appointments.findIndex(a => a.id === id);
          if(index !== -1) this.appointments[index] = updated;
          this.applyFilter(this.currentFilter);
        },
        error: (err) => console.error('Error cancelling appointment', err)
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'PENDING': return 'status-badge pending';
      case 'CONFIRMED': return 'status-badge confirmed';
      case 'IN_PROGRESS': return 'status-badge progress';
      case 'COMPLETED': return 'status-badge done';
      case 'CANCELLED': return 'status-badge cancelled';
      default: return 'status-badge pending';
    }
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

  getClientInitials(app: Appointment): string {
    const name = app.clientName || 'CL';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
