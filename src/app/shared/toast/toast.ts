import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div class="toast" [class]="'toast toast-' + toast.type" 
             [class.toast-exit]="toast.exiting"
             (click)="dismiss(toast.id)">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') { <i class="ph ph-check-circle"></i> }
              @case ('error') { <i class="ph ph-x-circle"></i> }
              @case ('warning') { <i class="ph ph-warning"></i> }
              @case ('info') { <i class="ph ph-info"></i> }
            }
          </div>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="dismiss(toast.id); $event.stopPropagation()">
            <i class="ph ph-x"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 420px;
      width: 100%;
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-lg);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.06);
      animation: toastIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
      cursor: pointer;
      pointer-events: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .toast-exit {
      animation: toastOut 0.3s ease-in forwards;
    }
    .toast-success {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
      border-color: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
    }
    .toast-error {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
      border-color: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }
    .toast-warning {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
      border-color: rgba(245, 158, 11, 0.2);
      color: #fcd34d;
    }
    .toast-info {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05));
      border-color: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
    }
    .toast-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    .toast-message {
      flex: 1;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }
    .toast-close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1rem;
      cursor: pointer;
      padding: 2px;
      flex-shrink: 0;
      transition: color 0.2s;
    }
    .toast-close:hover {
      color: var(--text-primary);
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(100px) scale(0.95); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateX(0) scale(1); }
      to { opacity: 0; transform: translateX(100px) scale(0.95); }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  toasts: (Toast & { exiting?: boolean })[] = [];
  private sub!: Subscription;
  private dismissSub!: Subscription;

  ngOnInit() {
    this.sub = this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      if (toast.duration) {
        setTimeout(() => this.dismiss(toast.id), toast.duration);
      }
    });
    this.dismissSub = this.toastService.dismiss$.subscribe(id => {
      this.dismiss(id);
    });
  }

  dismiss(id: number) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast && !toast.exiting) {
      toast.exiting = true;
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 300);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.dismissSub?.unsubscribe();
  }
}
