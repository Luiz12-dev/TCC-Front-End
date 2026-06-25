import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessHoursService } from '../../core/services/business-hours.service';
import { BusinessHours as BusinessHoursModel } from '../../core/models/business-hours.model';

@Component({
  selector: 'app-business-hours',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './business-hours.html',
  styleUrl: './business-hours.css',
})
export class BusinessHours implements OnInit {
  private businessHoursService = inject(BusinessHoursService);
  private fb = inject(FormBuilder);

  businessHours: BusinessHoursModel[] = [];
  loading = true;
  isModalOpen = false;
  
  bhForm: FormGroup = this.fb.group({
    dayOfWeek: ['MONDAY', Validators.required],
    openTime: ['09:00', Validators.required],
    closeTime: ['18:00', Validators.required],
    active: [true]
  });

  ngOnInit() {
    this.loadBusinessHours();
  }

  loadBusinessHours() {
    this.loading = true;
    this.businessHoursService.findAll().subscribe({
      next: (data) => {
        this.businessHours = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading business hours', err);
        this.loading = false;
      }
    });
  }

  formatDayOfWeek(day: string): string {
    const days: any = {
      'MONDAY': 'Segunda-feira',
      'TUESDAY': 'Terça-feira',
      'WEDNESDAY': 'Quarta-feira',
      'THURSDAY': 'Quinta-feira',
      'FRIDAY': 'Sexta-feira',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    };
    return days[day] || day;
  }

  openModal() {
    this.bhForm.reset({ dayOfWeek: 'MONDAY', openTime: '09:00', closeTime: '18:00', active: true });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveBusinessHour() {
    if (this.bhForm.invalid) return;
    
    const newBh = this.bhForm.value;
    
    if(newBh.openTime && newBh.openTime.length === 5) newBh.openTime += ':00';
    if(newBh.closeTime && newBh.closeTime.length === 5) newBh.closeTime += ':00';

    this.businessHoursService.create(newBh).subscribe({
      next: (created) => {
        this.businessHours.push(created);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating business hour', err);
        this.businessHours.push({ id: Math.random().toString(), ...newBh });
        this.closeModal();
      }
    });
  }

  deleteHour(id: string) {
    if(confirm('Tem certeza que deseja deletar este horário?')) {
      this.businessHoursService.delete(id).subscribe({
        next: () => {
          this.businessHours = this.businessHours.filter(bh => bh.id !== id);
        },
        error: (err) => {
          console.error('Error deleting', err);
          this.businessHours = this.businessHours.filter(bh => bh.id !== id);
        }
      });
    }
  }
}
