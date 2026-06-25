import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarberService as BarberServiceApi } from '../../core/services/barber.service';
import { BarberService as BarberServiceModel } from '../../core/models/barber-service.model';

@Component({
  selector: 'app-services',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
  private barberServiceApi = inject(BarberServiceApi);
  private fb = inject(FormBuilder);

  services: BarberServiceModel[] = [];
  loading = true;
  isModalOpen = false;
  editingId: string | null = null;
  
  serviceForm: FormGroup = this.fb.group({
    serviceName: ['', Validators.required],
    description: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0)]],
    durationMin: [null, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.barberServiceApi.getAll().subscribe({
      next: (data) => {
        this.services = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading services', err);
        this.loading = false;
      }
    });
  }

  openModal(service?: BarberServiceModel) {
    if (service) {
      this.editingId = service.id!;
      this.serviceForm.patchValue(service);
    } else {
      this.editingId = null;
      this.serviceForm.reset();
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingId = null;
  }

  saveService() {
    if (this.serviceForm.invalid) return;

    const serviceData: BarberServiceModel = this.serviceForm.value;
    
    if (this.editingId) {
      this.barberServiceApi.update(this.editingId, serviceData).subscribe({
        next: (updated) => {
          const index = this.services.findIndex(s => s.id === this.editingId);
          if(index !== -1) this.services[index] = updated;
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating service', err);
          const index = this.services.findIndex(s => s.id === this.editingId);
          if(index !== -1) this.services[index] = { ...this.services[index], ...serviceData }; // fallback
          this.closeModal();
        }
      });
    } else {
      this.barberServiceApi.create(serviceData).subscribe({
        next: (created) => {
          this.services.push(created);
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating service', err);
          this.services.push({ id: Math.random().toString(), ...serviceData }); // fallback
          this.closeModal();
        }
      });
    }
  }

  deleteService(id: string) {
    if(confirm('Tem certeza que deseja deletar este serviço?')) {
      this.barberServiceApi.delete(id).subscribe({
        next: () => {
          this.services = this.services.filter(s => s.id !== id);
        },
        error: (err) => {
          console.error('Error deleting', err);
          this.services = this.services.filter(s => s.id !== id);
        }
      });
    }
  }
}
