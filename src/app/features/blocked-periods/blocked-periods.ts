import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockedPeriodService } from '../../core/services/blocked-period.service';
import { BlockedPeriod } from '../../core/models/blocked-period.model';

@Component({
  selector: 'app-blocked-periods',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './blocked-periods.html',
  styleUrl: './blocked-periods.css',
})
export class BlockedPeriods implements OnInit {
  private blockedPeriodService = inject(BlockedPeriodService);
  private fb = inject(FormBuilder);

  blockedPeriods: BlockedPeriod[] = [];
  loading = true;
  isModalOpen = false;
  
  bpForm: FormGroup = this.fb.group({
    reason: ['', Validators.required],
    startDateTime: ['', Validators.required],
    endDateTime: ['', Validators.required]
  });

  ngOnInit() {
    this.loadPeriods();
  }

  loadPeriods() {
    this.loading = true;
    this.blockedPeriodService.findAll().subscribe({
      next: (data) => {
        this.blockedPeriods = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading blocked periods', err);
        this.loading = false;
      }
    });
  }

  openModal() {
    this.bpForm.reset();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  savePeriod() {
    if (this.bpForm.invalid) return;
    
    const newBp = { ...this.bpForm.value };
    if (newBp.startDateTime && newBp.startDateTime.length === 16) newBp.startDateTime += ':00';
    if (newBp.endDateTime && newBp.endDateTime.length === 16) newBp.endDateTime += ':00';

    this.blockedPeriodService.create(newBp).subscribe({
      next: (created) => {
        this.blockedPeriods.push(created);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating blocked period', err);
        this.blockedPeriods.push({ id: Math.random().toString(), ...newBp });
        this.closeModal();
      }
    });
  }

  deletePeriod(id: string) {
    if(confirm('Tem certeza que deseja remover este bloqueio?')) {
      this.blockedPeriodService.delete(id).subscribe({
        next: () => {
          this.blockedPeriods = this.blockedPeriods.filter(bp => bp.id !== id);
        },
        error: (err) => {
          console.error('Error deleting blocked period', err);
          this.blockedPeriods = this.blockedPeriods.filter(bp => bp.id !== id);
        }
      });
    }
  }
}
