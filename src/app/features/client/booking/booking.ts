import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { BarberService as BarberServiceApi } from '../../../core/services/barber.service';
import { BarberService } from '../../../core/models/barber-service.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class Booking implements OnInit {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private barberServiceApi = inject(BarberServiceApi);
  private router = inject(Router);
  private toast = inject(ToastService);

  services: BarberService[] = [];
  availableSlots: string[] = [];
  selectedService: BarberService | null = null;
  
  bookingForm: FormGroup = this.fb.group({
    serviceId: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required]
  });

  currentStep = 1;
  loadingServices = true;
  loadingSlots = false;
  submitting = false;

  // Minimum date for date picker (today)
  minDate = '';

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.barberServiceApi.getAll().subscribe({
      next: (data) => {
        this.services = data || [];
        this.loadingServices = false;
      },
      error: () => {
        this.loadingServices = false;
        this.toast.error('Erro ao carregar serviços.');
      }
    });

    // Listen for changes to fetch slots
    this.bookingForm.get('date')?.valueChanges.subscribe(date => {
      const serviceId = this.bookingForm.get('serviceId')?.value;
      if (date && serviceId) {
        this.fetchSlots(date, serviceId);
      }
    });

    this.bookingForm.get('serviceId')?.valueChanges.subscribe(serviceId => {
      const date = this.bookingForm.get('date')?.value;
      this.selectedService = this.services.find(s => s.id === serviceId) || null;
      if (date && serviceId) {
        this.fetchSlots(date, serviceId);
      }
    });
  }

  selectService(service: BarberService) {
    this.bookingForm.patchValue({ serviceId: service.id });
    this.selectedService = service;
    this.goToStep(2);
  }

  selectSlot(slot: string) {
    this.bookingForm.patchValue({ time: slot });
    this.goToStep(4);
  }

  goToStep(step: number) {
    if (step === 2 && !this.bookingForm.get('serviceId')?.value) return;
    if (step === 3 && !this.bookingForm.get('date')?.value) return;
    if (step === 4 && !this.bookingForm.get('time')?.value) return;
    this.currentStep = step;
  }

  onDateSelected() {
    const date = this.bookingForm.get('date')?.value;
    if (date) {
      this.goToStep(3);
    }
  }

  fetchSlots(date: string, serviceId: string) {
    this.loadingSlots = true;
    this.availableSlots = [];
    this.bookingForm.patchValue({ time: '' });
    
    this.appointmentService.getAvailableSlots(date, serviceId).subscribe({
      next: (slots) => {
        this.availableSlots = slots || [];
        this.loadingSlots = false;
      },
      error: () => {
        this.loadingSlots = false;
        this.toast.error('Erro ao buscar horários disponíveis.');
      }
    });
  }

  getFormattedDate(): string {
    const date = this.bookingForm.get('date')?.value;
    if (!date) return '';
    const d = new Date(date + 'T12:00:00');
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]}`;
  }

  getFormattedTime(): string {
    const time = this.bookingForm.get('time')?.value;
    if (!time) return '';
    return time.substring(0, 5);
  }

  onSubmit() {
    if (this.bookingForm.invalid) return;
    this.submitting = true;
    
    const formVal = this.bookingForm.value;
    // ensure time has seconds, e.g. "10:00:00"
    const timeWithSeconds = formVal.time.length === 5 ? `${formVal.time}:00` : formVal.time;
    const dateTime = `${formVal.date}T${timeWithSeconds}`;

    this.appointmentService.create({ serviceId: formVal.serviceId, dateTime }).subscribe({
      next: () => {
        this.submitting = false;
        this.currentStep = 5; // Success step
        this.toast.success('Agendamento realizado com sucesso!');
        setTimeout(() => this.router.navigate(['/client/history']), 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.toast.error('Erro ao realizar agendamento. Verifique se o horário já não foi ocupado.');
        console.error(err);
      }
    });
  }
}
