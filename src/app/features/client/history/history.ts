import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment, AppointmentStatus } from '../../../core/models/appointment.model';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmModal } from '../../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-history',
  imports: [CommonModule, ConfirmModal],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit {
  private appointmentService = inject(AppointmentService);
  private toast = inject(ToastService);
  
  history: Appointment[] = [];
  filteredHistory: Appointment[] = [];
  loading = true;
  activeFilter: AppointmentStatus | 'ALL' = 'ALL';

  // Confirm modal state
  showCancelModal = false;
  cancellingId: string | null = null;

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.loading = true;
    this.appointmentService.getMyHistory().subscribe({
      next: (data) => {
        this.history = data || [];
        this.applyFilter(this.activeFilter);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading history', err);
        this.loading = false;
        this.toast.error('Erro ao carregar histórico.');
      }
    });
  }

  applyFilter(filter: AppointmentStatus | 'ALL') {
    this.activeFilter = filter;
    if (filter === 'ALL') {
      this.filteredHistory = this.history;
    } else {
      this.filteredHistory = this.history.filter(a => a.status === filter);
    }
  }

  openCancelModal(id: string) {
    this.cancellingId = id;
    this.showCancelModal = true;
  }

  confirmCancel() {
    if (!this.cancellingId) return;
    const id = this.cancellingId;
    this.showCancelModal = false;
    
    this.appointmentService.cancel(id).subscribe({
      next: (updated) => {
        const index = this.history.findIndex(a => a.id === id);
        if (index !== -1) this.history[index] = updated;
        this.applyFilter(this.activeFilter);
        this.toast.success('Agendamento cancelado.');
        this.cancellingId = null;
      },
      error: (err) => {
        console.error('Error cancelling', err);
        this.toast.error('Erro ao cancelar agendamento.');
        this.cancellingId = null;
      }
    });
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.cancellingId = null;
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

  getStatusIcon(status: string): string {
    switch(status) {
      case 'PENDING': return 'ph-hourglass';
      case 'CONFIRMED': return 'ph-check';
      case 'IN_PROGRESS': return 'ph-spinner';
      case 'COMPLETED': return 'ph-check-circle';
      case 'CANCELLED': return 'ph-x-circle';
      default: return 'ph-circle';
    }
  }

  get counts() {
    return {
      all: this.history.length,
      pending: this.history.filter(a => a.status === 'PENDING').length,
      confirmed: this.history.filter(a => a.status === 'CONFIRMED').length,
      completed: this.history.filter(a => a.status === 'COMPLETED').length,
      cancelled: this.history.filter(a => a.status === 'CANCELLED').length,
    };
  }
}
